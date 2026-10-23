const apiKey = '9d61f69dcb5bfbc0b3cd9aca30515436'; // API key for OpenWeather here
const units = 'metric'; // the API gives °C, units.js changes it 
const cnt = 9; // 9 forecasts


// Return either a city name or coordinates
function getLocationQuery(location) {
    if (typeof location === 'string') {
        return `q=${encodeURIComponent(location)}`;
    }
    return `lat=${location.lat}&lon=${location.lon}`;
}

// Fetch data from the APIs
async function fetchData(apiUrl) {
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const commonError = new Error(`Request failed with status ${response.status}`);
        commonError.status = response.status;
        throw commonError;
    }

    const data = await response.json();
    return data;
}


// OpenWeather: the weather right now
async function fetchCurrentWeather(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${getLocationQuery(location)}&appid=${apiKey}&units=${units}`;
    return await fetchData(apiUrl);
}

// OpenWeather: forecast for the next 24 hours (every 3 hours)
async function fetchForecast(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${getLocationQuery(location)}&appid=${apiKey}&units=${units}&cnt=${cnt}`;
    return await fetchData(apiUrl);
}

// Open-Meteo
async function fetchOpenMeteo(location) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&forecast_days=3&timeformat=unixtime`;
    return await fetchData(apiUrl);
}

// MET Norway (it only accepts max 4 decimals in the coordinates)
async function fetchMetNo(location) {
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location.lat.toFixed(4)}&lon=${location.lon.toFixed(4)}`;
    return await fetchData(apiUrl);
}