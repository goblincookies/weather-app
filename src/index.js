import './assets/style.css';
import { Grabber, Parser } from './assets/modules/DATAmanager';
import { PageBuilder, PageModifier } from './assets/modules/HTMLbuilder';
import { Interactions } from './assets/modules/ACTIONmanager';
import { AutoComplete } from './assets/modules/Autocomplete';



const grabber = new Grabber( false )
const parser = new Parser();
const pageModifier = new PageModifier();
const pageBuilder = new PageBuilder();
// const interactions = new Interactions();
const interactionChart = new Interactions();
const interactionTenDay = new Interactions();
const autoComplete = new AutoComplete();


const chartHeight = 60;
const barshift = 60;
let displayDay = 0;

async function setup() {

    // resize();
    interactionChart.watch( pageModifier.HOURLYCHART )
    interactionTenDay.watch( pageModifier.TENDAY )
    autoComplete.watch( pageModifier.SEARCH );
    
    // CLEAR PAGE!
    blurWholePage();
    console.log( `requesting data` );
    // const data = await grabber.getData();
    const data = await grabber.getData( 'newark' );
    console.log( 'passed getting data today' );
    loadPage( data );
    const inpt = document.querySelector('input.search');
    inpt.addEventListener('focus', searchFocus );

};

function loadPage( data ) {

    interactionTenDay.reset( pageModifier.TENDAY );
    interactionChart.reset( pageModifier.HOURLYCHART );

    updatePageInfo( data );
    updateSummary( data, 0 );
    updateHourlyChart( data, 0 );
    updateTenDay( data );
};

function tempToBarHeight( t ) {
    return barshift + ( t * chartHeight );
};

function colapseBars(){
    const chartUl = pageModifier.HOURLYCHART;
    let n = 0;
    Array.from( chartUl.children ).forEach( li => {
        const bar = li.querySelector( 'div.bar-fill' );
        bar.style.height = '0px';
        bar.style.transitionDelay = `${n * 0.02}s`;
        n += 1;
    });
}

function searchFocus( e ) {
    blurWholePage();
    colapseBars();
    e.currentTarget.addEventListener( 'blur', searchBlur );
    console.log( 'id directly?' );

    let name = e.currentTarget.name;
};

async function searchBlur( e ) {
    const search = e.currentTarget.value;
    console.log( `searching!!: : : ${ search }` );
    const data = await grabber.getData( search );
    loadPage( data );
    unblurWholePage();
};

function blurChart() {
    pageModifier.unblur( pageModifier.GRADIENT );
    pageModifier.blur( pageModifier.CURRENTCONDITIONS );
    pageModifier.blur( pageModifier.FORECASTHOURLY );
};

function unblurChart() {
    pageModifier.blur( pageModifier.GRADIENT );
    pageModifier.unblur( pageModifier.CURRENTCONDITIONS );
    pageModifier.unblur( pageModifier.FORECASTHOURLY );
};

function blurWholePage() {
    pageModifier.unblur( pageModifier.GRADIENT );
    pageModifier.blur( pageModifier.CURRENTCONDITIONS );
    pageModifier.blur( pageModifier.FORECASTHOURLY );
    pageModifier.blur( pageModifier.FORECASTTENDAY );
}

function unblurWholePage() {
    pageModifier.blur( pageModifier.GRADIENT );
    pageModifier.unblur( pageModifier.CURRENTCONDITIONS );
    pageModifier.unblur( pageModifier.FORECASTHOURLY );
    pageModifier.unblur( pageModifier.FORECASTTENDAY );
}

function updatePageInfo( data ) {
    const currJSON = parser.getCurrent( data );
    pageModifier.write( pageModifier.CITY, parser.getCity( data ) );

    unblurWholePage();
};

function updateSummary( data, day ){

    let JSON = day < 1 ? parser.getCurrent( data ) : parser.getDay( data, day );

    pageModifier.write( pageModifier.CONDITIONS, parser.getConditions( JSON ) );
    pageModifier.write( pageModifier.TEMP, parser.getTemp( JSON ) );
    pageModifier.write( pageModifier.FEELSLIKE, parser.getFeelsLike( JSON ) );
    pageModifier.write( pageModifier.PRECIP, parser.getPrecip( JSON ) );
    pageModifier.write( pageModifier.UVINDEX, parser.getUVIndex( JSON ) );

};

async function changeDisplay( e ) {

    let li = e.currentTarget.closest( 'li' );
    let id = li.id.split("-")[ 1 ];

    
    if ( id != displayDay ) {
        // transition();
        pageBuilder.removeButtonSelect( displayDay );
        pageBuilder.addButtonSelect( id );
        
        // console.log( li );
        console.log( `switching to ${ id }, current page ${ displayDay }`);
        displayDay = id;
        
        colapseBars();
        blurChart();
        await new Promise( ( resolve, reject ) => setTimeout( resolve, 800 ) );
        updateSummary( grabber.fetchedData, id );
        updateHourlyChart( grabber.fetchedData, id );
        unblurChart();
    };
};

async function updateHourlyChart( data, day ) {

    let hour = day < 1 ? parser.getCurrent_Hour( data ): 0 ;

    let dayJSON = parser.getDay( data, day );
    let hrJSON;
    let hr_data = {};

    const chartUl = pageModifier.HOURLYCHART;
    interactionChart.reset( chartUl );

    chartUl.textContent = '';

    let tempMax = -100;
    let tempMin = 100;

    for ( let bar = 0; bar + hour < 24; bar ++ ) {
        hr_data.hr = bar + hour;
        hrJSON = parser.getHour( dayJSON, hr_data.hr );
        hr_data.temp = parser.getTemp( hrJSON );
        hr_data.uvindex = parser.getUVIndex( hrJSON );
        hr_data.icon = parser.getIcon( hrJSON );
        hr_data.precip = parser.getPrecip( hrJSON );
        hr_data.height = tempToBarHeight( hr_data.temp );

        hr_data.hr = ( bar < 1 && day < 1 ) ? 'NOW' : `${ hr_data.hr}:00`;

        let HTML = pageBuilder.getHTML_Bar( `bar`, hr_data );
        chartUl.appendChild( HTML );
        tempMax = Math.max( hr_data.temp, tempMax );
        tempMin = Math.min( hr_data.temp, tempMin );
    };

    // DELAYED CHART DRAW
    await new Promise( ( resolve, reject ) => setTimeout( resolve, 800 ) );
    let n = 0;
    // console.log('adding height');
    Array.from( chartUl.children ).forEach( li => {
        const t = li.querySelector( 'p.temp' ).textContent;
        const bar = li.querySelector( 'div.bar-fill' );
        let norm = 0.5;
        if ( tempMax - tempMin > 1 ) {
            norm = (parseInt( t ) - tempMin ) / ( tempMax - tempMin );
        };
        // console.log( norm );
        bar.style.height = tempToBarHeight( norm ) + 'px';
        bar.style.transitionDelay = `${n * 0.06}s`;
        n+=1;
    });

};

function updateTenDay( data ) {

    const tenDayUL = document.getElementById( 'ten-day' );
    tenDayUL.textContent = '';
    displayDay = 0;

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

        if( day < 1 ){ date_data.day_of = 'Today'; };
        let HTML = pageBuilder.getHTML_TenDayButton( day, date_data );
        if( day < 1 ){ HTML.querySelector( 'button' ).classList.add( 'selected' ); };

        tenDayUL.appendChild( HTML );
        HTML.querySelector( 'button' ).addEventListener( 'click', changeDisplay );
    };

    // interactionTenDay = new Interactions( tenDayUL );
};

setup();