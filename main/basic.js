// Use your own OpenWeatherMap API Key below
const apiKey = '9d61f69dcb5bfbc0b3cd9aca30515436'

const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById('error');

const units = 'metric'; //can be imperial(°F) or metric(°C)
let temperatureSymbol = units == 'metric' ? '°C' : '°F';
const cnt = 9; // Number of 3-hour increments to display (9 increments = 24 hours)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function fetchForecast(cityInputtedByUser) {
    let locationQuery;
    if (typeof location === 'string') {
        locationQuery = `q=${encodeURIComponent(location)}`;
    } else {
        locationQuery = `lat=${location.lat}&lon=${location.lon}`;
    }   

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputtedByUser}&appid=${apiKey}&units=${units}&cnt=${cnt}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const commonError = new Error(`Request failed with status ${response.status}`);
        commonError.status = response.status;
        throw commonError;
    }
    const data = await response.json();

    return data;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

async function showForecast() {
    try {
        weatherContainer.innerHTML = '';
        error.innerHTML = '';
        city.innerHTML = '';

        const cityInputtedByUser = document.getElementById('cityInput').value;
        const data = await fetchForecast(cityInputtedByUser);

        //Display weather data for each 3 hour increment
        data.list.forEach(hourlyWeatherData => {
            const hourlyWeatherDataDiv = createWeatherDescription(hourlyWeatherData);
            weatherContainer.appendChild(hourlyWeatherDataDiv);
        });
        
        // Display city name based on latitude and longitude
        city.innerHTML = `Hourly Weather for ${data.city.name}`;
    } 
    
    catch (commonError) {
        console.log(commonError);
        error.innerHTML = getErrorMessage(commonError);
    }

}

// Called by the "Get Weather" button. It had to be separated from showForecast() since useCurrentLocation() needs to call showForecast() with a different parameter.
function fetchWeather() {
    showForecast(document.getElementById('cityInput').value);
}
 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getGeolocationErrorMessage(geoError) {
    if (geoError.code === 1) {
        return 'Location access was denied. Allow it in your browser settings to use this.';
    } else if (geoError.code === 2) {
        return 'Your location could not be determined.';
    } else if (geoError.code === 3) {
        return 'Finding your location took too long. Please try again.';
    } else {
        return 'Could not get your location.';
    }
}


// Called by the "Use your current position" button
function useCurrentLocation() {
    error.innerHTML = '';
 
    if (!navigator.geolocation) {
        error.innerHTML = 'The location request is not supported by your browser.';
        return;
    }
 
    navigator.geolocation.getCurrentPosition(
        position => {
            showForecast({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
        },
        geoError => {
            error.innerHTML = getGeolocationErrorMessage(geoError);
        }
    );
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function convertToLocalTime(dt) {
    // Create a new Date object by multiplying the Unix timestamp by 1000 to convert it to milliseconds
    // Will produce a time in the local timezone of user's computer
    const date = new Date(dt * 1000);

    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM

    // Formatted date string in the format: DD/MM/YYYY hh:mm:ss AM/PM
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${period}`;
}

function createWeatherDescription(weatherData) {
    const { main, dt } = weatherData;

    const description = document.createElement("div");
    const convertedDateAndTime = convertToLocalTime(dt);

    description.innerHTML = `
        <div class = "weather_description">${main.temp}${temperatureSymbol} - ${convertedDateAndTime.substring(9)} - ${convertedDateAndTime.substring(0, 8)} </div>
    `;
    return description;
}