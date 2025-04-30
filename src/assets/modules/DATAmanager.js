import dataLondon from '../dataLondon.json';

class Grabber {

    useDebug = true;

    constructor( debug ){
        this.useDebug = debug;
    };


    set debug( val ) { this.useDebug = val; }


    async getData( ) {
        console.log( `getting data` );
        // let data = {};

        let data = dataLondon;
        await new Promise( ( resolve, reject ) => setTimeout( resolve, 2000 ) );        
        console.log( 'debug time!' );
        
        return data;
    };

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
    // getDays( JSON ) { return JSON.days[ day ] };
    getCurrent( JSON ) { return JSON.currentConditions };
    getCurrent_Hour( JSON ) {
        const cc = JSON.currentConditions;
        const time = cc.datetime.split( ':' ); 
        let hr = parseInt( time[ 0 ] );
        hr = parseInt( time[ 1 ] ) > 30 ? this.mod( hr + 1, 24 ) : hr;
        return hr;
    };
    
    // IT SHOULD BE 0 (AKA TODAY) UNLESS WE'RE SAMPLING AT 23:31:00
    // WHICH WILL ROUND UP THE HOUR TO 00:00:00
    // AND THE DAY SHOULD INCREASE
    getCurrent_Day( JSON ) {
        const cc = JSON.currentConditions;
        const time = cc.datetime.split( ':' ); 
        let min = parseInt( time[ 1 ] );
        let day = min > 30 ? 1 : 0;
        return day;
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