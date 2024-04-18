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

app.get('/', async (req, res) => {
   try {
       const response = await fetch('https://api.spacexdata.com/v4/launches');
       if (!response.ok) {
           throw new Error(`Error fetching launches: ${response.statusText}`);
       }
       const launches = await response.json(); // Parse the JSON from the response

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, fetchCrewDetails};

