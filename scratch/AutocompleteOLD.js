import { PageBuilder } from "../src/assets/modules/HTMLbuilder";

class AutoComplete {

    HTMLinput;
    currentFocus = -1
    datalist;
    pageBuilder = new PageBuilder();
    keyboardEntry = false;

    constructor() {

    };

    watch( HTML ) {
        this.HTMLinput = HTML;
        let name = HTML.name;
        this.datalist = document.getElementById( name );

        HTML.addEventListener( 'focus', this.onFocus );
        HTML.addEventListener( 'blur', this.onBlur );

        HTML.addEventListener( 'input', this.onInput );
        HTML.addEventListener( 'keydown', this.onKeyDown );

        Array.from( this.datalist.options ).forEach( option => {
            // ONCLICK FIRES AFTER BLUR
            // MOUSEDOWN GUARENTEES YOU GET INPUT
            option.addEventListener( 'mousedown', this.onClick ); //click fires 
        });
    };

    onFocus = ( ) => {
        console.log( 'auto complete focus' );   
        console.log( this.datalist );
        this.HTMLinput.value = '';
        this.datalist.style.display = 'block';
        Array.from( this.datalist.options ).forEach( option => {
            option.style.display = 'block';
        });
    };
    
    onBlur = ( ) => {
        console.log( 'blurred' );
        // console.log( e.currentTarget );
        this.datalist.style.display = "none";
    };

    onClick = ( e ) => {
        console.log( 'clicky' );
        console.log( e.currentTarget );
        this.HTMLinput.value = e.currentTarget.value;
        this.datalist.style.display = "none";
        if ( this.keyboardEntry ){
            this.keyboardEntry = false;

        };
        // this.datalist.style.display = "none";
    };

    onInput = ( ) => {
        this.currentFocus = -1;
        const text = input.value.toUpperCase();

        Array.from( this.datalist.options ).forEach( option => {

            if ( option.value.toUpperCase().indexOf( text ) > -1 ) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            };

        });
    };

    onKeyDown = ( e ) => {
        
        // if ( e.keyCode == 40 ) {
        if ( e.key == 'ArrowDown' ) {
            this.currentFocus++;
            this.addActive( this.datalist.options );
        };

        if ( e.key == 'ArrowUp' ) {
            this.currentFocus--;
            this.addActive( this.datalist.options );
        };

        if ( e.key == 'Enter' ) {
            e.preventDefault();

            this.keyboardEntry = true;

            if ( this.currentFocus > -1 ) {
                const activeOption = this.datalist.options[ this.currentFocus ];
                
                // SIMULATE CLICK
                if ( activeOption && activeOption.style.display == 'block' ) {
                    console.log( 'clicking' );
                    activeOption.dispatchEvent( new Event( 'mousedown' ) );
                    // this.HTMLinput.dispatchEvent( new Event( 'mousedown' ) );

                };
            };
        };
    };

    addActive( x ) {
        if ( !x ) { return false; }

        this.removeActive( x );

        const activLength = Array.from( this.datalist.options ).filter( option => option.style.display == 'block' );
        console.log( `activeLength: ${ activLength }` );

        if ( this.currentFocus >= x.length) { this.currentFocus = 0 };
        if ( this.currentFocus < 0) { this.currentFocus = x.length - 1 };
        
        x[ this.currentFocus ].classList.add( 'active' );
    };
    
    removeActive( x ) {

        Array.from( x ).forEach( option => {
            option.classList.remove( 'active' );
        } );
    };
};

export { AutoComplete }