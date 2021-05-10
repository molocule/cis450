const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//1
app.get('/grammy-artists', routes.getHighestGrammyArtists);
//2
app.get('/freq-songs', routes.getFrequentSongsInPlaylist);
//3
app.get('/most-followers', routes.getSongsPlaylistsMostFollowers);
//4
app.get('/song/:song', routes.getSongCharacterstics);

app.get('/artist/:singer', routes.getArtistCharacteristics);

app.get('/playlist-rank/:characteristic', routes.getPlaylistCharacteristic);

app.get('/keywords', routes.getFrequentRelatedSongs);

app.get('/playlist/:PID', routes.getPIDSongs);

app.get('/characteristics/:characteristic', routes.getCharacteristics);

app.get('/defining-char', routes.getDefiningChar);

app.get('/happy/:type/:d/:e/:l/:s/:v', routes.getHappy);

app.get('/song-rec/:song', routes.getRecs);

app.get('/acoustic/:acoustic', routes.getHigherAcoustic);

app.get('/getall', routes.getAll);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});