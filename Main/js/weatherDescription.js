// Today's weather: icon, temperature, description, wind speed and humidity
function createCurrentWeather(current) {
    const weatherInfo = current.weather[0];

    const container = document.createElement('div');
    container.className = 'current_weather';

    container.innerHTML = `
        <div class = "current_icon">${getWeatherIcon(weatherInfo.icon)}</div>
        <div class = "current_temperature">${formatTemperature(current.main.temp)}</div>
        <div class = "current_description">${weatherInfo.description}</div>
        <div class = "current_details">Wind: ${Math.round(current.wind.speed)} m/s</div>
        <div class = "current_details">Humidity: ${current.main.humidity}%</div>
    `;
    return container;
}

// 24-hour forecast with 3-hour intervals
// One row of the forecast: icon, temperature, time and date
function createWeatherDescription(weatherData) {
    const weatherInfo = weatherData.weather[0];

    // dt is in seconds, so it is multiplied by 1000 to get milliseconds. The time is shown in the local timezone of the user
    const date = new Date(weatherData.dt * 1000);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString();

    const description = document.createElement("div");

    description.innerHTML = `
        <div class = "weather_description">${getWeatherIcon(weatherInfo.icon)} ${formatTemperature(weatherData.main.temp)} - ${time} - ${day} </div>
    `;
    return description;
}
