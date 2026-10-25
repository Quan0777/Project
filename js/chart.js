// Changes °C to the chosen unit and rounds to 1 decimal
function convertForChart(celsius) {
    return Math.round(convertTemperature(celsius) * 10) / 10;
}

// Open-Meteo: one temperature for each time in the OpenWeather list
function getOpenMeteoValues(data, list) {
    const times = data.hourly.time;
    const values = [];

    for (let i = 0; i < list.length; i++) {
        let temperature = null;

        for (let j = 0; j < times.length; j++) {
            if (times[j] === list[i].dt) {
                temperature = data.hourly.temperature_2m[j];
            }
        }

        if (temperature === null) {   // Gives null if a time is missing, so the chart does not get gaps
            return null;
        }
        values.push(convertForChart(temperature));
    }

    return values;
}

// MET Norway: one temperature for each time in the OpenWeather list
function getMetNoValues(data, list) {
    const entries = data.properties.timeseries;
    const values = [];

    for (let i = 0; i < list.length; i++) {
        let temperature = null;

        for (let j = 0; j < entries.length; j++) {
            // MET Norway gives the time as text, this changes it to seconds like OpenWeather
            const seconds = Date.parse(entries[j].time) / 1000;
            if (seconds === list[i].dt) {
                temperature = entries[j].data.instant.details.air_temperature;
            }
        }

        if (temperature === null) {   // Gives null if a time is missing, so the chart does not get gaps
            return null;
        }
        values.push(convertForChart(temperature));
    }

    return values;
}

// Draws the chart
function buildChart() {
    const list = currentData.forecast.list;
    const labels = [];
    const openWeatherValues = [];

    for (let i = 0; i < list.length; i++) {
        const date = new Date(list[i].dt * 1000);
        labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        openWeatherValues.push(convertForChart(list[i].main.temp));
    }

    const datasets = [
        { name: "OpenWeatherMap", values: openWeatherValues }
    ];

    // The other two sources are only added if they were fetched and have all the times
    if (currentData.openMeteo) {
        const openMeteoValues = getOpenMeteoValues(currentData.openMeteo, list);
        if (openMeteoValues !== null) {
            datasets.push({ name: "Open-Meteo", values: openMeteoValues });
        }
    }

    if (currentData.metNo) {
        const metNoValues = getMetNoValues(currentData.metNo, list);
        if (metNoValues !== null) {
            datasets.push({ name: "MET Norway", values: metNoValues });
        }
    }

    new frappe.Chart("#chart", {
        title: `Temperature forecast, next 24 hours (${unitSymbols[unit]})`,
        data: { labels: labels, datasets: datasets },
        type: "bar",
        height: 400,
        colors: ['#e67e22', '#2980b9', '#27ae60']
    });
}