// UNIT SWITCH (°C / °F / K)
// Loaded AFTER favorites.js (it uses loadFromStorage and saveToStorage from there) and BEFORE basic.js.
const unitSymbols = { C: '°C', F: '°F', K: 'K' };
const unitButtons = document.querySelectorAll('.unit-button');

// The saved unit, or °C if nothing valid is saved
let unit = loadFromStorage('unit', 'C');
if (!unitSymbols[unit]) {
    unit = 'C';
}

// The APIs gives °C, this converts it to the chosen unit
function formatTemperature(celsius) {
    let value = celsius;
    if (unit === 'F') {
        value = celsius * 9 / 5 + 32;
    } else if (unit === 'K') {
        value = celsius + 273.15;
    }
    return `${value.toFixed(1)}${unitSymbols[unit]}`;
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