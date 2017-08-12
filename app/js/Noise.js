class Noise {
    constructor(color = "141414FF", background = "FFFFFF00") {

        this.color = this.hexToRGBA(color);
        this.background = this.hexToRGBA(background);

        this.generatedImages = {};
    }

    getImage(density = 1) {

        if( ! this.generatedImages[density])
            this.generatedImages[density] = this.getBackground(density);

        return this.generatedImages[density];
    }

    getBackground(density = 1, sizeX = 256, sizeY = 256) {

        let canvas = document.createElement("canvas");
        canvas.width = sizeX;
        canvas.height = sizeY;

        // Get the content
        let ctx = canvas.getContext("2d");

        console.time('Time to render the noise');

        let _imageData = [];
        for(let i = 0; i < canvas.width; ++i) {
            for (let j = 0; j < canvas.height; ++j) {
                let v = this.getRandomPixel(density);

                _imageData.push(v[0]);
                _imageData.push(v[1]);
                _imageData.push(v[2]);
                _imageData.push(v[3]);
            }
        }

        console.timeEnd('Time to render the noise');

        // first, create a new ImageData to contain our pixels
        let imgData = ctx.createImageData(sizeX, sizeY);
        let data = imgData.data;

        // copy img byte-per-byte into our ImageData
        for (let i = 0, len = sizeX * sizeY * 4; i < len; i++) {
            data[i] = _imageData[i];
        }

        ctx.putImageData(imgData, 0, 0);

        return canvas.toDataURL();
    }

    random(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    getRandomPixel(density = 1, color = this.color, background = this.background) {
        if(this.random(1, 100) <= density)
            return color;
        else
            return background;
    }

    hexToRGBA(hex) {
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            parseInt(hex.slice(6, 8), 16),
        ];
    }

    getCurrentDensity() {
        return document.getElementById('range').value;
    }
}