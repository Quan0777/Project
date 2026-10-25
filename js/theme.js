// OpenWeatherMap has a picture for every weather. The icon code (for example "10d") is the name of the picture
function getWeatherIcon(iconCode) {
    return `<img src = "https://openweathermap.org/img/wn/${iconCode}.png" alt = "weather icon">`;
}

// Changes the colors of the page by the "n" at night and "d" in the daytime
function applyTheme(temperature, iconCode) {
    let backgroundColor;
    let textColor = 'black';

    if (iconCode.endsWith('n')) {
        backgroundColor = '#0b1026'; // night
        textColor = 'white';
    } else if (temperature < 0) {
        backgroundColor = '#1183ee'; // freezing
    } else if (temperature < 10) {
        backgroundColor = '#54b2ff'; // cold
    } else if (temperature < 20) {
        backgroundColor = '#ffe9a8'; // mild
    } else if (temperature < 28) {
        backgroundColor = '#ffb36b'; // warm
    } else {
        backgroundColor = '#ff6347'; // hot
    }

    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;
}