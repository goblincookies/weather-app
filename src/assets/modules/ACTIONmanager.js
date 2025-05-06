class Interactions {
    
    draggingItem = null;
    boundingBox = null;
    pointerStartX = 0;
    pointerOffsetX = 0;
    offsetX = 0;
    maxSlide = 0;

    constructor( ) { 
        document.addEventListener( 'mouseup', this.dragEnd );
        document.addEventListener( 'touchend', this.dragEnd );
    };

    // ADD LISTENERS TO ITEM
    watch( HTML ) {
        HTML.addEventListener( 'mousedown', this.dragStart );
        HTML.addEventListener( 'touchstart', this.dragStart );
    };

    touchStart = ( e ) => {
        // console.log( 'touch' );
    }

    mouseStart = ( e ) => {

    }

    // TRIGGERS WHEN A DRAG IS DETECTED
    dragStart = ( e ) => {

        e.preventDefault();

        // MAKE SURE IT'S A VIABLE ITEM
        // THIS IS USEFUL FOR DISABLING
        // DRAGGING ON CERTAIN ITEMS
        if ( e.currentTarget.classList.contains( 'pan') ) {
            this.draggingItem = e.currentTarget;
            this.boundingBox = e.currentTarget.closest( '.bounding-box' );
            this.pointerStartX = e.clientX || e.touches[0].clientX;

            // console.log( e.clientX );

            console.log( e.clientX  || e.touches[0].clientX );

            // IF WE HAVE LOADED VALID ITEMS,
            // CALC THE MAX MOVEMENT
            // INSTEAD OF CALCULATING IT EVERY DRAG
            // THIS COULD BE MOVED TO THE CONSTRUCTOR
            // AND THEN RECALCULATED ONLY WHEN THE WINDOW IS RESIZED
            if ( this.boundingBox && this.draggingItem ) {
                const dragBox = this.draggingItem.getBoundingClientRect();
                const boundBox = this.boundingBox.getBoundingClientRect();

                this.maxSlide = boundBox.width - dragBox.width;
            };
        };

        // SET UP DOCUMENT LISTENERS REQUIRED FOR DRAGGIN
        document.addEventListener( 'mousemove', this.drag );
        document.addEventListener( 'touchmove', this.drag, {passive: false});
        document.addEventListener( 'mouseleave', this.dragEnd );
    };

    // TRIGGERS WHEN DRAGGING
    drag = ( e ) => {

        e.preventDefault();
        console.log( 'dragging!' );
        console.log( e.clientX )
        console.log( !e.touches );

        // PROTECTS AGAINST 'STICKY' DRAGS
        if ( e.buttons < 1 ) {
            this.dragEnd();
            return;
        };


        // console.log( 'still!' );
        // // IF THERE IS TOUCH && X || Y IS NULL
        // // IF THERE IS INPUT && X || Y IS NULL

        // const mouseInput = ( e.clientX || e.clientY );
        // const touchInput = ( e.touches[0].clientX || e.clientY );
        
        
        // // THIS IS NULLIFYING THE TOUCH INPUT
        // // CHECK IF OUTSIDE THE BOUNDS OF THE WINDOW
        // if ( !e.clientX || !e.clientY ) {
        //     console.log( 'outside bounds' )
        //     console.log( !e.clientX )
        //     console.log( !e.clientY )

        //     this.dragEnd();
        //     return;
        // };

        console.log( 'still!' );


        // VERIFY AN ITEM HAS BEEN FOUND
        if ( this.draggingItem && this.boundingBox ) {

            // CALC THE MOUSE MOVEMENT
            const clientX = e.clientX || e.touches[0].clientX;
            let _x = this.offsetX + clientX - this.pointerStartX;

            // CLAMP IT TO THE WINDO
            _x = Math.min( _x, 0 );
            _x = Math.max( _x, this.maxSlide );

            this.pointerOffsetX = _x;
            this.draggingItem.style.transform = `translateX( ${ _x }px)`;
        };
    };

    // TRIGGERS WHEN DRAG IS COMPLETE
    // OR A BUNCH OF WAYS
    // CLEANS UP LOADED ITEMS, AND MAKES SURE
    // EVERYTHING IS READY FOR THE NEXT DRAG
    dragEnd = () => {
        this.removeListeners();
        this.cleanup();
    };

    // REMOVES LISTENERS THAT ARE ONLY NEEDED WHILE DRAGGING
    removeListeners() {
        document.removeEventListener( 'mousemove', this.drag );
        document.removeEventListener( 'touchmove', this.drag );
        document.removeEventListener( 'mouseleave', this.dragEnd );
    };

    // GENERAL CLEANUP
    // UNLOADS ITEMS
    cleanup() {
        this.draggingItem = null;
        this.offsetX = this.pointerOffsetX;
    };

    // RESETS OFFSET AND TRANSFORM
    // USEFUL WHEN ITEMS SHOULD BE IN THEIR
    // ORIGINAL STARTING POSITION
    reset( HTML ) {
        HTML.style.transform = null;
        this.draggingItem = null;
        this.offsetX = 0;
    };
};

export { Interactions };