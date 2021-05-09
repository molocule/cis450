import React, {useState} from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import CharRow from './CharRow';
import Chart from "react-google-charts";

import Select from "react-select";

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

const options = [
  { value: 'Major', label: 'Major' },
  { value: 'Minor', label: 'Minor' },
]

var options2 = {
  chart: {
    type: 'line'
  },
  series: [{
    name: 'sales',
    data: [30,40,35,50,49,60,70,91,125]
  }],
  xaxis: {
    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
  }
}



export default class Recommendation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      characterList: [],
      artists: [],
      song: "",
      text: options[0].value,
      submitted: "Characteristic",
      submitMajor: 1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getSong =this.getSong.bind(this);

  };

  handleChange(event) {
    console.log(this.state.song)
    this.setState({song: event.target.value});
  }

  onChange = selectedOption => {
    this.setState({ text: selectedOption});
    if(selectedOption.value == "Major") {
      this.setState({submitMajor: 1});
    } else {
      this.setState({submitMajor: 0});
    }
    console.log(`Option selected:`, selectedOption.value);
  };



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
		}).then(charList => {
		if (!charList) return;
    console.log(charList)
		const CharRows = charList.map((songObject, i) =>
    <CharRow
      artists={songObject.artist.replace(/[\[\]']+/g,'')} 
      name={songObject.name} 
      num={songObject.num}
    />
    );

		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
			dataChar: CharRows
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
        <div className="table-title"><strong>Enter a song name to view all characteristics of a specific song!</strong></div>
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
                {this.state.dataChar}
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  };
};


