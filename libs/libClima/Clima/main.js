define(require => {
    const mapboxgl = require('lib/mapbox-gl');
    const Chart = require('chart.min');
    const customChart = require('customChart');
    const Circle = require('circle');
    const getWeatherData = require('./fetchData');
    const config = require('./config');
    const utils = require('./utils');
    
    mapboxgl.accessToken = config.mapbox_token;

    const map = new mapboxgl.Map({
        container: 'map',
        style: config.basemap,
        center: config.center,
        zoom: config.zoom
    });

    config.mapInstance = map;

    const temperatureChart = new customChart({
        canvas: 'temperature-container',
        type: 'line',
        labels: [0, 1, 2],
        label: 'Temperature',
        data: [10, 20, 15],
        backgroundColor: 'rgb(51, 102, 153)',
        borderColor: 'rgb(51, 102, 153)'
    });

    config.temperatureChart = temperatureChart;

    const humidityChart = new customChart({
        canvas: 'humidity-container',
        type: 'line',
        labels: [0, 1, 2],
        label: 'Humidity',
        data: [10, 20, 15],
        backgroundColor: 'rgb(51, 102, 153)',
        borderColor: 'rgb(51, 102, 153)'
    });

    config.humidityChart = humidityChart;

    const pressureChart = new customChart({
        canvas: 'pressure-container',
        type: 'line',
        labels: [0, 1, 2],
        label: 'Pressure',
        data: [10, 20, 15],
        backgroundColor: 'rgb(51, 102, 153)',
        borderColor: 'rgb(51, 102, 153)'
    });

    config.pressureChart = pressureChart;

    map.on('load', () => {
        const cityCircle = new Circle({
            map: map,
            coords: config.center
        });

        config.cityCircle = cityCircle;

         getWeatherData('weather', config.initialCity);
         getWeatherData('forecast', config.initialCity);
    })
    
    document.querySelector('#goToNode').addEventListener('click', () => {
        getWeatherData('weather', utils.getTargetCity());
        getWeatherData('forecast', utils.getTargetCity());
    });

    document.querySelector('#burger-node').addEventListener('click', e => {
        document.querySelector('#sidebar-node').classList.toggle('close');
    });
});