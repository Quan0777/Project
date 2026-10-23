function getGeolocationErrorMessage(geoError) {
    if (geoError.code === 1) {
        return 'Location access was denied. Allow it in your browser settings to use this.';
    } else if (geoError.code === 2) {
        return 'Your location could not be determined.';
    } else if (geoError.code === 3) {
        return 'Finding your location took too long. Please try again.';
    } else {
        return 'Could not get your location.';
    }
}


// Called by the "Use your current position" button
function useCurrentLocation() {
    error.innerHTML = '';
 
    if (!navigator.geolocation) {
        error.innerHTML = 'The location request is not supported by your browser.';
        return;
    }
 
    navigator.geolocation.getCurrentPosition(
        function (position) {
            showForecast({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
        },
        function (geoError) {
            error.innerHTML = getGeolocationErrorMessage(geoError);
        }
    );
}