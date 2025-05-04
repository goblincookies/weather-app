import f_uvBadge from '../images/badge-fill.svg';
import f_clearDay from '../images/clear-day.svg';
import f_clearNight from '../images/clear-night.svg';
import f_cloudy from '../images/cloudy.svg';
import f_fog from '../images/fog.svg';
import f_hail from '../images/hail.svg';
import f_partlyCloudyDay from '../images/partly-cloudy-day.svg';
import f_partlyCloudyNight from '../images/partly-cloudy-night.svg';
import f_rainSnowShowersDay from '../images/rain-snow-showers-day.svg';
import f_rainSnowShowersNight from '../images/rain-snow-showers-night.svg';
import f_rainSnow from '../images/rain-snow.svg';
import f_rain from '../images/rain.svg';
import f_showersDay from '../images/showers-day.svg';
import f_showersNight from '../images/showers-night.svg';
import f_sleet from '../images/sleet.svg';
import f_snowShowersDay from '../images/snow-showers-day.svg';
import f_snowShowersNight from '../images/snow-showers-night.svg';
import f_snow from '../images/snow.svg';
import f_star from '../images/star.svg';
import f_sunny from '../images/sunny.svg';
import f_thunderRain from '../images/thunder-rain.svg';
import f_thunderShowersDay from '../images/thunder-showers-day.svg';
import f_thunderShowersNight from '../images/thunder-showers-night.svg';
import f_thunder from '../images/thunder.svg';
import f_wind from '../images/wind.svg';

class PageBuilder {

    ICONS_ALL = {
        'clear-day':f_clearDay, 'clear-night':f_clearNight,
        'cloudy':f_cloudy, 'fog':f_fog, 'hail':f_hail,
        'partly-cloudy-day':f_partlyCloudyDay,
        'partly-cloudy-night':f_partlyCloudyNight,
        'rain-Snow-showers-day':f_rainSnowShowersDay,
        'rain-snow-showers-night':f_rainSnowShowersNight,
        'rain-snow':f_rainSnow, 'rain':f_rain,
        'showers-day':f_showersDay, 'showers-night':f_showersNight,
        'sleet':f_sleet, 'snow-showers-day':f_snowShowersDay,
        'snow-showers-night':f_snowShowersNight, 'snow':f_snow,
        'star':f_star, 'sunny':f_sunny, 'thunder-rain':f_thunderRain,
        'thunder-showers-day':f_thunderShowersDay,
        'thunder-showers-night':f_thunderShowersNight,
        'thunder':f_thunder, 'wind':f_wind
    };

    UV_SCALE = [2,5,7,10];

    // HELPER FUNCTION
    createElement ( type, classes, src) {
        let element = document.createElement( type );
        for(const el of classes.split(' ')) {
            if (el == ' ' | el == '' ) { break; }
            element.classList.add( el);
        };
        if (src) { element.src = src; }
        return element;
    };

    getCSS_Filter( num ) {
        num = Math.max( num, 0 );

        let i = 0;
        this.UV_SCALE.forEach( rating => {
            if( num <= rating ) { return 'uv'+ i; }
            i += 1;
        });

        return 'uv'+ i;
    };

    removeButtonSelect( id ) {
        const HTML = document.getElementById( `day-${ id }`);
        HTML.querySelector( 'button' ).classList.remove( 'selected' );
    };

    addButtonSelect( id ) {
        const HTML = document.getElementById( `day-${ id }`);
        HTML.querySelector( 'button' ).classList.add( 'selected' );
    };

    getHTML_Item( bold, text ) {
        const mainDiv = this.createElement( 'div', 'item' );
        const mainInput = this.createElement( 'input', '' );
        if( bold.length > 0 ) {
            const textStrong = this.createElement( 'strong', '' );
            textStrong.textContent = bold;
            mainDiv.appendChild( textStrong );
        }
        mainDiv.innerHTML += text;
        mainInput.type = 'hidden';
        mainInput.value = bold + text;

        mainDiv.appendChild( mainInput );

        // b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        return mainDiv;
    };

    // getHTML_Option( text ){
    //     // <option value="London">London</option>
    //     const mainOption = this.createElement( 'option', '' );
    //     mainOption.textContent = text;
    //     mainOption.value = text;
    //     return mainOption;
    // };

    getHTML_TenDayButton( day, date_data ) {
        // <li class="">
        //     <button class="pill flex-v gap-sm selected">
        //         <div class="flex-v">
        //             <p class="p2 bold">186</p>
        //             <p class="p2">67</p>
        //         </div>
                
        //         <div class=" wide flex-center relative">
        //             <img class=" icon-md" src="./assets/images/badge.svg" alt="">
        //             <p class="cent">14</p>
        //         </div>

                
        //         <div class=" wide">
        //             <img class="icon-lg" src="./assets/images/sunny.svg" alt="">
        //         </div>
        //         <div class="percip">
        //             <p>75%</p>
        //         </div>
        //         <div class="date">
        //             <p class="bold">Today</p>
        //             <p>4/24</p>
        //         </div>

        //     </button>
        // </li>

        const mainLi = this.createElement( 'li', 'non');
        const mainButton = this.createElement( 'button', 'pill flex-v gap-sm ten-width');
        const hiLoDiv = this.createElement( 'div', 'flex-v' );
        const hiP = this.createElement( 'p', 'p2 bold' );
        const loP = this.createElement( 'p', 'p2' );
        const uvDiv = this.createElement( 'div', 'wide flex-center relative' );
        const uvImg = this.createElement( 'img', 'icon-md non', f_uvBadge );
        const uvP = this.createElement( 'p', 'cent' );
        const iconDiv = this.createElement( 'div', 'wide' );
        const iconImg = this.createElement( 'img', 'icon-lg non', this.ICONS_ALL[ date_data.icon ] );
        const rainDiv = this.createElement( 'div', 'precip' );
        const rainP = this.createElement( 'p', '' );
        const dateDiv = this.createElement( 'div', 'date' );
        const dayOfP = this.createElement( 'p', 'bold' );
        const dateP = this.createElement( 'p', '' );

        mainLi.id = `day-${ day }`;

        hiP.textContent = date_data.temp_high;
        loP.textContent = date_data.temp_low;
        
        rainP.textContent = date_data.precip;
        dayOfP.textContent = date_data.day_of;
        dateP.textContent = date_data.date;


        if ( date_data.uvindex > 0 ) {
            uvP.textContent = date_data.uvindex;
            uvImg.classList.add( this.getCSS_Filter( date_data.uvindex ) );
        } else {
            uvImg.classList.add( 'hide' );
        }


        hiLoDiv.appendChild( hiP );
        hiLoDiv.appendChild( loP );
        
        uvDiv.appendChild( uvImg );
        uvDiv.appendChild( uvP );

        iconDiv.appendChild( iconImg );

        rainDiv.appendChild( rainP );

        dateDiv.appendChild( dayOfP );
        dateDiv.appendChild( dateP );

        mainButton.appendChild( hiLoDiv );
        mainButton.appendChild( uvDiv );
        mainButton.appendChild( iconDiv );
        mainButton.appendChild( rainDiv );
        mainButton.appendChild( dateDiv );

        mainLi.appendChild( mainButton );

        return( mainLi );
    };

    getHTML_Bar( n, hr_data ) {
        // <li class=" flex-v" id="bar-0">
        //     <div class="marg-top-sm flex-v">
        //         <p class="p4 light">NOW </p>
        //         <div class="bar-frame">
        //             <div class="bar-fill"></div>
        //         </div>
        //         <p class="p3 bold" id="hour-temp-0">XX</p>
        //     </div>
        //     <div class="box-hold wide flex-center relative">
        //         <img class="wide icon-sm" src="./assets/images/badge.svg" alt="">
        //         <p class="cent" id="hour-uv-0">XX</p>
        //     </div>
        //     <div class="icon flex-center">
        //         <img class="icon-sm" id="hour-icon-0" src="./assets/images/sunny.svg" alt="">
        //     </div>
        //     <div class="rain">
        //         <p class="p4" id="hour-rain-0">XX</p>
        //     </div>
        // </li>

        const mainLi = this.createElement( 'li', 'flex-v non' );
        const topDiv = this.createElement( 'div', 'marg-top-sm flex-v' );
        const hrP = this.createElement( 'p', 'p4 light' );
        const barBackDiv = this.createElement( 'div', 'bar-frame' );
        const barFillDiv = this.createElement( 'div', 'bar-fill' );
        const tempP = this.createElement( 'p', 'p4 bold temp' );

        const uvDiv = this.createElement( 'div', 'box-hold wide flex-center relative' );
        const uvImg = this.createElement( 'img', 'wide icon-sm non', f_uvBadge );
        const uvP = this.createElement( 'p', 'cent' );

        const iconDiv = this.createElement( 'div' , 'box-hold icon flex-center' );
        console.log( `looking for icon: ${ hr_data.icon }` );
        const iconImg = this.createElement( 'img', 'icon-sm non', this.ICONS_ALL[ hr_data.icon ] );

        const rainDiv = this.createElement( 'div', 'rain box-hold' );
        const rainP = this.createElement( 'p', 'p4' );

        mainLi.id = `bar-${ n }`;
        hrP.textContent = hr_data.hr;
        tempP.textContent = hr_data.temp;
        
        
        if ( hr_data.uvindex > 0 ) {
            uvP.textContent = hr_data.uvindex;
            uvImg.classList.add( this.getCSS_Filter( hr_data.uvindex ) );
        } else {
            uvImg.classList.add( 'hide' );
        }


        let precip = hr_data.precip.split( '%' )[ 0 ];
        precip = parseInt( precip );
        if ( precip > 0 ) { rainP.textContent = hr_data.precip; }

        // barFillDiv.style.height = hr_data.height + 'px';

        barBackDiv.appendChild( barFillDiv );
        topDiv.appendChild( hrP );
        topDiv.appendChild( barBackDiv );
        topDiv.appendChild( tempP );

        uvDiv.appendChild( uvImg );
        uvDiv.appendChild( uvP );

        iconDiv.appendChild( iconImg );

        rainDiv.appendChild( rainP );

        mainLi.appendChild( topDiv );
        mainLi.appendChild( uvDiv );
        mainLi.appendChild( iconDiv );
        mainLi.appendChild( rainDiv );

        return mainLi;
    };

};

class PageModifier {
    ID_CITY = 'city';
    ID_CONDITIONS = 'conditions';
    ID_TEMP = 'temp';
    ID_FEELSLIKE = 'feels-like';
    ID_PRECIP = 'precip';
    ID_UVINDEX = 'uvindex';
    ID_CURRENTCONDITIONS = 'current-conditions';
    ID_FORECASTHOURLY = 'forecast-hourly';
    ID_FORECASTTENDAY = 'forecast-ten-day';

    ID_HOURLYCHART = 'hourly-chart';
    ID_TENDAY = 'ten-day';
    ID_GRADIENT = 'div.gradient';
    ID_SEARCH = 'input.search';

    // get GRADIENT() { return document.querySelector( this.ID_GRADIENT ); }
    get GRADIENT() { return this.getHTML_QS( this.ID_GRADIENT ); }
    get SEARCH() { return this.getHTML_QS( this.ID_SEARCH ); }

    get CURRENTCONDITIONS() { return document.getElementById( this.ID_CURRENTCONDITIONS ); }
    get FORECASTHOURLY() { return document.getElementById( this.ID_FORECASTHOURLY ); }
    get FORECASTTENDAY() { return document.getElementById( this.ID_FORECASTTENDAY ); }

    get CITY() { return document.getElementById( this.ID_CITY ); }
    get CONDITIONS() { return document.getElementById( this.ID_CONDITIONS ); }
    get TEMP() { return document.getElementById( this.ID_TEMP ); }
    get FEELSLIKE() { return document.getElementById( this.ID_FEELSLIKE ); }
    get PRECIP() { return document.getElementById( this.ID_PRECIP ); }
    get UVINDEX() { return document.getElementById( this.ID_UVINDEX ); }
    get HOURLYCHART() { return document.getElementById( this.ID_HOURLYCHART ); }
    get TENDAY() { return document.getElementById( this.ID_TENDAY ); }

    // get TEMP() { return document.getElementById( this.ID_TEMP ); }

    write( HTML, data ) { HTML.textContent = data; };
    unblur( HTML ) { HTML.classList.add( 'reveal' ); };
    blur( HTML ) { HTML.classList.remove( 'reveal' ); };

    getID( id ) { return document.getElementById( id ); }
    getHTML_QS( s ) { return document.querySelector( s ); }
    // clearTransform( HTML ) { HTML.style.transform = null; };

}


export { PageBuilder, PageModifier };