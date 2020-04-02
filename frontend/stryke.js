// set this to a valid access token for your Stryke app
// You can get an access token by authenticating with Stryke using the login endpoint:
// https://api.stryke.io/v0/{appInstanceName}/auth/login
// Docs: 
// https://docs.stryke.io/assets/enduserapi.html#operation/authenticateUsingPOST
const STRYKE_TOKEN = '';
const APP_NAME = 'vheat';

// functions to retrieve routes from Stryke
async function getRoutes() {  
    
  try {
    const response = await postData('/action/getroutes');
    
    if (response) {
     return response.data;
    }  
  } catch (e) {    
    console.error("Request to Stryke failed: " + e.message);  
  }  
}

// functions to submit route to Stryke
async function submitRoute(routeDetails) {  
  
  try {
    const response = await postData('/action/submitRoute', routeDetails);        
  } catch (e) {        
    console.error("Request to Stryke failed: " + e.message);  
  }  
}

async function postData(endpoint = '', data = {}) {  
  
  const url = 'https://api.stryke.io/v0/' + APP_NAME + endpoint;
  const response = await fetch(url, {
    method: 'POST', 
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + STRYKE_TOKEN
    },    
    body: JSON.stringify(data)
  });
  return await response.json();
}