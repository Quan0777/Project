const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById('error');
const chart = document.getElementById('chart');

let currentData = null; 

// Error messages for the user
function getErrorMessage(status) {
    if (status === 400) {
        return 'Please type a city name.';
    } else if (status === 401) {
        return 'The API key is not valid or not active yet.';
    } else if (status === 404) {
        return 'City not found. Please try again.';
    } else if (status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
    } else if (status === undefined) {
        return 'Check your internet connection. Please try again.';
    } else {
        return `Something went wrong (error ${status}).`;
    }
}

async function showForecast(location) {
    try {
        weatherContainer.innerHTML = '';
        error.innerHTML = '';
        city.innerHTML = '';
        chart.innerHTML = '';
        currentData = null;
        updateFavoriteButton();

        const currentResponse = await fetchCurrentWeather(location);
        if (!currentResponse.ok) {
            error.innerHTML = getErrorMessage(currentResponse.status);
            return;
        }
        const current = await currentResponse.json();

        const forecastResponse = await fetchForecast(location);
        if (!forecastResponse.ok) {
            error.innerHTML = getErrorMessage(forecastResponse.status);
            return;
        }
        const forecast = await forecastResponse.json();

        const place = {
            name: forecast.city.name,
            country: forecast.city.country,
            lat: forecast.city.coord.lat,
            lon: forecast.city.coord.lon
        };

        // The two extra sources are optional: if one fails, the page still works
        let openMeteo = null;
        try {
            const openMeteoResponse = await fetchOpenMeteo(place);
            if (openMeteoResponse.ok) {
                openMeteo = await openMeteoResponse.json();
            }
        } catch (sourceError) {
            console.log('Open-Meteo failed to fetch', sourceError);
        }

        let metNo = null;
        try {
            const metNoResponse = await fetchMetNo(place);
            if (metNoResponse.ok) {
                metNo = await metNoResponse.json();
            }
        } catch (sourceError) {
            console.log('MET Norway failed to fetch', sourceError);
        }

        currentData = {
            place: place,
            current: current,
            forecast: forecast,
            openMeteo: openMeteo,
            metNo: metNo
        };
        renderForecast();
        updateFavoriteButton();
    }

    catch (commonError) {
        console.log(commonError);
        error.innerHTML = getErrorMessage();
    }
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
    showForecast({ city: document.getElementById('cityInput').value });
}

document.getElementById('submitButton').addEventListener('click', fetchWeather);
