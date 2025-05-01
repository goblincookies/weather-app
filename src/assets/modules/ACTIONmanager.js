class Interactions {

    // draggingItems = [];

    draggingItem = null;
    boundingBox = null;
    pointerStartX = 0;
    pointerOffsetX = 0;
    offsetX = 0;
    maxSlide = 0;

    // constructor( HTML ) {
    constructor( ) { //( HTML ) {
        // HTML.addEventListener( 'mousedown', this.dragStart );
        // HTML.addEventListener( 'touchstart', this.dragStart );

        document.addEventListener( 'mouseup', this.dragEnd );
        document.addEventListener('touchend', this.dragEnd);
    };

    watch( HTML ) {
        HTML.addEventListener( 'mousedown', this.dragStart );
        HTML.addEventListener( 'touchstart', this.dragStart );
        // this.draggingItems.push( HTML );
    };

    dragStart = ( e ) => {
        console.log( `drag start:`);
        // console.log( e.currentTarget );

        if ( e.currentTarget.classList.contains( 'pan') ) {
            this.draggingItem = e.currentTarget;
            this.boundingBox = e.currentTarget.closest( '.bounding-box' );
            this.pointerStartX = e.clientX || e.touches[0].clientX;

            if ( this.boundingBox && this.draggingItem ) {
                const dragBox = this.draggingItem.getBoundingClientRect();
                const boundBox = this.boundingBox.getBoundingClientRect();

                this.maxSlide = boundBox.width - dragBox.width;
                console.log( `max slide:${ this.maxSlide }` );    
            };
            
            console.log( this.draggingItem );
            console.log( this.boundingBox );


        };

        document.addEventListener( 'mousemove', this.drag );
        document.addEventListener( 'touchmove', this.drag, {passive: false});
        // document.addEventListener("mouseup", dragEnd );
        // document.addEventListener("touchend", dragEnd);
        document.addEventListener( 'mouseleave', this.dragEnd );

        console.log( 'finished drag start setup' );
    };

    drag = ( e ) => {
        // console.log( 'dragging' );

        // PROTECTS AGAINST 'STICKY' DRAGS
        if ( e.buttons < 1 ) {
            this.dragEnd();
            return;
        };

        // CHECK IF OUTSIDE THE BOUNDS OF THE WINDOW
        if ( !e.clientX || !e.clientY ) {
            this.dragEnd();
            return;
        };

        if ( this.draggingItem && this.boundingBox ) {
            console.log('moving!')
            // MOVE IT!
            // console.log( 'dragging' );
            const clientX = e.clientX || e.touches[0].clientX;
            let _x = this.offsetX + clientX - this.pointerStartX;
            console.log( `offsetX: ${this.offsetX}, clientX: ${clientX}, pointerStartX:${ this.pointerStartX}, _x ${ _x }`);
            _x = Math.min( _x, 0 );
            _x = Math.max( _x, this.maxSlide );

            // this.pointerOffsetX = Math.min( this.offsetX + clientX - this.pointerStartX, 0);
            
            this.pointerOffsetX = _x;
            // this.pointerOffsetX = this.pointerOffsetX <= 0 ? 0 : 
            this.draggingItem.style.transform = null;

            this.draggingItem.style.transform = `translateX( ${ _x }px)`;
            console.log( this.draggingItem, _x );
            // this.offsetX = pointerOffsetX;
        };
    };

    dragEnd = () => {
        console.log( 'drag end');

        this.removeListeners();
        this.cleanup();
    };

    updatePos( HTML, bounding_html, posX ) {
        // TRANSLATE X SUCH THAT 0 < X < bounding_html.width

    };

    removeListeners() {
        document.removeEventListener( 'mousemove', this.drag );
        document.removeEventListener( 'touchmove', this.drag );
        document.removeEventListener( 'mouseleave', this.dragEnd );
    };

    cleanup() {
        this.draggingItem = null;
        this.offsetX = this.pointerOffsetX;
        // this.pointerOffsetX = 0;
    };

    reset( HTML ) {
        // if ( this.draggingItem ) { this.draggingItem.style.transform = null; }
        HTML.style.transform = null;
        this.draggingItem = null;
        this.offsetX = 0;
    };
};

export { Interactions };