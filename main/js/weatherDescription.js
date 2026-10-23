// CURRENT WEATHER
function createCurrentWeather(current) {
    const weatherInfo = current.weather[0]; // { description: "light rain", icon: "10d", ... }

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