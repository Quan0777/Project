// FAVORITES (and saving in the browser)
// Loaded BEFORE basic.js. It uses currentData and showForecast from basic.js,
const favoriteButton = document.getElementById('favoriteButton');
const favoritesList = document.getElementById('favoritesList');

// Saving in the browser 
function loadFromStorage(key, fallback) {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return saved === null ? fallback : saved;
    } catch {
        return fallback;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Saving is not possible (for example storage is blocked), the app still works without it
    }
}

let favorites = loadFromStorage('favorites', []);

// Favorites: saved as { name, country, lat, lon }
function getFavoriteIndex(place) {
    return favorites.findIndex(function (favorite) {
        return favorite.name === place.name && favorite.country === place.country;
    });
}

// "Helsinki, FI" (or only the name when there is no country, like for the GPS location)
function formatPlaceName(place) {
    return place.country ? `${place.name}, ${place.country}` : place.name;
}

// Called by the star button
function toggleFavorite() {
    if (!currentData) {
        return;
    }

    const place = currentData.place;
    const index = getFavoriteIndex(place);

    if (index === -1) {
        favorites.push({
            name: place.name,
            country: place.country,
            lat: place.lat,
            lon: place.lon
        });
    } else {
        favorites.splice(index, 1);
    }

    saveToStorage('favorites', favorites);
    renderFavorites();
    updateFavoriteButton();
}

function updateFavoriteButton() {
    if (!currentData) {
        favoriteButton.hidden = true;
        return;
    }

    favoriteButton.hidden = false;
    favoriteButton.textContent = getFavoriteIndex(currentData.place) === -1 ? '☆ Add To Favorites' : '★ Remove From Favorites';
}

// Fills the favorites list with one button per saved place
function renderFavorites() {
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.textContent = 'No favorites yet';
        return;
    }

    favorites.forEach(function (favorite, index) {
        const button = document.createElement('button');
        button.textContent = formatPlaceName(favorite);
        button.addEventListener('click', function () {
            selectFavorite(index);
        });
        favoritesList.appendChild(button);
    });
}

// Called by the "Favorites" button: shows or hides the list
function toggleFavoritesList() {
    favoritesList.hidden = !favoritesList.hidden;
}

// Called when a favorite is clicked
function selectFavorite(index) {
    const favorite = favorites[index];

    favoritesList.hidden = true; // closes the favorites list
    showForecast(favorite);
}

renderFavorites();