/**
 * generates some random routes to test the heatmap
 */
const axios = require('axios');

const ROUTES_TO_CREATE = 150;

const destinations = ['41.391311, 2.151142',
'41.389500, 2.160616',
'41.386296, 2.155316',
'41.384324, 2.151153',
'41.385628, 2.142785',
'41.390289, 2.141219',
'41.393066, 2.144631',
'41.394445, 2.151320',
'41.392014, 2.161963',
'41.394509, 2.167885',
'41.394384, 2.176027',
'41.391156, 2.173752',
'41.387920, 2.169965',
'41.392588, 2.169632',
'41.391311, 2.151142',
'41.389500, 2.160616',
'41.386296, 2.155316',
'41.384324, 2.151153',
'41.385628, 2.142785',
'41.390289, 2.141219',
'41.393066, 2.144631',
'41.394445, 2.151320',
'41.392014, 2.161963',
'41.394509, 2.167885',
'41.394384, 2.176027',
'41.391156, 2.173752',
'41.387920, 2.169965',
'41.392588, 2.169632',
'41.391311, 2.151142',
'41.389500, 2.160616',
'41.386296, 2.155316',
'41.384324, 2.151153',
'41.385628, 2.142785',
'41.390289, 2.141219',
'41.393066, 2.144631',
'41.394445, 2.151320',
'41.392014, 2.161963',
'41.394509, 2.167885',
'41.394384, 2.176027',
'41.391156, 2.173752',
'41.387920, 2.169965',
'41.392588, 2.169632',
'41.38879,2.15899',
'41.45004,2.24741',
'41.379158,2.139951',
'41.387220,2.170159',
'41.385884,2.163933',
'41.384382,2.194233',
'41.388656,2.151093',
'41.413923,2.131463',
'41.408592,2.154267'
];

const transports  = ['walking', 'bicycling', 'driving', 'transit'];

generateRoutes();

function getRandomDestination() {
  return destinations[Math.floor(Math.random() * destinations.length)];
}

function getRandomTransportType() {
  return transports[Math.floor(Math.random() * transports.length)];
}

async function generateRoutes() {
  const apiKey = getGoogleMapsApiKey();

  for (let i = 0; i < ROUTES_TO_CREATE; i++) {
    await createRoute({ origin: getRandomDestination(), destination: getRandomDestination()}, apiKey);
  }

  stryke.resolve(ROUTES_TO_CREATE + ' routes created');   
}

async function createRoute(destinationPoints, apiKey) {
  
  const transportType = getRandomTransportType();

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${destinationPoints.origin}&destination=${destinationPoints.destination}&key=${apiKey}&mode=${transportType}`;

  try {
    const response = await axios.get(url);

    const route = parseWaypoints(response.data, transportType);
    await stryke.create('route', route);
  }
  catch(error) {
    // handle errors
    stryke.error('Callout failed: ' + error.message);
  }
}

function parseWaypoints(data, transportType) {
  
  const selectedRoute = data.routes[0];
  const routeLegs = selectedRoute.legs;

  let route = {
    path: selectedRoute.overview_polyline.points,    
    start_lat: routeLegs[0].start_location.lat,
    start_lng: routeLegs[0].start_location.lng,
    end_lat: routeLegs[routeLegs.length-1].end_location.lat,
    end_lng: routeLegs[routeLegs.length-1].end_location.lng,
    routeName: `${transportType} from: ${routeLegs[0].start_address} to: ${routeLegs[routeLegs.length-1].end_address}`
  }

  return route;
}

async function getGoogleMapsApiKey() {
  try {
    const result = stryke.find(`Settings { googleMapsApiKey }`);
    return result[0].googleMapsApiKey;
  }
  catch (err) {
    console.error('Failed to retrieve the google maps api key. ' + err.message);
    stryke.error('Failed to retrieve the app\'s settings. Does a settings records exist? Is the key set on that record?');
  }
}