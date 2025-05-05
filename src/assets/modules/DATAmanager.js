import downloadedData from '../dataNewYork.json';
import api from '../../../../api_keys/api_key_VisCroWea.json';

class Grabber {

    useDebug = true;
    data;
    URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    SEARCH;
    KEY;
    QUERY = '?key=';

    constructor( debug ){
        this.useDebug = debug;
        this.KEY = this.QUERY + api.key;
    };


    set debug( val ) { this.useDebug = val; }


    async getData( search ) {
        console.log( `getting data for search: ${ search }` );
        console.log( `using debug: ${ this.useDebug }` );

        if ( this.useDebug ) {
            this.data = downloadedData;
            await new Promise( ( resolve, reject ) => setTimeout( resolve, 2000 ) );        
            return this.data;
        };

        console.log( search );
        search = search.replace(/\s/g, '' );
        console.log( search );

        this.SEARCH = this.URL + search + this.KEY;
        console.log( this.SEARCH );

        // if ( !search ) { return; }

        const response = await fetch( this.SEARCH, { mode: 'cors' } );
        const searchData = await response.json();
        this.data = searchData;
        console.log( `reponse for search: ${ search }`);
        console.log( searchData );
        return this.data;
    };

    get fetchedData() { return this.data };

};

class Parser {

    DAY_OF_THE_WEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    mod( n, m) { return ((n % m) + m) % m; };

    getDay( JSON, day ) { return JSON.days[ day ] };
    getHour( JSON, hr ) { return JSON.hours[ hr ] };
    getDate( JSON ) {
        const cc = JSON.datetime;
        const time = cc.split( '-' ); 
        return `${ time[1] }/${ time[2] }`;
    };
    getDayOf( JSON ) {
        const cc = JSON.datetime;
        const date = new Date( cc );
        return this.DAY_OF_THE_WEEK[ date.getDay() ];
    };
    
    getCurrent( JSON ) { return JSON.currentConditions };
    getCurrent_Hour( JSON ) {
        const cc = JSON.currentConditions;
        const time = cc.datetime.split( ':' ); 
        let hr = parseInt( time[ 0 ] );
        hr = parseInt( time[ 1 ] ) > 30 ? this.mod( hr + 1, 24 ) : hr;
        return hr;
    };

    getCity( JSON ) {
        const rawAddress = JSON.resolvedAddress;
        console.log( `raw: ${ rawAddress }`)
        const addressArray = rawAddress.split(',');
        console.log( `array: ${ addressArray }`)

        const address = `${addressArray[0]}, ${addressArray[1]}`;
        return address;
    };
    getConditions( JSON ) { return  JSON.conditions; };
    getTemp( JSON ) { return Math.round( JSON.temp ); };
    getTempHigh( JSON ) { return Math.round( JSON.tempmax ); };
    getLow( JSON ) { return Math.round( JSON.tempmin ); };

    getFeelsLike( JSON ) { return Math.round( JSON.feelslike ); };
    getPrecip( JSON ) { return Math.round( JSON.precipprob ) + '%'; };
    getUVIndex( JSON ) { return Math.round( JSON.uvindex ); };
    getIcon( JSON ) { return JSON.icon; };

    // getHour( JSON ) { return JSON.split(':')[0] };
};

export { Grabber, Parser };