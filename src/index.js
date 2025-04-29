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

function setup() {
    blurWholePage();
    loadPage();
    const inp = document.querySelector('input.search');
    inp.addEventListener('focus', searchFocus );
};

async function loadPage() {
    const data = await grabber.getData();
    console.log( `requesting data` );
    console.log( data.days[0].temp );

    updatePageInfo( data );
    updateHourlyChart( data );
};

function tempToBarHeight( t ) {
    // console.log( `taking Temp: ${t}; new Height ${ ( t + barshift) / 2 }`);
    let adj_temp = t + barshift; // 80+30
    adj_temp /= chartHeight; // 110/160
    adj_temp = Math.tanh( adj_temp ); // .645
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
}

function blurWholePage(){
    pageModifier.unblur( pageModifier.GRADIENT );
    pageModifier.blur( pageModifier.CURRENTCONDITIONS );
    pageModifier.blur( pageModifier.FORECASTHOURLY );
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

async function updateHourlyChart( data ) {
    console.log( `updating hourly chart` );
    let hour = parser.getCurrent_Hour( data );
    let day = parser.getCurrent_Day( data );
    console.log( `current Hour: ${hour}` );
    console.log( `current Day: ${day}` );

    // const daysJSON = parser.getDays( data );

    let dayJSON = parser.getDay( data, day );
    let hrJSON;
    let hr_data = { hr:0, temp:0, uvindex:0, icon:0, height:0 };
    const chartUl = document.getElementById( 'hourly-chart' );
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

        // console.log(`hour: ${ hr_data.hr }`);
        // console.log(`temp: ${ hr_data.temp }`);
        // console.log(`uv index: ${ hr_data.uvindex }`);
        // console.log(`icon: ${ hr_data.icon }`);
        // console.log(`precip: ${ hr_data.precip }`);

        let HTML = pageBuilder.getHTML_Bar( `bar`, hr_data );

        chartUl.appendChild( HTML );
    };

    // console.log( chartUl.querySelector() );

    // console.log('adding height');

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


setup();