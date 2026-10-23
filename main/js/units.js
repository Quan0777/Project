// UNIT SWITCH (°C / °F / K)
const unitSymbols = { C: '°C', F: '°F', K: 'K' };
const unitButtons = document.querySelectorAll('.unit-button');

// The saved unit, or °C if nothing valid is saved
let unit = loadFromStorage('unit', 'C');
if (!unitSymbols[unit]) {
    unit = 'C';
}

// The APIs give °C, this converts it to the chosen unit (as a number)
function convertTemperature(celsius) {
    if (unit === 'F') {
        return celsius * 9 / 5 + 32;
    } else if (unit === 'K') {
        return celsius + 273.15;
    }
    return celsius;
}

// The converted temperature as text, for example "21.5°F"
function formatTemperature(celsius) {
    return `${convertTemperature(celsius).toFixed(1)}${unitSymbols[unit]}`;
}

// Marks the button of the chosen unit with the class "active" 
function updateUnitButtons() {
    unitButtons.forEach(function (button) {
        button.classList.toggle('active', button.dataset.unit === unit);
    });
}

// Called by the unit buttons
function setUnit(newUnit) {
    if (!unitSymbols[newUnit]) {
        return;
    }
    unit = newUnit;
    saveToStorage('unit', unit);
    updateUnitButtons();

    if (currentData) {
        renderForecast();
    }
}

updateUnitButtons();