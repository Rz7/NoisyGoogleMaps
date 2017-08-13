class OverlayController {
    constructor(map) {
        this.map_ = map;
        this.overlays = [];
    }

    updateOverlay() {

        // Remove old tiles
        for(let i in this.overlays)
            this.overlays[i].setMap(null);
        this.overlays = [];

        // Get new tiles
        let boundingBoxes = this.getTiles(this.map_);

        // Create overlays
        for(let i in boundingBoxes)
        {
            let overlay = new USGSOverlay(boundingBoxes[i], this.map_);
            overlay.show();

            this.overlays.push(overlay);
        }
    }

    setDensity(value = 1) {
        // Set overlays density
        for(let i in this.overlays)
            this.overlays[i].setDensity(value);
    }

    pointToTile(latLng, z) {
        // Get tile coordinates
        const MERCATOR_RANGE = 256;
        let projection = this.map_.getProjection();
        let worldCoordinate = projection.fromLatLngToPoint(latLng);
        let pixelCoordinate = new google.maps.Point(worldCoordinate.x * Math.pow(2, z), worldCoordinate.y * Math.pow(2, z));
        let tileCoordinate = new google.maps.Point(Math.floor(pixelCoordinate.x / MERCATOR_RANGE), Math.floor(pixelCoordinate.y / MERCATOR_RANGE));
        return tileCoordinate;
    };

    getTiles(map) {

        /*
        * Get all tiles
        * that are visible
        * for the user
        * */

        let bounds = map.getBounds(),
            boundingBoxes = [],
            boundsNeLatLng = bounds.getNorthEast(),
            boundsSwLatLng = bounds.getSouthWest(),
            boundsNwLatLng = new google.maps.LatLng(boundsNeLatLng.lat(), boundsSwLatLng.lng()),
            boundsSeLatLng = new google.maps.LatLng(boundsSwLatLng.lat(), boundsNeLatLng.lng()),
            zoom = map.getZoom(),
            tiles = [];

            let tileCoordinateNw = this.pointToTile(boundsNwLatLng, zoom);
            let tileCoordinateSe = this.pointToTile(boundsSeLatLng, zoom);

            let tileColumns = Math.abs(tileCoordinateSe.x - tileCoordinateNw.x) + 1;
            let tileRows = Math.abs(tileCoordinateSe.y - tileCoordinateNw.y) + 1;

            let zfactor = Math.pow(2, zoom),
                minX = tileCoordinateNw.x,
                minY = tileCoordinateNw.y;

            if(zoom === 3)
                tileColumns *= 3;

        while (tileRows--) {
            while (tileColumns--) {
                tiles.push({
                    x: minX + tileColumns,
                    y: minY
                });
            }

            minY++;
            tileColumns = Math.abs(tileCoordinateSe.x - tileCoordinateNw.x) + 1;

            if(zoom === 3)
                tileColumns *= 3;
        }

        for(let i in tiles) {
            let v = tiles[i];

            let ne = map.getProjection().fromPointToLatLng(
                new google.maps.Point(v.x * 256 / zfactor, v.y * 256 / zfactor)
            );

            let sw = map.getProjection().fromPointToLatLng(
                new google.maps.Point((1+v.x) * 256 / zfactor, (v.y + 1) * 256 / zfactor)
            );

            let bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(sw.lat(), ne.lng()),
                new google.maps.LatLng(ne.lat(), sw.lng())
            );

            boundingBoxes.push(bounds);
        }

        return boundingBoxes;
    }
}