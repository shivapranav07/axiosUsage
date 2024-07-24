const express = require('express'); // Import the express library
const axios = require('axios'); // Import the axios library for making HTTP requests
const app = express(); // Create an instance of an Express application

// Define a GET endpoint at '/numbers'
app.get('/numbers', async (req, res) => {
    // Get the 'url' query parameter(s)
    let urls = req.query.url;

    // If no URLs are provided, return a 400 Bad Request error
    if (!urls) {
        return res.status(400).json({ error: 'No URLs provided' });
    }

    // Ensure 'urls' is an array
    if (!Array.isArray(urls)) {
        urls = [urls];
    }

    const numberSets = [];

    try {
        // Use a for loop to fetch numbers from each URL
        for (const url of urls) {
            try {
                // Make a GET request to the URL with a timeout
                const response = await axios.get(url);
                // Add the 'numbers' array from the response to the list
                numberSets.push(response.data.numbers);
            } catch (error) {
                // Log the error and continue with the next URL if there's an error
                console.error(`Error fetching data from ${url}:`, error.message);
            }
        }

        // Merge all the number arrays into one, remove duplicates, and sort
        const mergedNumbers = Array.from(new Set(numberSets.flat())).sort((a, b) => a - b);

        // Return the merged, sorted numbers as JSON
        res.json({ numbers: mergedNumbers });
    } catch (error) {
        // Log any errors and return a 500 Internal Server Error
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server and listen on the specified port
 app.listen(3000);