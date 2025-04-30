import './assets/style.css';
import { Grabber, Parser } from './assets/modules/DATAmanager';
import { PageBuilder, PageModifier } from './assets/modules/HTMLbuilder';

console.log('hello world!');


const grabber = new Grabber( true )
const parser = new Parser();
const pageModifier = new PageModifier();
const pageBuilder = new PageBuilder();
const chartHeight = 160;
const barshift = 60;
let displayDay = 0;

async function setup() {

    resize();
    // CLEAR PAGE!
    blurWholePage();
    console.log( `requesting data` );
    const data = await grabber.getData();
    loadPage( data );
    const inpt = document.querySelector('input.search');
    inpt.addEventListener('focus', searchFocus );
};

function resize() {
    const upperDiv = document.querySelector( 'div.upper' );
    const tenDay = document.getElementById( 'ten-day' );

    const upperStyle = getComputedStyle(upperDiv);
    const left = parseInt( upperStyle.marginLeft ) + parseInt( upperStyle.paddingLeft );

    // CENTER IT IF YOU CAN
    // DISABLE PANNING IF IT'S ENTIRELY VISIBLE
    tenDay.style.transform = `translateX( ${ left }px)`;
}

function loadPage( data ) {
    updatePageInfo( data );
    updateHourlyChart( data );
    updateTenDay( data );
};

function tempToBarHeight( t ) {
    // console.log( `taking Temp: ${t}; new Height ${ ( t + barshift) / 2 }`);
    let adj_temp = t + barshift; // 80+30
    adj_temp /= chartHeight; // 110/160
    adj_temp = Math.tanh( adj_temp ); // .645 = .49
    adj_temp *= chartHeight; // .49 * 160
    adj_temp = Math.min( adj_temp, chartHeight );
    return adj_temp;
    // return Math.min( ( t + barshift), chartHeight );
}

function searchFocus( e ) {
    blurWholePage();
    e.currentTarget.addEventListener( 'blur', searchBlur );
};

function searchBlur( e ) {
    unblurWholePage();
};

function transition(){
    console.log( `transitioning` );

};

function blurWholePage(){
    pageModifier.unblur( pageModifier.GRADIENT );
    pageModifier.blur( pageModifier.CURRENTCONDITIONS );
    pageModifier.blur( pageModifier.FORECASTHOURLY );
    // pageModifier.blur( pageModifier.FORECAS );

}

function unblurWholePage(){
    pageModifier.blur( pageModifier.GRADIENT );
    pageModifier.unblur( pageModifier.CURRENTCONDITIONS );
    pageModifier.unblur( pageModifier.FORECASTHOURLY );
}

function updatePageInfo( data ) {
    console.log( 'updating page info' );
    const currJSON = parser.getCurrent( data );
    pageModifier.write( pageModifier.CITY, parser.getCity( data ) );

    pageModifier.write( pageModifier.CONDITIONS, parser.getConditions( currJSON ) );
    pageModifier.write( pageModifier.TEMP, parser.getTemp( currJSON ) );
    pageModifier.write( pageModifier.FEELSLIKE, parser.getFeelsLike( currJSON ) );
    pageModifier.write( pageModifier.PRECIP, parser.getPrecip( currJSON ) );
    pageModifier.write( pageModifier.UVINDEX, parser.getUVIndex( currJSON ) );

    unblurWholePage();
};

function changeDisplay( e ) {

    transition();

    let li = e.currentTarget.closest( 'li' );
    console.log( li );
    console.log( `switching to ${ li.id }, current page ${displayDay}`);
    displayDay = li.id.split("-")[ 1 ];
};

async function updateHourlyChart( data ) {
    console.log( `updating hourly chart` );
    let hour = parser.getCurrent_Hour( data );
    let day = parser.getCurrent_Day( data );
    console.log( `current Hour: ${hour}` );
    console.log( `current Day: ${day}` );

    let dayJSON = parser.getDay( data, day );
    let hrJSON;
    let hr_data = {};

    // MOVE TO PAGE MOD
    const chartUl = pageModifier.HOURLYCHART; //document.getElementById( 'hourly-chart' );
    chartUl.textContent = '';

    for ( let bar = 0; bar < 10; bar ++ ) {
        hr_data.hr = bar + hour;
        if ( hr_data.hr >= 24 ) {
            day += 1;
            hour = -bar;
            hr_data.hr = 0;
        };
        hrJSON = parser.getHour( dayJSON, hr_data.hr );

        hr_data.temp = parser.getTemp( hrJSON );
        hr_data.uvindex = parser.getUVIndex( hrJSON );
        hr_data.icon = parser.getIcon( hrJSON );
        hr_data.precip = parser.getPrecip( hrJSON );
        hr_data.height = tempToBarHeight( hr_data.temp );
        hr_data.hr = ( bar < 1 ) ? 'NOW' : `${ hr_data.hr}:00`;

        let HTML = pageBuilder.getHTML_Bar( `bar`, hr_data );
        chartUl.appendChild( HTML );
    };

    // DELAYED CHART DRAW
    await new Promise( ( resolve, reject ) => setTimeout( resolve, 1000 ) );        
    let n = 0;
    console.log('adding height');
    Array.from( chartUl.children ).forEach( li => {
        const t = li.querySelector( 'p.temp' ).textContent;
        const bar = li.querySelector( 'div.bar-fill' );
        bar.style.height = tempToBarHeight( parseInt( t ) ) + 'px';
        bar.style.transitionDelay = `${n * 0.06}s`;
        n+=1;
    });
};

function updateTenDay( data ) {

    const tenDayUL = document.getElementById( 'ten-day' );
    tenDayUL.textContent = '';

    let dayJSON;
    let date_data = { temp_high:0, temp_low:0, uvindex:4, icon:'fog', precip:0, day_of:0, date:0 };

    for ( let day = 0; day < 10; day ++ ) {
        dayJSON = parser.getDay( data, day );


        date_data.temp_high = parser.getTempHigh( dayJSON );
        date_data.temp_low = parser.getLow( dayJSON );
        date_data.uvindex = parser.getUVIndex( dayJSON );
        date_data.icon = parser.getIcon( dayJSON );
        date_data.precip = parser.getPrecip( dayJSON );
        date_data.day_of = parser.getDayOf( dayJSON );
        date_data.date = parser.getDate( dayJSON );

        if( day < 1 ){ date_data.day_of = 'Today' };

        let HTML = pageBuilder.getHTML_TenDayButton( day, date_data );
        tenDayUL.appendChild( HTML );
        HTML.querySelector( 'button' ).addEventListener( 'click', changeDisplay );
    };
};

setup();