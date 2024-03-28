const express = require('express');
const app = express();
const port = 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Define a route that renders an EJS template
app.get('/', async (req, res) => {
   try {
     // Fetch data from the API
     const response = await fetch('https://jsonplaceholder.typicode.com/posts');
     const posts = await response.json(); // Parse the JSON from the response
 
     // Render the index.ejs template and pass the posts data to it
     res.render('index', { posts: posts });
   } catch (error) {
     console.error('Error fetching data:', error);
     res.status(500).send('Error fetching data');
   }
 });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

