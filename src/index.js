import './assets/style.css';
import { Grabber, Parser } from './assets/modules/DATAmanager';
import { PageBuilder, PageModifier } from './assets/modules/HTMLbuilder';
import { Interactions } from './assets/modules/ACTIONmanager';
import { AutoComplete } from './assets/modules/Autocomplete';



const grabber = new Grabber( false )
const parser = new Parser();
const pageModifier = new PageModifier();
const pageBuilder = new PageBuilder();
const interactionChart = new Interactions();
const interactionTenDay = new Interactions();
const autoComplete = new AutoComplete();

const chartHeight = 60;
const barshift = 60;
let displayDay = 0;

// SETUP
async function setup() {

    interactionChart.watch( pageModifier.HOURLYCHART )
    interactionTenDay.watch( pageModifier.TENDAY )
    autoComplete.watch( pageModifier.SEARCH );
    
    // CLEAR PAGE!
    blurWholePage();

    console.log( `requesting data` );
    // POPULATE WITH DEFAULT SEARCH
    const data = await grabber.getData( 'new york city' );
    loadPage( data );
    
    const inpt = document.querySelector('input.search');
    inpt.addEventListener('focus', searchFocus );
};

// DRAW THE PAGE 
function loadPage( data ) {

    // RESET HORIZONTAL TRANSLATE
    interactionTenDay.reset( pageModifier.TENDAY );
    interactionChart.reset( pageModifier.HOURLYCHART );

    updatePageInfo( data );
    updateSummary( data, 0 );
    updateHourlyChart( data, 0 );
    updateTenDay( data );
};

// HELPER FUNCTION TO GET SCALED BAR HEIGHT
function tempToBarHeight( t ) { return barshift + ( t * chartHeight ); };

// ZERO'S OUT THE HEIGHT OF THE BARS
// AND ADDS A DELAY FOR CSS TRANSITION
function colapseBars(){
    const chartUl = pageModifier.HOURLYCHART;
    let n = 0;
    Array.from( chartUl.children ).forEach( li => {
        const bar = li.querySelector( 'div.bar-fill' );
        bar.style.height = '0px';
        bar.style.transitionDelay = `${n * 0.02}s`;
        n += 1;
    });
};

// TRIGGERS WHEN SEARCH BOX IS IN FOCUS
function searchFocus( e ) {
    pageModifier.clearError();
    blurWholePage();
    colapseBars();
    // const form = pageModifier.FORM;
    e.currentTarget.addEventListener( 'blur', searchBlur );
};

// // TRIGGERS WHEN SUBMIT
// async function onSubmit( e ) {
//     console.log('submitting!')
//     // document.getElementById('theForm').submit();
//     const search = e.currentTarget.value;
//     console.log( `searching!!: : : ${ search }` );
//     const data = await grabber.getData( search );
//     if ( data ) {
//         loadPage( data );
//         unblurWholePage();
//     };
//     return false;
// };

// TRIGGERS WHEN DONE SEARCHING
async function searchBlur( e ) {
    console.log( 'blur' )

    const search = e.currentTarget.value;
    console.log( `searching!!: : : ${ search }` );
    const data = await grabber.getData( search );
    if ( data ) {
        loadPage( data );
        unblurWholePage();
    };
};

// BLURS ONLY THE TOP HALF
// USED WHEN SELECTING FROM 10-DAY
function blurChart() {
    pageModifier.unblur( pageModifier.GRADIENT );
    pageModifier.blur( pageModifier.CURRENTCONDITIONS );
    pageModifier.blur( pageModifier.FORECASTHOURLY );
};

// UNBLURS TOP HALF
function unblurChart() {
    pageModifier.blur( pageModifier.GRADIENT );
    pageModifier.unblur( pageModifier.CURRENTCONDITIONS );
    pageModifier.unblur( pageModifier.FORECASTHOURLY );
};

// BLURS THE WHOLE PAGE
// USED WHEN LOADING NEW DATA
function blurWholePage() {
    pageModifier.unblur( pageModifier.GRADIENT );
    pageModifier.blur( pageModifier.CURRENTCONDITIONS );
    pageModifier.blur( pageModifier.FORECASTHOURLY );
    pageModifier.blur( pageModifier.FORECASTTENDAY );
}

// UNBLURS THE WHOLE PAGE
function unblurWholePage() {
    pageModifier.blur( pageModifier.GRADIENT );
    pageModifier.unblur( pageModifier.CURRENTCONDITIONS );
    pageModifier.unblur( pageModifier.FORECASTHOURLY );
    pageModifier.unblur( pageModifier.FORECASTTENDAY );
}

// WRITES THE CITY INFORMATION
function updatePageInfo( data ) {
    pageModifier.write( pageModifier.CITY, parser.getCity( data ) );
    unblurWholePage();
};

// WRITES THE DAY SUMMARY
function updateSummary( data, day ){
    let JSON = day < 1 ? parser.getCurrent( data ) : parser.getDay( data, day );
    pageModifier.write( pageModifier.CONDITIONS, parser.getConditions( JSON ) );
    pageModifier.write( pageModifier.TEMP, parser.getTemp( JSON ) );
    pageModifier.write( pageModifier.FEELSLIKE, parser.getFeelsLike( JSON ) );
    pageModifier.write( pageModifier.PRECIP, parser.getPrecip( JSON ) );
    pageModifier.write( pageModifier.UVINDEX, parser.getUVIndex( JSON ) );
};

// TRIGGERS WHEN 10-DAY BUTTON IS CLICKED
// IT CONTROLS THE TRANSITION, AND LOADS
// THE DATA INTO THE SUMMARY AND CHART
async function changeDisplay( e ) {

    let li = e.currentTarget.closest( 'li' );
    let id = li.id.split("-")[ 1 ];

    if ( id != displayDay ) {
        // transition();
        pageBuilder.removeButtonSelect( displayDay );
        pageBuilder.addButtonSelect( id );
        
        console.log( `switching to ${ id }, current page ${ displayDay }`);
        displayDay = id;
        
        colapseBars();
        blurChart();

        // ADD A SLIGHT DELAY:
        await new Promise( ( resolve, reject ) => setTimeout( resolve, 800 ) );

        updateSummary( grabber.fetchedData, id );
        updateHourlyChart( grabber.fetchedData, id );
        unblurChart();
    };
};

// DRAWS THE CHART
async function updateHourlyChart( data, day ) {

    // IF THE DAY IS '0' THE STARTING HOUR WILL BE THE CURRENT
    // HOUR AND ONLY REMAINING HOURS WILL BE DRAWN
    // ALL OTHER DAYS WILL START AT '0'
    // 
    // THERE IS PROBABLY AN EDGE CASE WHEN CHECKING THE WEATHER
    // AT 23:45 WILL ROUND UP AND MOD BACK TO 0, SHOWING THE
    // ENTIRE DAY INSTEAD OF THE LAST HOUR
    let hour = day < 1 ? parser.getCurrent_Hour( data ): 0 ;

    let dayJSON = parser.getDay( data, day );
    let hrJSON;
    let hr_data = {};

    const chartUl = pageModifier.HOURLYCHART;
    interactionChart.reset( chartUl );

    chartUl.textContent = '';

    let tempMax = -100;
    let tempMin = 100;

    // FOR EACH HOUR REMAINING IN THE DAY, DRAW THE HTML
    for ( let bar = 0; bar + hour < 24; bar ++ ) {
        hr_data.hr = bar + hour;
        hrJSON = parser.getHour( dayJSON, hr_data.hr );
        hr_data.temp = parser.getTemp( hrJSON );
        hr_data.uvindex = parser.getUVIndex( hrJSON );
        hr_data.icon = parser.getIcon( hrJSON );
        hr_data.precip = parser.getPrecip( hrJSON );
        hr_data.hr = ( bar < 1 && day < 1 ) ? 'NOW' : `${ hr_data.hr}:00`;

        let HTML = pageBuilder.getHTML_Bar( `bar`, hr_data );
        chartUl.appendChild( HTML );
        tempMax = Math.max( hr_data.temp, tempMax );
        tempMin = Math.min( hr_data.temp, tempMin );
    };

    // ADD DELAY BEFORE CHART DRAW
    await new Promise( ( resolve, reject ) => setTimeout( resolve, 800 ) );

    // ADD ANIMATION: Modify the CSS HEIGHT BASED ON THE TEMP VALUE
    // IF THE HEIGHT IS CHANGED WHEN DRAWING THE HTML,
    // THE CSS TRANSITION DOESN'T TRIGGER, SO NO ANIMATION
    let n = 0; 
    Array.from( chartUl.children ).forEach( li => {
        const t = li.querySelector( 'p.temp' ).textContent;
        const bar = li.querySelector( 'div.bar-fill' );
        let norm = 0.5;
        if ( tempMax - tempMin > 1 ) {
            norm = (parseInt( t ) - tempMin ) / ( tempMax - tempMin );
        };
        bar.style.height = tempToBarHeight( norm ) + 'px';
        bar.style.transitionDelay = `${n * 0.06}s`;
        n+=1;
    });

};

// DRAWS THE 10-DAY BUTTONS
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
        HTML.querySelector( 'button' ).addEventListener( 'touchend', changeDisplay );
    };
};

setup();