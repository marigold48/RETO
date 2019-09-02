define(require => {  
    return {
        fillIndicator: (id, value) => document.querySelector(`#${id}-indicator-value`).innerHTML = value ? value.toString().replace('.',  ',') : 'No data',
        fillChart: (instance, newData) => instance.update(newData),
        flyTo: (mapInstance, coords) => mapInstance.flyTo({ center: [coords.lon, coords.lat] }),
        getTargetCity: () => document.querySelector('#cityNode').value
    }
});