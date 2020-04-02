// reference: https://developers.google.com/maps/documentation/javascript/places-autocomplete
let startAutocomplete, endAutocomplete, routeDetails = {};

// Initialise the autocomplete elements (locations)
function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  startAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('start'), {types: ['geocode']});
  endAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('end'), {types: ['geocode']});

  // restrict the set of place fields that are returned to just the address components.
  startAutocomplete.setFields(['geometry']);
  endAutocomplete.setFields(['geometry']);

  // When the user selects an address from the drop-down, set the route details with lat and lng
  startAutocomplete.addListener('place_changed', setStartAddress);
  endAutocomplete.addListener('place_changed', setEndAddress);
}

function setStartAddress() {  
  // Get the lat and lng from the autocomplete object.
  var place = startAutocomplete.getPlace();
  console.log(`start address: ${place.geometry.location.lat()}, ${place.geometry.location.lng()}`);
  routeDetails.start_lat = place.geometry.location.lat();
  routeDetails.start_lng = place.geometry.location.lng();
}

function setEndAddress() {  
  // Get the lat and lng from the autocomplete object.
  var place = endAutocomplete.getPlace();
  console.log(`end address: ${place.geometry.location.lat()}, ${place.geometry.location.lng()}`);
  routeDetails.end_lat = place.geometry.location.lat();
  routeDetails.end_lng = place.geometry.location.lng();
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
      startAutocomplete.setBounds(circle.getBounds());
      endAutocomplete.setBounds(circle.getBounds());
    });
  }
}

document.getElementById("submit").onclick = () => {     
  setRouteType();
  if (isRouteDetailsSet()) {
    submitRoute(routeDetails);
  }  
}  

document.getElementById("startAutoLocation").onclick = (button) => {      
  navigator.geolocation.getCurrentPosition(function(position) {
      routeDetails.start_lat = position.coords.latitude;
      routeDetails.start_lng = position.coords.longitude;
      document.getElementById("start").value = 'Current location';
  });
}  

document.getElementById("endAutoLocation").onclick = (button) => {      
  navigator.geolocation.getCurrentPosition(function(position) {
      routeDetails.end_lat = position.coords.latitude;
      routeDetails.end_lng = position.coords.longitude;
      document.getElementById("end").value = 'Current location';
  });
}  

// do not submit the form when hitting enter (13) on the location autocomplete
function fieldSubmit(event) {
  if(event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
}

function setRouteType() {
  var radios = document.getElementsByName('routeType');

  for (var radio of radios) {
    if (radio.checked) {
      routeDetails.routeType = radio.value;
    }
  }  
}

function isRouteDetailsSet() {
  return routeDetails && 
    routeDetails.start_lat && 
    routeDetails.start_lng && 
    routeDetails.end_lat && 
    routeDetails.end_lng;
}
