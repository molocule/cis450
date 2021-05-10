import React from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import SongRow from './SongRow';
import 'react-rangeslider/lib/index.css'

export default class Recommendation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songList: [],
      song: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.getSong =this.getSong.bind(this);

  };

  handleChange(event) {
    console.log(this.state.song)
    this.setState({song: event.target.value});
  }

    /* Complex Query:   4. Get similar songs
    /
    /
    */  
  getSong() {
		fetch("http://localhost:8081/song-rec/" + this.state.song,
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
    console.log(songList)
		var SongRows = songList.map((songObject, i) =>
    <SongRow
      artists={songObject.artist.replace(/[\[\]']+/g,'')} 
      name={songObject.name} 
    />
    );
    if(SongRows.length == 0) {
      SongRows = <p> No Results Found</p>
    }

		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
			songList: SongRows
		});
		}, err => {
		// Print the error if there is one.
		console.log(err);
		});
  }

  render() {    
    return (
      <div className="Billboard">
        <PageNavbar active="dashboard" />
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>Enter a song name to get similar songs!</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
            <form>
              <label>
                Song Name:
                <input type="text" value={this.state.artist} onChange={this.handleChange} />
              </label>
            </form>
            <br></br>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getSong}> Submit </button>
            <br></br>
              <div className="songs-header">
                <div className="header-lg"><strong>Artist </strong></div>
                <div className="header"><strong>Song Name</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.songList}
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  };
};


