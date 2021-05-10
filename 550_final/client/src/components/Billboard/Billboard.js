import React from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import SongsRow from './SongsRow';

export default class Billboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      freqSongs: [],
      popPlaylists: []
    };
  };

  componentDidMount() {

    /* Simple Query: 2. Display spotify songs ranked by how many playlists they belong to
    /
    /
    */  
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
		  if (!songList) return;
      const PlaylistRows = songList.map((songObject, i) =>
      <SongsRow
        playlist_appearances={songObject.playlist_appearances} 
        name={songObject.name} 
      />
		);
    this.setState({
        popPlaylists: PlaylistRows
    });
		}, err => {
		  console.log(err);
		});


    /* Simple Query: 3. Display songs in playlist ranked by most followers
    /
    /
    */  
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
		}).then(songList => {
		  if (!songList) return;
      const PopSongsRows = songList.map((songObject, i) =>
        <SongsRow
          name={songObject.name} 
          playlist_appearances={songObject.n} 
        /> 
      
		);

    this.setState({
        freqSongs: PopSongsRows
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
        <div className="table-title"><strong>See spotify songs ranked by how many playlists they belong to!</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
              <div className="songs-header">
                <div className="header-lg"><strong>Song Name</strong></div>
                <div className="header"><strong>Number of Playlist Appearances</strong></div>
              </div>
              <div className="results-container" id="results">
              {this.state.popPlaylists}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>See spotify songs ranked by the number of followers the playlists that they belong to have!</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
              <div className="songs-header">
                <div className="header-lg"><strong>Song Name</strong></div>
                <div className="header"><strong>Number of Followers</strong></div>
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
