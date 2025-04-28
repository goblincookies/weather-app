class PageBuilder {

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


    get GRADIENT() { return document.querySelector( "div.gradient" ); }

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