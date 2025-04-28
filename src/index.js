import './assets/style.css';
import { Grabber, Parser } from './assets/modules/DATAmanager';
import { PageBuilder, PageModifier } from './assets/modules/HTMLbuilder';

console.log('hello world!');


const grabber = new Grabber( true )
const parser = new Parser();
const pageModifier = new PageModifier();


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
};

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

    pageModifier.write( pageModifier.CONDITIONS, parser.currConditions( currJSON ) );
    pageModifier.write( pageModifier.TEMP, parser.currTemp( currJSON ) );
    pageModifier.write( pageModifier.FEELSLIKE, parser.currFeelsLike( currJSON ) );
    pageModifier.write( pageModifier.PRECIP, parser.currPrecip( currJSON ) );
    pageModifier.write( pageModifier.UVINDEX, parser.currUVIndex( currJSON ) );

    unblurWholePage();
    
};


setup();