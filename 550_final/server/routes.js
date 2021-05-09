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
    WHERE S.name LIKE '%${keyword}'
    LIMIT 1;
  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};



const getArtistCharacteristics= (req, res) => {
  var keyword = req.params.singer;
  const query = `
WITH countall as (
  SELECT COUNT(*) as c FROM Characteristics 
), 
percentile_rank_char as (
  SELECT
      SID,
      ROUND(
         PERCENT_RANK() OVER (
            ORDER BY acousticness
         )
      ,2) * 100 as acousticness_percentile, 
      ROUND(
         PERCENT_RANK() OVER (
            ORDER BY danceability
         )
      ,2) * 100 danceability_percentile
      FROM Characteristics
), 
artChar as (
  SELECT * 
  FROM Song S NATURAL JOIN percentile_rank_char C 
  WHERE S.artist LIKE  "['${keyword}']" 
)
SELECT artChar.* from artChar JOIN Spotify_Ranking
ON artChar.SID = Spotify_Ranking.SID
GROUP BY SID
ORDER BY SUM(Spotify_Ranking.week) / AVG(Spotify_Ranking.rank) DESC
  `
  console.log(query)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getPlaylistCharacteristic= (req, res) => {
  var keyword = req.params.characteristic;
  const query = `
  WITH playChar as (
    SELECT Playlist.PID, Characteristics.*
    FROM Playlist JOIN Characteristics
    ON Playlist.SID = Characteristics.SID
  ), 
  playAgg as (
    SELECT PID, ROUND(
             PERCENT_RANK() OVER (
                ORDER BY ${keyword}
             )
          ,2) * 100 percentile_rank
    FROM playChar
    GROUP BY PID 
  )
  SELECT playAgg.*, Playlists.num_followers 
  FROM playAgg JOIN Playlists
  ON playAgg.PID = Playlists.PID
  ORDER BY Playlists.num_followers DESC
  LIMIT 10
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
  LIMIT 10;
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


  const getDefiningChar = (req, res) => {
    const query = `
    WITH playlistCharacteristics as (
      SELECT *
      FROM Playlist NATURAL JOIN Characteristics
  ),
  averageChars as (
      SELECT PID, AVG(acousticness), AVG(danceability), AVG(energy), AVG(instrumentalness), AVG(valence), AVG(tempo), AVG(liveness), AVG(loudness), AVG(speechiness)
      FROM playlistCharacteristics
      GROUP BY PID
  ),
  joinedTable as (
    SELECT *
      FROM playlistCharacteristics NATURAL JOIN averageChars 
  ),
  checkSimilar as (
    SELECT PID, (acousticness > 'AVG(acousticness)' - 0.1 AND acousticness < 'AVG(acousticness)' + 0.1) as b_a,
          (danceability > 'AVG(danceability)' - 0.1 AND danceability < 'AVG(danceability)' + 0.1) as b_d,
                  (energy > 'AVG(energy)' - 0.1 AND energy < 'AVG(energy)' + 0.1) as b_e,
                  (instrumentalness > 'AVG(instrumentalness)' - 0.1 AND instrumentalness < 'AVG(instrumentalness)' + 0.1) as b_i,
                  (valence > 'AVG(valence)' - 0.1 AND valence < 'AVG(valence)' + 0.1) as b_v,
                  (tempo > 'AVG(tempo)' - 10 AND tempo < 'AVG(tempo)' + 10) as b_t,
                  (liveness > 'AVG(liveness)' - 0.1 AND liveness < 'AVG(liveness)' + 0.1) as b_li,
                  (loudness > 'AVG(loudness)' - 5 AND loudness < 'AVG(loudness)' + 5) as b_lo,
                  (speechiness > 'AVG(speechiness)' - 0.1 AND speechiness < 'AVG(speechiness)' + 0.1) as b_s
    FROM joinedTable
  ),
  similarAggreg as (
    SELECT PID, SUM(b_a) as n_a, SUM(b_d) as n_d, SUM(b_e) as n_e,  SUM(b_i) as n_i,  SUM(b_v) as n_v,  SUM(b_t) as n_t,  SUM(b_li) as n_li,  SUM(b_lo) as n_lo,  SUM(b_s) as n_s 
    FROM checkSimilar
    GROUP BY PID
  ), 
  dc as (
      SELECT PID,
      CASE
          WHEN n_a > n_d AND n_a > n_e AND n_a > n_i AND n_a > n_v AND n_a > n_t AND n_a > n_li AND n_a > n_lo AND n_a > n_s
              THEN 'acousticness'
          WHEN n_d > n_e AND n_d > n_i AND n_d > n_v AND n_d > n_t AND n_d > n_li AND n_d > n_lo AND n_d > n_s
              THEN 'danceability'
          WHEN n_e > n_i AND n_e > n_v AND n_e > n_t AND n_e > n_li AND n_e > n_lo AND n_e > n_s
              THEN 'energy'
          WHEN n_i > n_v AND n_i > n_t AND n_i > n_li AND n_i > n_lo AND n_i > n_s
              THEN 'instrumentalness'
          WHEN n_v > n_t AND n_v > n_li AND n_v > n_lo AND n_v > n_s
              THEN 'valence'
          WHEN n_t > n_li AND n_t > n_lo AND n_t > n_s
              THEN 'tempo'
          WHEN n_li > n_lo AND n_li > n_s
              THEN 'liveness'
          WHEN n_lo > n_s
              THEN 'loudness'
          ELSE 'speechiness' 
      END as defining_char
      FROM similarAggreg
  )
  SELECT defining_char, count(*) as c
  FROM dc 
  GROUP BY defining_char
  ORDER BY c DESC
  
    `
  
    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.json(rows);
    });
  };
  

  

  const getHappy = (req, res) => {
    var type = req.params.type;
    var d = req.params.d;
    var e = req.params.e;
    var l = req.params.l;
    var s = req.params.s;
    var v = req.params.v;
    const query = `
      WITH songMood as (
        SELECT SID, ((valence*${v} + danceability*${d} + energy*${e} + liveness*${l} + speechiness * ${s}) / (${d} + ${e} + ${l} + ${s})) as mood
        FROM Characteristics
        WHERE mode = ${type}
      ), 
      genrePlaylist as ( 
        SELECT Playlist.PID, A.SID, A.mood
        FROM Playlist NATURAL JOIN (SELECT * FROM songMood 
      WHERE songMood.mood > 0.5) A
      ), 
      songsofMood as (
      SELECT SID, COUNT(PID) as c, mood 
      FROM genrePlaylist 
      GROUP BY SID
      ),
      withSongName as (
      SELECT Song.name, Song.artist 
      FROM Song JOIN songsofMood 
      ON Song.SID = songsofMood.SID
      ORDER BY songsofMood.mood DESC
      )
      SELECT * FROM withSongName
      LIMIT 10;
    `
  
    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.json(rows);
    });
  };
  


  const getRecs = (req, res) => {
    var song = req.params.song;
    console.log(song)
    const query = `
    WITH targetSID as (
      SELECT SID
        FROM Song 
        WHERE name LIKE  '%${song}%'
        LIMIT 1
    ), 
    playlistOfSong as (
      SELECT Playlist.PID, Playlist.SID
      FROM Playlist 
      WHERE Playlist.PID IN (
          SELECT PID FROM Playlist WHERE SID = (SELECT * FROM targetSID)
        ) 
      AND SID != (SELECT * FROM targetSID)
    ),
    targetCount as (
        SELECT *
        FROM Characteristics
        WHERE SID = (SELECT * FROM targetSID)
    ),
    songCounts as (
      SELECT SID, COUNT(*) as num
      FROM playlistOfSong
      GROUP BY SID
    ),
    songChar as (
        SELECT Song.SID, Song.name, Song.artist, songCounts.num, acousticness, danceability, energy, instrumentalness, valence, tempo, liveness, loudness, speechiness
        FROM songCounts NATURAL JOIN Song NATURAL JOIN Characteristics
        ORDER BY songCounts.num DESC
    ),
    attribDiff as (
        SELECT S.SID, S.name, S.artist, S.num, ABS(ABS(S.acousticness - T.acousticness) + ABS(S.danceability - T.danceability) + 
                    ABS(S.energy - T.energy) + ABS(S.instrumentalness - T.instrumentalness) + 
                        ABS(S.valence - T.valence) + ABS(S.tempo - T.tempo) + ABS(S.liveness - T.liveness) + 
                            ABS(S.loudness - T.loudness) + ABS(S.speechiness - T.speechiness)) / S.num as diff
        FROM songChar S, targetCount T
    )
    SELECT name, artist, num
    FROM attribDiff
    ORDER BY diff ASC    
    LIMIT 10;
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
  getDefiningChar: getDefiningChar,
  getHappy: getHappy,
  getRecs: getRecs,
};