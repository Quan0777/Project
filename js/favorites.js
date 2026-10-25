const favoriteButton = document.getElementById('favoriteButton');
const favoritesList = document.getElementById('favoritesList');

// Gets a saved value from the browser
function loadFromStorage(key, fallback) {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        if (saved === null) {
            return fallback;
        }
        return saved;
    } catch (e) {
        return fallback;
    }
}

// Saves a value in the browser
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.log('Saving did not work', e);
    }
}

// The saved places
let favorites = loadFromStorage('favorites', []);

// Gives the place of the city in the favorites list, or -1 if it is not in the list
function getFavoriteIndex(place) {
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].name === place.name && favorites[i].country === place.country) {
            return i;
        }
    }
    return -1;
}

// "Helsinki, FI" for example, or just "Helsinki" if the country is not known
function formatPlaceName(place) {
    if (place.country) {
        return `${place.name}, ${place.country}`;
    }
    return place.name;
}

// Called by the star button: adds the city to the favorites, or removes it if it is already there
function toggleFavorite() {
    if (!currentData) {
        return;
    }

    const place = currentData.place;
    const index = getFavoriteIndex(place);

    if (index === -1) {
        favorites.push(place);
    } else {
        const newFavorites = [];
        for (let i = 0; i < favorites.length; i++) {
            if (i !== index) {
                newFavorites.push(favorites[i]);
            }
        }
        favorites = newFavorites;
    }

    saveToStorage('favorites', favorites);
    renderFavorites();
    updateFavoriteButton();
}

// Shows the favorite button only when a city is shown, and changes its text
function updateFavoriteButton() {
    if (!currentData) {
        favoriteButton.hidden = true;
        return;
    }

    favoriteButton.hidden = false;

    if (getFavoriteIndex(currentData.place) === -1) {
        favoriteButton.textContent = '☆ Add To Favorites';
    } else {
        favoriteButton.textContent = '★ Remove From Favorites';
    }
}

// Fills the favorites list with one button for each saved city
function renderFavorites() {
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.textContent = 'No favorites yet';
        return;
    }

    favorites.forEach(function (favorite) {
        const button = document.createElement('button');
        button.textContent = formatPlaceName(favorite);

        // When the button is clicked: close the list and show the weather of that city
        button.addEventListener('click', function () {
            favoritesList.hidden = true;
            showForecast(favorite);
        });

        favoritesList.appendChild(button);
    });
}

// Called by the "Favorites" button: shows or hides the list
function toggleFavoritesList() {
    favoritesList.hidden = !favoritesList.hidden;
}

renderFavorites();

document.getElementById('favoritesButton').addEventListener('click', toggleFavoritesList);
favoriteButton.addEventListener('click', toggleFavorite);
