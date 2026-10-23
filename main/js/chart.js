// Getting the temperatures from the APIs
function getOpenMeteoTemperatures(data) {
    const temperatures = new Map();
    data.hourly.time.forEach((time, i) => {
        temperatures.set(time, data.hourly.temperature_2m[i]);
    });
    return temperatures;
}

function getMetNoTemperatures(data) {
    const temperatures = new Map();
    data.properties.timeseries.forEach((entry) => {
        temperatures.set(Date.parse(entry.time) / 1000, entry.data.instant.details.air_temperature);
    });
    return temperatures;
}


// CHART
const buildChart = () => {
    const list = currentData.forecast.list
    const round1 = value => Math.round(value * 10) / 10

    const labels = list.map(item =>
        new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )

    const datasets = [
        { name: "OpenWeatherMap", values: list.map(item => round1(item.main.temp)) }
    ]

    // Add a source only if it has a value for every timestamp, otherwise the line would have gaps
    const addSource = (name, source) => {
        if(!source) {
            return;
        }
        const values = list.map(item => source.get(item.dt))
        if(values.every(value => value !== undefined)) {
            datasets.push({ name: name, values: values.map(round1) })
        }
    }

    addSource("Open-Meteo", currentData.openMeteo ? getOpenMeteoTemperatures(currentData.openMeteo) : null)
    addSource("MET Norway", currentData.metNo ? getMetNoTemperatures(currentData.metNo) : null)

    const chart = new frappe.Chart("#chart", {
        title: "Temperature forecast, next 24 hours (°C)",
        data: { labels: labels, datasets: datasets },
        type: "bar",
        height: 400,
        colors: ['#e67e22', '#2980b9', '#27ae60'],
        lineOptions: {
            hideDots: 0,
            regionFill: 0
        }
    })
}