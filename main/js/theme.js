// ICONS AND LOOK & FEEL

// OpenWeatherMap has a picture for every weather. The icon code (for example "10d") is the name of the picture.
function getWeatherIcon(iconCode) {
    return `<img src = "https://openweathermap.org/img/wn/${iconCode}.png" alt = "weather icon">`;
}

// Changes the colors of the page by the current weather.
// Temperature is in °C. The last letter of iconCode is "n" at night and "d" in the daytime.
function applyTheme(temperature, iconCode) {
    let backgroundColor;
    let textColor = 'black';

    if (iconCode.endsWith('n')) {
        backgroundColor = '#0b1026'; // night: dark
        textColor = 'white';
    } else if (temperature < 0) {
        backgroundColor = '#1183ee'; // freezing: blue
    } else if (temperature < 10) {
        backgroundColor = '#54b2ff'; // cold: light blue
    } else if (temperature < 20) {
        backgroundColor = '#ffe9a8'; // mild: yellow
    } else if (temperature < 28) {
        backgroundColor = '#ffb36b'; // warm: orange
    } else {
        backgroundColor = '#ff6347'; // hot: red
    }

    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;
}