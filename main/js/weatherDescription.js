// CURRENT WEATHER (today)
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

// WEATHER FORECAST (24 hours, 3-hour increments)
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

    // Formatted date string in the format: DD/MM/YY hh:mm:ss AM/PM
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${period}`;
}

// One row of the forecast: icon, temperature, time and date
function createWeatherDescription(weatherData) {
    const { main, dt } = weatherData;
    const weatherInfo = weatherData.weather[0];

    const description = document.createElement("div");
    const convertedDateAndTime = convertToLocalTime(dt);

    description.innerHTML = `
        <div class = "weather_description">${getWeatherIcon(weatherInfo.icon)} ${formatTemperature(main.temp)} - ${convertedDateAndTime.substring(9)} - ${convertedDateAndTime.substring(0, 8)} </div>
    `;
    return description;
}