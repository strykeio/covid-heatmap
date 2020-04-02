const DEAFULT_CENTER_LAT = 41.385965; 
const DEAFULT_CENTER_LNG = 2.164866;

async function initMap() {
  
  // if location access was granted use it to center the map, else use the default location
  navigator.geolocation.getCurrentPosition((position) => {
    const posLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    createMap(posLatLng);    
  },      
  (error) => {
    const posLatLng = new google.maps.LatLng(DEAFULT_CENTER_LAT, DEAFULT_CENTER_LNG);
    createMap(posLatLng);    
  });        
}

// creates the map element and calls to draw the heatmap
function createMap(centerPosition) {
  try {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: centerPosition,
        zoom: 14,
        mapTypeId: 'satellite'
      });
    drawHeatMap(map);    
  }
  catch (err) {
    console.error('Something went wrong drawing the heatmap: ' + err.message);
  }
}

// draws the heatmap (start and end points) and polylines (routes) on the map
async function drawHeatMap(map) {
  
  const heatmapData = new Array();
  const routes = await getRoutes();
  
  if (!routes) {
    console.error('Error retrieving heatmap data.');
    return;
  }
  
  for (const route of routes) {
    const polyObj = google.maps.geometry.encoding.decodePath(route.path);
 
    var path = new google.maps.Polyline({
      path: polyObj,
      geodesic: true,
      strokeColor: '#8ADE42',
      strokeOpacity: 0.3,
      strokeWeight: 6
    });
      
    path.setMap(map);    
    
    heatmapData.push(new google.maps.LatLng(route.start_lat, route.start_lng));
    heatmapData.push(new google.maps.LatLng(route.end_lat, route.end_lng));                             
  }
  
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    radius: 20
  });

  heatmap.setMap(map);
}                                     