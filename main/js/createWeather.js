const units = 'metric'; // The API always gives °C. The unit switch (units.js) converts it on the page.
const cnt = 9; // Number of 3-hour increments to display (9 increments = 24 hours)

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