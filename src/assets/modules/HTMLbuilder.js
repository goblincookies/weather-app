import f_uvBadge from '../images/badge.svg';
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

        const mainLi = this.createElement( 'li', 'flex-v' );
        const topDiv = this.createElement( 'div', 'marg-top-sm flex-v' );
        const hrP = this.createElement( 'p', 'p4 light' );
        const barBackDiv = this.createElement( 'div', 'bar-frame' );
        const barFillDiv = this.createElement( 'div', 'bar-fill' );
        const tempP = this.createElement( 'p', 'p4 bold temp' );

        const uvDiv = this.createElement( 'div', 'box-hold wide flex-center relative' );
        const uvImg = this.createElement( 'img', 'wide icon-sm', f_uvBadge );
        const uvP = this.createElement( 'p', 'cent' );

        const iconDiv = this.createElement( 'div' , 'box-hold icon flex-center' );
        console.log( `looking for icon: ${ hr_data.icon }` );
        const iconImg = this.createElement( 'img', 'icon-sm', this.ICONS_ALL[ hr_data.icon ] );

        const rainDiv = this.createElement( 'div', 'rain' );
        const rainP = this.createElement( 'p', 'p4' );

        mainLi.id = `bar-${ n }`;
        hrP.textContent = hr_data.hr;
        tempP.textContent = hr_data.temp;
        uvP.textContent = hr_data.uvindex;
        rainP.textContent = hr_data.precip;

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




    get GRADIENT() { return document.querySelector( 'div.gradient' ); }

    get CURRENTCONDITIONS() { return document.getElementById( this.ID_CURRENTCONDITIONS ); }
    get FORECASTHOURLY() { return document.getElementById( this.ID_FORECASTHOURLY ); }

    get CITY() { return document.getElementById( this.ID_CITY ); }
    get CONDITIONS() { return document.getElementById( this.ID_CONDITIONS ); }
    get TEMP() { return document.getElementById( this.ID_TEMP ); }
    get FEELSLIKE() { return document.getElementById( this.ID_FEELSLIKE ); }
    get PRECIP() { return document.getElementById( this.ID_PRECIP ); }
    get UVINDEX() { return document.getElementById( this.ID_UVINDEX ); }
    // get TEMP() { return document.getElementById( this.ID_TEMP ); }

    write( HTML, data ) { HTML.textContent = data; };
    unblur( HTML ) { HTML.classList.add( 'reveal' ); };
    blur( HTML ) { HTML.classList.remove( 'reveal' ); };

}


export { PageBuilder, PageModifier };