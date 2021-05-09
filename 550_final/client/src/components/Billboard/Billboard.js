import React from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import FreqSongsRow from './FreqSongsRow';

export default class Billboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      freqSongs: [],
      popPlaylists: []
    };
  };

  componentDidMount() {
        // Send an HTTP request to the server.
		fetch("http://localhost:8081/freq-songs",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(songList => {
      console.log(songList)
		  if (!songList) return;
      const FreqSongsRows = songList.map((songObject, i) =>
      <FreqSongsRow
        playlist_appearances={songObject.playlist_appearances} 
        name={songObject.name} 
      />
		);
    this.setState({
        freqSongs: FreqSongsRows
    });
		}, err => {
		  console.log(err);
		});

    // Send an HTTP request to the server.
		fetch("http://localhost:8081/most-followers",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(playlistList => {
      console.log(playlistList)
		  if (!playlistList) return;
      const PopSongsRows = playlistList.map((songObject, i) =>
        <FreqSongsRow
          name={songObject.n} 
        /> 
      
		);

    this.setState({
        popPlaylists: PopSongsRows
    });

		}, err => {
		  console.log(err);
		});
  }

  
  render() {    
    return (
      <div className="Billboard">
        <PageNavbar active="dashboard" />
        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="songs-container">
              <div className="songs-header">
                <div className="header-lg"><strong>Song Name</strong></div>
                <div className="header"><strong>Number of Playlist Appearances</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.freqSongs}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};



  /*
	submitCategory() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/getall",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(songList => {
		  if (!songList) return;
      const BillboardRankingRows = songList.map((songObject, i) =>
			<BillboardRankingRow
        year={songObject.year} 
        artists={songObject.artist.replace(/[\[\]']+/g,'')} 
        name={songObject.name}
			/> 
      
		);

    this.setState({
      songs: BillboardRankingRows
    });

		}, err => {
		  console.log(err);
		});
	};
  */
