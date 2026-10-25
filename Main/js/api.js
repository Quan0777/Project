const apiKey = '9d61f69dcb5bfbc0b3cd9aca30515436'; // API key for OpenWeather here
const units = 'metric'; // the API gives °C, units.js changes it 
const cnt = 9; // 9 forecasts

// Return either a city name or coordinates
function getLocationQuery(location) {
    if (location.city !== undefined) {
        return `q=${location.city}`;
    }
    return `lat=${location.lat}&lon=${location.lon}`;
}


// Each function gives back the response of the API. The one who calls it checks response.ok and reads the data with response.json()

// OpenWeather: the weather right now
async function fetchCurrentWeather(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${getLocationQuery(location)}&appid=${apiKey}&units=${units}`;
    return await fetch(apiUrl);
}

// OpenWeather: forecast for the next 24 hours (every 3 hours)
async function fetchForecast(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${getLocationQuery(location)}&appid=${apiKey}&units=${units}&cnt=${cnt}`;
    return await fetch(apiUrl);
}

// Open-Meteo
async function fetchOpenMeteo(location) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&forecast_days=3&timeformat=unixtime`;
    return await fetch(apiUrl);
}

// MET Norway (it only accepts max 4 decimals in the coordinates)
async function fetchMetNo(location) {
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location.lat.toFixed(4)}&lon=${location.lon.toFixed(4)}`;
    return await fetch(apiUrl);
}
