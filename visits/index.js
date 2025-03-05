const express = require('express');
const { createClient } = require('redis');

const app = express();

// Create Redis client
const client = createClient({
  url: 'redis://redis-server:6379'
});

// Handle Redis errors
client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
  await client.connect();
  console.log('Connected to Redis');
  await client.set('visits', 0);
})();

app.get('/', async (req, res) => {
  try {
    let visits = await client.get('visits');
    visits = parseInt(visits) || 0;
    
    res.send('Number of visits: ' + visits);

    await client.set('visits', visits + 1);
  } catch (err) {
    console.error('Error fetching visits:', err);
    res.status(500).send('Server error');
  }
});

app.listen(8081, () => {
  console.log('Listening on port 8081');
});
