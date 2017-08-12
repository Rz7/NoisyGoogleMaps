class App {
    constructor() {
        this.map = null;
        this.markers  = [];

        window.noise = new Noise();
    }

    initMap() {

	    // Create a map
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 22.3964, lng: 114.1095},
            zoom: 12,
            mapTypeId: 'terrain'
        });

        // Create overlay controller
        this.overlayController = new OverlayController(this.map);

        // Load openStreetMap data
        setTimeout(function() {
            let script = document.createElement('script');
            script.src = 'https://web-maps-180d0.firebaseapp.com/js/map.js';
            document.getElementsByTagName('head')[0].appendChild(script);
        }, 0);

        // Listen to events
        this.events();
    };

    events() {
        this.map.addListener('dragend', this.updateOverlay.bind(this));
        this.map.addListener('zoom_changed', () => {
            let currentZoomLevel = this.map.getZoom();
            this.updateOverlay();
            this.updateFeatures(currentZoomLevel * 2);
        });
    }

    setMapOnSome(map, probability) {

        this.shuffle(this.markers);
        let elementsToHide = (this.markers.length / 100 * probability);

        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(elementsToHide > i ? map : null);
        }
    };

    updateOverlay() {
        if(this.overlayController) {
            this.overlayController.updateOverlay();
        }
    }

    updateOverlayDensity(maxPct) {
        this.overlayController.setDensity(maxPct);
    }

    updateFeatures(maxPct) {
        this.setMapOnSome(this.map, maxPct);
    };

    shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    };

    eqfeed(results) {
        for (let i = 0; i < results.features.length; i++) {
            let coords = results.features[i].geometry.coordinates;
            let latLng = new google.maps.LatLng(coords[1],coords[0]);

            let marker = new google.maps.Marker({
                position: latLng, map: null,
                title: results.features[i].properties.name
            });

            this.markers.push(marker);
        }

        this.setMapOnSome(this.map, this.map.getZoom() * 2);

        // Update overlay to create noise
        this.overlayController.updateOverlay();

        // Hide loader
        this.toggleLoader();
    };

    toggleLoader() {
        let currentClass = document.getElementById('loader').className;

        if(currentClass === 'loader')
            document.getElementById('loader').className = "loader loader--hide";
        else
            document.getElementById('loader').className = "loader";
    }
}
