    /**
     * An object is used to create a --- customChart ---.
     * 
     * @typedef {Object} customChart
     * @name customChart
     */

    /**
    * Create a chart from ChartJS library 
    *
    *
    * @param {Object} definition - The definition of a chart. This parameter must be an object.
    *
    * @example
    * const chart = new customChart({
    *   canvas: 'container',
    *   type: 'line',
    *   labels: [0, 1, 2],
    *   label: 'Hello it's ChartJS!,
    *   data: [10, 20, 15]
    * });
    *
    * @constructor customChart
    * @name customChart
    * @property {String} canvas - The id of the target canvas
    * @property {String} type - Type of chart
    * @property {Array} labels - Labels to render
    * @property {String} label - Chart title
    * @property {Array} data - Data to render the chart
    *
    */
    
   define('customChart', () => {
    class customChart {
        constructor(definition) {
            this._chart = null;
            this._canvas = definition.canvas;
            this._type = definition.type;
            this._labels = definition.labels;
            this._label = definition.label;
            this._data = definition.data;
            this._backgroundColor = definition.backgroundColor;
            this._borderColor = definition.borderColor;
            this._borderWidth = definition.borderWidth || 1;
            this._pointRadius = definition.pointRadius || 2;

            this._startup();
        }

        _startup() {
            this._chart = new Chart(document.querySelector(`#${this._canvas}`).getContext('2d'), { 
            type: this._type,
            data: { 
                labels: this._labels,
                datasets: [{  
                    label: this._label, 
                    backgroundColor: this._backgroundColor,
                    borderColor: this._borderColor,
                    borderWidth: this._borderWidth,
                    pointRadius: this._pointRadius,
                    fill: false,
                    data: this._data
                }] 
            }, 
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 8
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: 10
                        }
                    }]
                }
            }
           });
        }

        update(newData) {
            this._chart.data.labels = newData.labels;
            this._chart.data.datasets[0].data = newData.data;
            this._chart.update();
        }
    }

    return customChart;
});