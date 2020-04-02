COVID-19 Heatmap
==========================

![heatmap](https://strykeassets.fra1.digitaloceanspaces.com/vheat-heatmap.png)

This project contains a heatmap to monitor how people are moving during the COVID-19 outbreak. 

The heatmap displays journeys people went on over a period of time, highlighting areas of higher trafic with bolder lines. Additionally, start and end locations of people's journeys are drawn as points using the [Google heatmap layer API](https://developers.google.com/maps/documentation/javascript/heatmaplayer) which highlights areas of higher concentration with larger radiuses and different colors.  

This app allows anyone to see where people are concentrating so that users of the heatmap can choose to avoid those areas.

This project uses a Stryke app as the backend to hold data and perform additional logic.

[Stryke](https://www.stryke.io)

[Stryke - Documentation](https://docs.stryke.io)

### Live Demo

https://covidheatmap.glitch.me/

## Stryke App

The Stryke app that supports this project stores routes data in a dedicated table with the following info: 
- start of journey coordinates
- end of journey coordinates
- the path of the route
- a readable descriptive name for the route 

The app exposes the following two endpointsone.

### Submit a route

Accepts a POST request with start and end points and an optional routeType in the request's payload. This information is used to calculate a route between the points to then create the route record. 

`POST - https://api.stryke.io/v0/{appInstanceName}/action/submitRoute`

sample payload:
```
{
  "start_lat": 41.315296, 
  "start_lng": 2.0133208, 
  "end_lat": 41.4134488, 
  "end_lng": 2.0182425, 
  "routeType": "driving"
}
````

### Retrieve routes

A request to execute an action that retrieves a filtered list of routes to display on the heatmap. 

`POST - https://api.stryke.io/v0/{appInstanceName}/action/getroutes`


## Front end 

This project uses two pages. Both pages were developed using vanilla HTML+JS+CSS to allow to easily embed them in any existing page if necessary. 

### Submit route form

The data used to draw the heatmap can be submitted via the form in this project. The form uses the `submitRoute` action described above.

![login](https://strykeassets.fra1.digitaloceanspaces.com/vheat-login.png)

The form uses the google maps API in conjunction with the browser's supplied location to help users autopopulate the start and end locations with either the current location or via the Google autocomplete component. 

### Heatmap

The heatmap page retrieves data from Stryke via the `getroutes` endpoint described above. Data is plotted on a Google map using a combination of the Google Heatmap Layer API and polylines.

## How to use it

### Create a Heatmap app in Stryke or integrate with an existing one. 

This Glitch project works with a Stryke "heatmap" app. 

You can easily create your own version of the "heatmap" app or if you already have one, you can integrate with that. 

#### Create a Heatmap app in Stryke

You can use the app template found under: `/stryke/vheat-app.json` to import the app under your Stryke account. 

1. Sign up to Stryke
2. Login to stryke with your new user
3. Under your dashboard click on "Import from Template"
4. Select the "vheat-app.json" file

Note that the scripts' source code files are only included in this repository for reference. These same scripts will automatically be created in your app when importing it from the `/stryke/vheat-app.json` file.

### Point the front end to your app

- Change `STRYKE_TOKEN` in stryke.js with a valid token for your app 
  Create one by authenticating with a valid user: https://api.stryke.io/v0/{appInstanceName}/auth/login - see Docs [here](https://docs.stryke.io/assets/enduserapi.html#operation/authenticateUsingPOST)).

- Under `/stryke.js` change the value of `APP_NAME` to your app's unique name. 

### Set your Google Maps API Key

- Change `GOOGLE_MAPS_API_KEY` in the HTML pages (index.html and map.html) to your Google Maps API key ([Create one here](https://developers.google.com/maps/documentation/javascript/get-api-key)).


