const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

// Simple Queries
const getHighestGrammyArtists = (req, res) => {
  const query = `
  SELECT COUNT(S.artist) as num_grammys, S.artist
  FROM Grammy_Awards G JOIN Song S ON G.SID = S.SID
  GROUP BY S.artist
  ORDER BY num_grammys DESC
  LIMIT 10
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getFrequentSongsInPlaylist = (req, res) => {
  const query = `
  WITH unique_playlist_songs AS(
    SELECT DISTINCT PID, SID
    FROM Playlist
  ),
  song_count AS (
      SELECT COUNT(SID) as playlist_appearances, SID
      FROM unique_playlist_songs
      GROUP BY SID
      ORDER BY COUNT(SID) DESC
  )
  SELECT playlist_appearances, name
  FROM song_count JOIN Song ON song_count.SID = Song.SID   
  LIMIT 10
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
}


const getSongsPlaylistsMostFollowers= (req, res) => {
  const query = `
  WITH playlist_with_songs as (
    SELECT Playlist.PID, Playlist.SID, Song.name  
    FROM Playlist JOIN Song 
    ON Playlist.SID = Song.SID 
      ),
      Playlist_by_followers as (
        SELECT playlist_with_songs.PID, playlist_with_songs.name, Playlists.num_followers
        FROM playlist_with_songs JOIN Playlists
        ON playlist_with_songs.PID = Playlists.PID
      )
      SELECT name, SUM(num_followers) as n 
      FROM Playlist_by_followers
      GROUP BY name
      ORDER BY n DESC
      LIMIT 10;    
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getSongCharacterstics = (req, res) => {
  var keyword = req.params.song;
  const query = `
    SELECT * 
    FROM Song S JOIN Characteristics C ON S.SID = C.SID	
    WHERE S.name LIKE '${keyword}'
  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};



const getArtistCharacteristics= (req, res) => {
  var keyword = req.params.singer;
  const query = `
  SELECT * 
  FROM Song S JOIN Characteristics C ON S.SID = C.SID	
  WHERE S.artist = "['${keyword}']"  
  `
  console.log(query)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getPlaylistCharacteristic= (req, res) => {
  var keyword = req.params.accoustic;
  const query = `
  WITH playChar as (
    SELECT Playlist.PID, Characteristics.*
    FROM Playlist JOIN Characteristics
    ON Playlist.SID = Characteristics.SID
  ), 
  playAgg as (
    SELECT PID, AVG('${keyword}')
    FROM playChar
    GROUP BY PID 
  )
  SELECT * FROM playAgg;
  
  
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getFrequentRelatedSongs = (req, res) => {
  var keyword = req.params.song;
  const query = `
  WITH playlistOfSong as (
    SELECT Playlist.PID, Playlist.SID
    FROM Playlist 
    WHERE Playlist.PID IN (
        SELECT PID FROM Playlist WHERE SID = (
            SELECT SID FROM Song WHERE name = '${keyword}'
          )
      ) 
    AND SID != (
      SELECT SID FROM Song WHERE name = '${keyword}'
    )
  ), 
  songCounts as (
    SELECT SID, COUNT(*) as num
    FROM playlistOfSong
    GROUP BY SID
  )
  SELECT Song.name, Song.artist, songCounts.num
  FROM songCounts JOIN Song 
  ON songCounts.SID = Song.SID
  ORDER BY songCounts.num DESC;  
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};



const getAll = (req, res) => {
  const query = 'SELECT * FROM Song LIMIT 10'

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getPIDSongs= (req, res) => {
  var keyword = req.params.PID;
  console.log(keyword)
  const query = `
  SELECT Song.name
  FROM Playlist JOIN Song 
  ON Playlist.SID = Song.SID
  WHERE Playlist.PID = '${keyword}' 
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};



// Complex Queries
const getCharacteristics= (req, res) => {
  var keyword = req.params.characteristic;
  console.log(keyword)
  const query = `
  WITH accousticnessRange as (
    SELECT artist, MAX(acousticness) - MIN(acousticness) as r, 
    MAX(danceability) - MIN(danceability) as d, MAX(energy) - MIN(energy) as e, 
    MAX(instrumentalness) - MIN(instrumentalness) as i, 
    MAX(valence) - MIN(valence) as v, MAX(tempo) - MIN(tempo) as t, 
    MAX(liveness) - MIN(liveness) as li, 
    MAX(loudness) - MIN(loudness) as lo, 
    MAX(speechiness) - MIN(speechiness) as s
    FROM (SELECT SID, artist FROM Song) A NATURAL JOIN (SELECT SID, acousticness, danceability, energy, instrumentalness, valence, tempo, liveness, loudness, speechiness FROM Characteristics) B
    GROUP BY artist
  ),
  mostSong as (
      SELECT artist, 
      CASE
          WHEN '${keyword}' = 'acousticness' THEN MAX(r)
          WHEN '${keyword}' = 'energy' THEN MAX(e)
          WHEN '${keyword}' = 'danceability' THEN MAX(d)
          WHEN '${keyword}' = 'instrumentalness' THEN MAX(i)
          WHEN '${keyword}' = 'valence' THEN MAX(v)
          WHEN '${keyword}' = 'tempo' THEN MAX(t)
          WHEN '${keyword}' = 'liveness' THEN MAX(li)
          WHEN '${keyword}' = 'loudness' THEN MAX(lo)
          WHEN '${keyword}' = 'speechiness' THEN MAX(s)
          ELSE 0
      END as val
      FROM accousticnessRange
      GROUP BY artist
  ),
  allSong as (
    SELECT Song.artist, Song.SID, mostSong.val
    FROM mostSong JOIN Song 
    ON mostSong.artist = Song.artist
    ORDER BY mostSong.val DESC
  ),
  bestSong as (
    SELECT allSong.artist, MAX(allSong.val) as Characteristic_Value, COUNT(Spotify_Ranking.week) / AVG(Spotify_Ranking.rank) as Spotify_Rank
    FROM allSong JOIN Spotify_Ranking 
    ON allSong.SID = Spotify_Ranking.SID
    GROUP BY allSong.artist 
  )
  SELECT artist, Characteristic_Value, Spotify_Rank 
  FROM bestSong
  ORDER BY Characteristic_Value DESC, Spotify_Rank DESC
  
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};






// (num_grammys, artists)

module.exports = {
  getAll: getAll,
  getHighestGrammyArtists: getHighestGrammyArtists,
  getFrequentSongsInPlaylist: getFrequentSongsInPlaylist,
  getSongsPlaylistsMostFollowers: getSongsPlaylistsMostFollowers,
  getSongCharacterstics: getSongCharacterstics,
  getArtistCharacteristics: getArtistCharacteristics,
  getPlaylistCharacteristic: getPlaylistCharacteristic,
  getFrequentRelatedSongs: getFrequentRelatedSongs,
  getPIDSongs: getPIDSongs,
  getCharacteristics: getCharacteristics,
};