const express = require('express');
const fetch = require('node-fetch'); 
const app = express();
const path = require('path');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Fetch crew member details by ID
async function fetchCrewDetails(crewIds) {
    const crewDetails = await Promise.all(crewIds.map(async (id) => {
      const response = await fetch(`https://api.spacexdata.com/v4/crew/${id}`);
      if (!response.ok) {
          throw new Error(`Error fetching crew member: ${response.statusText}`);
      }
      const memberDetails = await response.json();
      return {
         name: memberDetails.name,
         image: memberDetails.image,
         role: memberDetails.agency,
      };
    }));

    return crewDetails;
}

async function fetchLaunches() {
   const response = await fetch('https://api.spacexdata.com/v4/launches');
   if (!response.ok) {
       throw new Error(`Error fetching launches: ${response.statusText}`);
   }
   const launches = await response.json(); // Parse the JSON from the response
   return launches;
}

// Fetch launch details by ID
app.get('/launches/:id', async (req, res) => {
   const { id } = req.params; // Extract the ID from the request URL
   try {
       const response = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
       if (!response.ok) {
           throw new Error(`Error fetching launch: ${response.statusText}`);
       }
       const launchDetails = await response.json(); // Parse the JSON from the response

       // Optionally, augment the launch details with crew details if any crew members are associated with the launch
       if (launchDetails.crew && launchDetails.crew.length > 0) {
           launchDetails.crewDetails = await fetchCrewDetails(launchDetails.crew);
       } else {
           launchDetails.crewDetails = [];
       }

       res.json(launchDetails); // Respond with the launch details
   } catch (error) {
       console.error(`Error fetching launch with ID ${id}:`, error);
       res.status(500).send('Error fetching launch data');
   }
});

app.get('/', async (req, res) => {
   try {
       const response = await fetch('https://api.spacexdata.com/v4/launches');
       if (!response.ok) {
           throw new Error(`Error fetching launches: ${response.statusText}`);
       }
       const launches = await fetchLaunches(); 

       // Augment launches with crew details
       for (const launch of launches) {
           if (launch.crew && launch.crew.length > 0) {
               launch.crewDetails = await fetchCrewDetails(launch.crew);
           } else {
               launch.crewDetails = [];
           }
       }
       res.render('index', { launches });
   } catch (error) {
       console.error('Error fetching SpaceX launches:', error);
       res.status(500).send('Error fetching launch data');
   }
});

// Start the server only if we are not testing
if (process.env.NODE_ENV !== 'test') {
   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });
}


module.exports = { app, fetchCrewDetails, fetchLaunches};

