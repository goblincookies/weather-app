import dataLondon from "../dataLondon.json";

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
    getDay( JSON, day ) { return JSON.days[ day ] };
    getCurrent( JSON ) { return JSON.currentConditions };

    getCity( JSON ) {
        const rawAddress = JSON.resolvedAddress;
        console.log( `raw: ${ rawAddress }`)
        const addressArray = rawAddress.split(',');
        console.log( `array: ${ addressArray }`)

        const address = `${addressArray[0]}, ${addressArray[1]}`;
        return address;
    };
    currConditions( currJSON ) { return  currJSON.conditions; };
    currTemp( currJSON ) { return Math.round( currJSON.temp ); };
    currFeelsLike( currJSON ) { return Math.round( currJSON.feelslike ); };
    currPrecip( currJSON ) { return Math.round( currJSON.precipprob ) + '%'; };
    currUVIndex( currJSON ) { return Math.round( currJSON.uvindex ); };
};

export { Grabber, Parser };