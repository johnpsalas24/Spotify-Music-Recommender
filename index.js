const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

// Spotify API credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

// Create a Spotify API instance
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
    })
    .catch(error => {
        console.log('Error retrieving access token:', error);
    });

// Endpoint for playlist recommendations
app.get('/recommend/:genre', (req, res) => {
    const genre = req.params.genre.toLowerCase();
    
    // Define a list of supported genres
    const supportedGenres = ['latino', 'hip-hop', 'rap', 'spanish', 'reggae', 'reggaeton', 'classic', 'pop'];

    // Check if the requested genre is supported
    if (supportedGenres.includes(genre)) {
        // Get playlists based on the provided genre
        spotifyApi.getPlaylistsForCategory(genre, { limit: 5 })
            .then(data => {
                const playlists = data.body.playlists.items;
                res.json(playlists);
            })
            .catch(error => {
                console.log('Error getting playlists:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        res.status(400).json({ error: 'Invalid genre. Supported genres: latino, hip-hop, rap, spanish, reggae, reggaeton, classic, pop' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
