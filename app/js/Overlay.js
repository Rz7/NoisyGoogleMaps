class USGSOverlay extends google.maps.OverlayView {
    constructor(bounds, map) {
        super();

        this.map_ = map;
        this.bounds_ = bounds;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay
        this.setMap(map);
    }

    onAdd() {
        let div = document.createElement('div');
        div.style.border = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';
        div.style.background = "url(%s)".replace("%s", noise.getImage(noise.getCurrentDensity()));
        this.div_ = div;

        // Add the element to the "overlayImage" pane.
        let panes = this.getPanes();
        panes.overlayImage.appendChild(this.div_);
    };

    draw() {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        let overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        let sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        let ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        let div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
    };

    onRemove() {
        // if(this.div_) {
            this.div_.parentNode.removeChild(this.div_);
        // }
    };

    hide() {
        if (this.div_) {
            this.div_.style.visibility = 'hidden';
        }
    };

    show() {
        if (this.div_) {
            this.div_.style.visibility = 'visible';
        }
    };

    setDensity(value = 1) {

        if(value < 0)
            value = 0;
        else
        // Reduce density by 2
        // so there is not so much noise
            value /= 2;

        if (this.div_) {
            this.div_.style.background = "url(%s)".replace("%s", noise.getImage(noise.getCurrentDensity()));
        }
    };
}
