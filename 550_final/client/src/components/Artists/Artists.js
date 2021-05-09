import React, {useState} from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import CharRow from './CharRow';
import GrammyRow from './GrammyRow';
import Select from "react-select";

const options = [
  { value: 'acousticness', label: 'acousticness' },
  { value: 'danceability', label: 'danceability' },
  { value: 'energy', label: 'energy' },
  { value: 'instrumentalness', label: 'instrumentalness' },
  { value: 'valence', label: 'valence' },
  { value: 'tempo', label: 'tempo' },
  { value: 'liveness', label: 'liveness' },
  { value: 'loudness', label: 'loudness' },
  { value: 'speechiness', label: 'speechiness' }
]


export default class Artists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      characterList: [],
      grammyArtists: [],
      artistSongs: [],
      artist: "",
      text: options[0].value,
      submitted: "Characteristic",
      submittedCharacteristic: "Energy",
    };
    this.handleChange = this.handleChange.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.getCharacteristics =this.getCharacteristics.bind(this);

  };

  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/grammy-artists",
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
      const GrammyRows = songList.map((songObject, i) =>
      <GrammyRow
        numGrammys={songObject.num_grammys} 
        artists={songObject.artist.replace(/[\[\]']+/g,'')} 
      /> 
      
    );

    this.setState({
      grammyArtists: GrammyRows
    });

    }, err => {
      console.log(err);
    });
  }

  handleChange(event) {
    console.log(this.state.artist)
    this.setState({artist: event.target.value});
  }

  onChange = selectedOption => {
    this.setState({ text: selectedOption, submittedCharacteristic: selectedOption.value});
    console.log(`Option selected:`, selectedOption.value);
  };


  getArtists() {
		fetch("http://localhost:8081/artist/" + this.state.artist,
		{
		method: 'GET' // The type of HTTP request.
		}).then(res => {
		// Convert the response data to a JSON.
		return res.json();
		}, err => {
		// Print the error if there is one.
		console.log(err);
		}).then(charList => {
		if (!charList) return;
    console.log(charList)
		var charRows = charList.map((charObject, i) =>
			<CharRow
        name={charObject.name}
        level={charObject.acousticness_percentile}
        rank={charObject.danceability_percentile}
			/> 
		);
    console.log(charRows)

    console.log(charRows.length);
    if(charRows.length == 0) {
      charRows = <p> No Results Found</p>
    }
		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
			artistSongs: charRows
		});
		}, err => {
		// Print the error if there is one.
		console.log(err);
		});
  }

  getCharacteristics() {
      console.log("hello")
      fetch("http://localhost:8081/characteristics/" + this.state.submittedCharacteristic,
      {
      method: 'GET' // The type of HTTP request.
      }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
      }, err => {
      // Print the error if there is one.
      console.log(err);
      }).then(charList => {
      if (!charList) return;
      console.log(charList)
      const charRows = charList.map((charObject, i) =>
        <CharRow
          name={charObject.artist.replace(/[\[\]']+/g,'')} 
          level={charObject.Characteristic_Value} 
          rank={charObject.Spotify_Rank} 
        /> 
      );


      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        characterList: charRows
      });
      }, err => {
      // Print the error if there is one.
      console.log(err);
      });

      this.setState({ submitted: this.state.submittedCharacteristic})
    }

  
  render() {    
    return (
      <div className="Billboard">
        <PageNavbar active="dashboard" />
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>See spotify artists ranked by the number of grammys they’ve won!</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
              <div className="songs-header">
                <div className="header-lg"><strong>Artist </strong></div>
                <div className="header"><strong>Number of Grammys</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.grammyArtists}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>Enter a characteristic value and then we will show you the artist with most diverse discography<br></br>for that characteristic ranked by their spotify ranking!</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
            <Select
              options={options}
              onChange={this.onChange}
              value={this.state.text}
            /> 
            <br></br>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getCharacteristics}> Get Characteristics</button>
            <br></br>
            <br></br>
              <div className="songs-header">
                <div className="header-lg"><strong>Artist Name</strong></div>
                <div className="header"><strong>{this.state.submitted}</strong></div>
                <div className="header"><strong>Spotify Rank</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.characterList}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>Enter an artist name to view which percentile of acousticness and danceability each song <br></br>belongs to, ordered by the spotify ranking of that song!</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
            <form>
              <label>
                Name: 
                <input type="text" value={this.state.artist} onChange={this.handleChange} />
              </label>
            </form>
            <br></br>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getArtists}> Submit</button>
            <br></br>
            <br></br>
              <div className="songs-header">
                <div className="header-lg"><strong>Song Name</strong></div>
                <div className="header"><strong>Acousticness</strong></div>
                <div className="header"><strong>Danceability</strong></div>
              </div>
              <div className="results-container" id="results">
              {this.state.artistSongs}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};



{/* <form>
<label>
  Name:
  <input type="text" value={this.state.artist} onChange={this.handleChange} />
</label>
</form>
<button id="submitMovieBtn" className="submit-btn" onClick={this.getArtists}> Submit</button>
{this.state.artistSongs}
<Select
  options={options}
  onChange={this.onChange}
  value={this.state.text}
/> */}