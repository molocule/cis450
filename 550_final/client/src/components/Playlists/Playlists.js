import React from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import PopPlaylistRow from './PopPlaylistRow';
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

export default class Playlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popPlaylists: [],
      submittedCharacteristic: "Energy",
      text: options[0].value,
    };
    this.onChange = this.onChange.bind(this);
    this.getCharacteristics = this.getCharacteristics.bind(this);
  };

  getCharacteristics() {
    console.log("http://localhost:8081/playlist-rank/" + this.state.submittedCharacteristic)
    fetch("http://localhost:8081/playlist-rank/" + this.state.submittedCharacteristic,
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
    //(PID, percentile_rank, num_followers)
    const PopPlayRows = charList.map((songObject, i) =>
    <PopPlaylistRow
      playlist_appearances={songObject.num_followers} 
      name={songObject.percentile_rank} 
    />
    );

    // Set the state of the keywords list to the value returned by the HTTP response from the server.
    this.setState({
      popPlaylists: PopPlayRows
    });
    }, err => {
    // Print the error if there is one.
    console.log(err);
    });

  }

  onChange = selectedOption => {
    this.setState({ text: selectedOption, submittedCharacteristic: selectedOption.value});
    console.log(`Option selected:`, selectedOption.value);
    console.log(`Option selected:`, this.state.submittedCharacteristic);
  };


  
  render() {    
    return (
      <div className="Billboard">
        <PageNavbar active="dashboard" />
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>Find the percentile of a characteristic of your choice for all playlists!</strong></div>
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
              <div className="songs-header">
                <div className="header-lg"><strong>Percentile Rank</strong></div>
                <div className="header"><strong>Number of Followers</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.popPlaylists}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};


