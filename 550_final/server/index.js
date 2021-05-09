const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/grammy-artists', routes.getHighestGrammyArtists);

app.get('/freq-songs', routes.getFrequentSongsInPlaylist);

app.get('/most-followers', routes.getSongsPlaylistsMostFollowers);

app.get('/keywords', routes.getSongCharacterstics);

app.get('/artist/:singer', routes.getArtistCharacteristics);

app.get('/keywords', routes.getPlaylistCharacteristic);

app.get('/keywords', routes.getFrequentRelatedSongs);

app.get('/playlist/:PID', routes.getPIDSongs);

app.get('/characteristics/:characteristic', routes.getCharacteristics);

app.get('/getall', routes.getAll);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});