import React, {useState} from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import CharRow from './CharRow';

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
      artist: "",
      text: options[0].value,
      submitted: "Characteristic"
    };
    this.handleChange = this.handleChange.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.getCharacteristics =this.getCharacteristics.bind(this);

  };

  handleChange(event) {
    console.log(this.state.artist)
    this.setState({artist: event.target.value});
  }

  onChange = selectedOption => {
    this.setState({ text: selectedOption.value });
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
		const charRows = charList.map((charObject, i) =>
			<CharRow
        name={charObject.name} 
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
  }

  getCharacteristics() {
      console.log("hello")
      fetch("http://localhost:8081/characteristics/" + this.state.text,
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

      this.setState({ submitted: this.state.text})
    }

  
  render() {    
    return (
      <div className="Billboard">
        <PageNavbar active="dashboard" />
        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="songs-container">
              <button id="submitMovieBtn" className="submit-btn" onClick={this.getArtists}> Submit</button>
            <form>
              <label>
                Name:
                <input type="text" value={this.state.artist} onChange={this.handleChange} />
              </label>
            </form>
              <div className="songs-header">
                <div className="header-lg"><strong>Artist Name</strong></div>
                <div className="header-lg"><strong>{this.state.submitted}</strong></div>
                <div className="header"><strong>Spotify Rank</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.characterList}
              </div>
              <Select
                options={options}
                onChange={this.onChange}
                value={this.state.text}
            />
            {this.state.submitted}
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getCharacteristics}> Get Characteristics</button>
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

    // getGrammys() {
  //   // Send an HTTP request to the server.
	// 	fetch("http://localhost:8081/grammy-artists",
	// 	{
	// 	  method: 'GET' // The type of HTTP request.
	// 	}).then(res => {
	// 	  // Convert the response data to a JSON.
	// 	  return res.json();
	// 	}, err => {
	// 	  // Print the error if there is one.
	// 	  console.log(err);
	// 	}).then(songList => {
  //     console.log(songList)
	// 	  if (!songList) return;
  //     const GrammyRows = songList.map((songObject, i) =>
	// 		<GrammyRow
  //       numGrammys={songObject.num_grammys} 
  //       artists={songObject.artist.replace(/[\[\]']+/g,'')} 
	// 		/> 
      
	// 	);

  //   this.setState({
  //     grammyArtists: GrammyRows
  //   });

	// 	}, err => {
	// 	  console.log(err);
	// 	});
  // };