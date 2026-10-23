// Use your own OpenWeatherMap API Key below
const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById('error');
const chart = document.getElementById('chart');

// The latest weather, so the page can be redrawn (for example when the unit changes) without a new request
let currentData = null; // { place: { name, country, lat, lon }, current: ..., forecast: ... }

function getErrorMessage(commonError) {
    if (commonError.status === 400) {
        return 'Please type a city name.';
    } else if (commonError.status === 401) {
        return 'The API key is not valid or not active yet.';
    } else if (commonError.status === 404) {
        return 'City not found. Please try again.';
    } else if (commonError.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
    } else if (commonError.status === undefined) {
        return 'Check your internet connection. Please try again.';
    } else {
        return `Something went wrong (error ${commonError.status}).`;
    }
}

async function showForecast(location) {
    const current = await fetchCurrentWeather(location);
    const forecast = await fetchForecast(location);

    const place = { lat: forecast.city.coord.lat, lon: forecast.city.coord.lon };

    let openMeteo = null;
    try {
        openMeteo = await fetchOpenMeteo(place);
    } catch (sourceError) {
        console.log('Open-Meteo failed to fetch', sourceError);
    }

    let metNo = null;
    try {
        metNo = await fetchMetNo(place);
    } catch (sourceError) {
        console.log('MET Norway failed to fetch', sourceError);
    }

    currentData = {
        place: {
            name: forecast.city.name,
            country: forecast.city.country,
            lat: forecast.city.coord.lat,
            lon: forecast.city.coord.lon
        },
        current: current,
        forecast: forecast,
        openMeteo: openMeteo,
        metNo: metNo
    };
    renderForecast();
    updateFavoriteButton();
}

// Draws the current weather and the forecast from currentData, and sets the colors of the page
function renderForecast() {
    weatherContainer.innerHTML = '';

    city.innerHTML = `Weather for ${formatPlaceName(currentData.place)}`;

    weatherContainer.appendChild(createCurrentWeather(currentData.current));
    applyTheme(currentData.current.main.temp, currentData.current.weather[0].icon);

    currentData.forecast.list.forEach(function (hourlyWeatherData) {
        weatherContainer.appendChild(createWeatherDescription(hourlyWeatherData));
    });

    buildChart();
}

// Called by the "Submit" button
function fetchWeather() {
    showForecast(document.getElementById('cityInput').value);
}
 

