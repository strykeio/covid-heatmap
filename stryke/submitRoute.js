/**
 * This script accepts a payload with geo start and end points, as well as an 
 * optional type of transport, and calculates a route between those points.
 * A new route record is created with the information calculated. 
 * 
 * For more details on Stryke check out: www.stryke.io
 * For documentation go to: docs.stryke.io
 */
const axios = require('axios');

generateRoute();

async function generateRoute() {
    
  try {
    const payload = stryke.data.requestData;    
    
    const startPoint = `${payload.start_lat},${payload.start_lng}`;
    const endPoint = `${payload.end_lat},${payload.end_lng}`;
    const routeType = payload.routeType ? payload.routeType : 'walking';

    await getDirections(startPoint, endPoint, routeType);
    
    stryke.resolve('route created');   
  }
  catch(error) {
    // handle errors
    stryke.error('Callout failed: ' + error.message);
  }
}

async function getDirections(startPoint, endPoint, routeType) {  
  const apiKey = await getGoogleMapsApiKey();

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${endPoint}&key=${apiKey}&mode=${routeType}`;

  console.log('url: ' + url);
  const response = await axios.get(url);
  
  const route = createRouteFromDirections(response.data, routeType);
  await stryke.create('route', route);
}

function createRouteFromDirections(data, routeType) {
  
  const selectedRoute = data.routes[0];
  const routeLegs = selectedRoute.legs;

  // store the encoded polyline, start and end points and construct a readable name
  let route = {
    path: selectedRoute.overview_polyline.points,    
    start_lat: routeLegs[0].start_location.lat,
    start_lng: routeLegs[0].start_location.lng,
    end_lat: routeLegs[routeLegs.length-1].end_location.lat,
    end_lng: routeLegs[routeLegs.length-1].end_location.lng,
    routeName: `${routeType} from: ${routeLegs[0].start_address} to: ${routeLegs[routeLegs.length-1].end_address}`
  }

  return route;
}

async function getGoogleMapsApiKey() {
  try {
    const result = await stryke.find(`{ Settings { googleMapsApiKey } }`);
    return result[0].googleMapsApiKey;
  }
  catch (err) {
    console.error('Failed to retrieve the google maps api key. ' + err.message);
    stryke.error('Failed to retrieve the app\'s settings. Does a settings records exist? Is the key set on that record?');
  }
}