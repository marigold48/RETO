define('circle', () => {
    /**
     * An object is used to create a --- circle ---.
     * 
     * @typedef {Object} circle
     * @name circle
     */

    /**
    * Create a blinking Mapbox GL JS circle layer 
    *
    *
    * @param {Object} definition - The definition of a blinking circle layer. This parameter must be an object.
    *
    * @example
    * const cityCircle = new Circle({
    *   map: mapInstance,
    *   coords: [0, 0]
    * });
    *
    * @constructor circle
    * @name circle
    * @property {Map} map - The Mapbox GL JS map instance
    * @property {Array} coords - And array of lon. & lat. coordinates
    *
    */
    

    class circle {
        constructor(definition) {
          this._map = definition.map;
          this._coords = definition.coords;
          this._circleRadius = 25;

          this.addLayer();
        }

        addLayer() {
            this._map.addSource('city-circle-source', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': this._coords
                    }
                }
            });

            this._map.addLayer({
                'id': 'city-circle-layer',
                'source': 'city-circle-source',
                'type': 'circle',
                'paint': {
                    'circle-radius': this._circleRadius,
                    'circle-color': 'rgba(0,0,0,0)',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': 'rgb(0,255,255)',
                    'circle-stroke-opacity': .6
                }
            });

            const self = this;
            this._map.once('style.load', () => {
                self.animate();
            });
        }

        update(data) {
            this._map.getSource('city-circle-source').setData(data);
            this.animate();
        }

        
        animate() {
            let timer = setInterval(() => {
                this._map.setPaintProperty('city-circle-layer', 'circle-radius', this._circleRadius === 25 ? 5 : 25);
                this._circleRadius === 25 ? 
                    this._circleRadius = 5 : 
                    this._circleRadius = 25;
            }, 500);

            setTimeout(() => {
                clearInterval(timer);
            }, 6000);
        }
    }

    return circle;
});