define(require => {
    const config = require('./config');
    const utils = require('./utils');
    const axios = require('axios.min');
    const URL = (type, city) => `https://api.openweathermap.org/data/2.5/${type}?q=${city}&units=metric&APPID=${config.weather_api_key}`

    const fetchData = async url => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    function fetchAPIResponse(type, city) {
        if (type === 'weather') {
            fetchData(URL('weather', city)).then(response => {
                let coords = response.coord;
                utils.flyTo(config.mapInstance, coords);

                config.cityCircle.update({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': new Array(coords.lon, coords.lat)
                    }
                });

                let indicartors = response.main;
                utils.fillIndicator('temperature', indicartors.temp);
                utils.fillIndicator('humidity', indicartors.humidity);
                utils.fillIndicator('pressure', indicartors.pressure); 
            })
            .catch(e => { 
                alert('Please check the input.'); 
                console.warn(`External error: ${e}`); 
            });
        } else if (type === 'forecast') {
            fetchData(URL('forecast', city)).then(response => {
                let target = response.list.slice(1, 30);
                let days = target.map(d => `${d.dt_txt.slice(5, 13)}h`);

                let values = [...target.reduce((mp, o) => {
                    if (!mp.has(o.main)) mp.set(o.main, {...o.main});    
                    mp.get(o.main);
                    return mp;
                }, new Map).values()];

                utils.fillChart(config.temperatureChart, {
                    labels: days,
                    data: values.map(v => v.temp)
                });

                utils.fillChart(config.humidityChart, {
                    labels: days,
                    data: values.map(v => v.humidity)
                });

                utils.fillChart(config.pressureChart, {
                    labels: days,
                    data: values.map(v => v.pressure)
                });
            })
            .catch(e => { 
                alert('Please check the input.'); 
                console.warn(`External error: ${e}`); 
            });
        }
    }

    return fetchAPIResponse;
});