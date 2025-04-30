class Interactions {

    draggingItem = null;
    boundingBox = null;
    pointerStartX;
    offsetX = 0;

    constructor( HTML ) {
        HTML.addEventListener( 'mousedown', this.dragStart );
        HTML.addEventListener( 'touchstart', this.dragStart );

        document.addEventListener( 'mouseup', this.dragEnd );
        document.addEventListener('touchend', this.dragEnd);
    };

    dragStart = ( e ) => {
        console.log( 'drag start');

        if ( e.currentTarget.classList.contains( 'pan') ) {
            this.draggingItem = e.currentTarget;
            this.boundingBox = e.currentTarget.closest( '.bounding-box' );

            this.pointerStartX = e.clientX || e.touches[0].clientX;
        };

        document.addEventListener( 'mousemove', this.drag );
        document.addEventListener( 'touchmove', this.drag, {passive: false});
        // document.addEventListener("mouseup", dragEnd );
        // document.addEventListener("touchend", dragEnd);
        document.addEventListener( 'mouseleave', this.dragEnd );

        console.log( 'finished drag start setup' );
    };

    drag = ( e ) => {
        console.log( 'dragging' );
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
            // MOVE IT!
            // console.log( 'dragging' );
            const clientX = e.clientX || e.touches[0].clientX;
            const pointerOffsetX = clientX - this.pointerStartX;
            this.draggingItem.style.transform = `translateX( ${ pointerOffsetX }px)`;
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
    };
}

export { Interactions };