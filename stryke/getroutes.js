
/**
 * This script retrieves all routes in the last 7 days
 * 
 * For more details on Stryke check out: www.stryke.io
 * For documentation go to: docs.stryke.io
 */
const moment = require('moment');
const DATA_WINDOW_DAYS = 7;

async function getRoutes() {

    const startDate = moment().add(-DATA_WINDOW_DAYS, 'days');
    console.log(startDate.toISOString());
    try {
        const routes = await stryke.find(`{ 
                Route ( filter: { created : { gt : "${startDate.toISOString()}" }}      
                ) {
                    start_lat, start_lng, end_lat, end_lng, path
                }
            }`);

        stryke.resolve(routes);
    }
    catch (err) {
        console.error('Failed to retrieve routes: ' + err.message);
        stryke.error('Failed to retrieve routes');
    }
}

getRoutes();