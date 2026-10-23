const apiKey = '9d61f69dcb5bfbc0b3cd9aca30515436';

// OpenWeatherMap: location is a city name (string) or an object with lat and lon
function getLocationQuery(location) {
    if (typeof location === 'string') {
        return `q=${encodeURIComponent(location)}`;
    }
    return `lat=${location.lat}&lon=${location.lon}`;
}

// OpenWeatherMap: forecast for the next 24 hours (3-hour increments)
async function fetchForecast(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${getLocationQuery(location)}&appid=${apiKey}&units=${units}&cnt=${cnt}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const commonError = new Error(`Request failed with status ${response.status}`);
        commonError.status = response.status;
        throw commonError;
    }
    const data = await response.json();

    return data;
}

// The weather right now
async function fetchCurrentWeather(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${getLocationQuery(location)}&appid=${apiKey}&units=${units}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const commonError = new Error(`Request failed with status ${response.status}`);
        commonError.status = response.status;
        throw commonError;
    }
    const data = await response.json();

    return data;
}

// Open-Meteo
async function fetchOpenMeteo(location) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&forecast_days=2&timeformat=unixtime`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const commonError = new Error(`Request failed with status ${response.status}`);
        commonError.status = response.status;
        throw commonError;
    }
    const data = await response.json();

    return data;
}

// MET Norway: temperatures (MET only accepts max 4 decimals in the coordinates)
async function fetchMetNo(location) {
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${Number(location.lat).toFixed(4)}&lon=${Number(location.lon).toFixed(4)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const commonError = new Error(`Request failed with status ${response.status}`);
        commonError.status = response.status;
        throw commonError;
    }
    const data = await response.json();

    return data;
}