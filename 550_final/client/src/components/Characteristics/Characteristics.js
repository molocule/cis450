import React from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import CharRow from './CharRow';

export default class Characteristics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charList: [],
    };
  };

  componentDidMount() {
        // Send an HTTP request to the server.
		fetch("http://localhost:8081/defining-char",
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
      const CharRows = charList.map((charObject, i) =>
      <CharRow
        char={charObject.defining_char}
        playlist_appearances={charObject.c} 
      />
		);
    this.setState({
        charList: CharRows
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
        <div className="table-title"><strong>We will show you which characteristic is the most defining characteristic of each playlist<br></br>and then display how many playlists have a characteristic as its defining characteristic.</strong></div>
          <div className="jumbotron">
            <div className="songs-container">
              <div className="songs-header">
                <div className="header-lg"><strong>Characteristic</strong></div>
                <div className="header"><strong>Number of Playlists</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.charList}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

