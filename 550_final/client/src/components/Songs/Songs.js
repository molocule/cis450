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



export default class Songs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      characterList: [],
      artists: [],
      song: "",
      text: options[0].value,
      submitted: "Characteristic",
      submitMajor: 1,
      user_input_d: 0.1,
      user_input_e: 0.1,
      user_input_l: 0.1,
      user_input_s: 0.1,
      user_input_v: 0.1,
      dataChar: [ 
        [ 'Characteristics', 'Measure'], 
        [ 'Acousticness', 0], 
        [ 'Danceability', 0], 
        [ 'Energy', 0], 
        [ 'Instrumentalness', 0], 
        [ 'Valence', 0],
        [ 'Popularity', 0],
        [ 'Tempo', 0],
        [ 'Liveness', 0],
        [ 'Loudness', 0],
        [ 'Speechiness', 0],
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getSong = this.getSong.bind(this);
    this.getHappy =this.getHappy.bind(this);

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

  handleOnChangeD = (value) => {
    this.setState({
      user_input_d: value
    })
  }

  handleOnChangeE = (value) => {
    this.setState({
      user_input_e: value
    })
  }

  handleOnChangeL = (value) => {
    this.setState({
      user_input_l: value
    })
  }

  handleOnChangeS = (value) => {
    this.setState({
      user_input_s: value
    })
  }

  handleOnChangeV = (value) => {
    this.setState({
      user_input_v: value
    })
    console.log(this.state.user_input_v)
  }


  getSong() {
		fetch("http://localhost:8081/song/" + this.state.song,
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
      [ 
        [ 'Characteristics', 'Measure'], 
        [ 'Acousticness', charObject.acousticness], 
        [ 'Danceability', charObject.danceability], 
        [ 'Energy', charObject.energy], 
        [ 'Instrumentalness', charObject.instrumentalness], 
        [ 'Valence', charObject.valence],
        [ 'Popularity', charObject.popularity],
        [ 'Tempo', charObject.tempo],
        [ 'Liveness', charObject.liveness],
        [ 'Loudness', charObject.loudness],
        [ 'Speechiness', charObject.speechiness],
      ]
		);

    const data = [
      ['City', '2010 Population'],
      ['New York City, NY', 8175000],
      ['Los Angeles, CA', 3792000],
      ['Chicago, IL', 2695000],
      ['Houston, TX', 2099000],
      ['Philadelphia, PA', 1526000],
    ]
    console.log(charRows.flat())
    console.log(data)
		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
			dataChar: charRows.flat()
		});
		}, err => {
		// Print the error if there is one.
		console.log(err);
		});
  }

  getHappy() {
      console.log("http://localhost:8081/happy/" + this.state.submitMajor + "/" + this.state.user_input_d +  "/" + this.state.user_input_e +  "/" + this.state.user_input_l +  "/" + this.state.user_input_s +  "/" + this.state.user_input_v)
      fetch("http://localhost:8081/happy/" + this.state.submitMajor + "/" + this.state.user_input_d +  "/" + this.state.user_input_e +  "/" + this.state.user_input_l +  "/" + this.state.user_input_s +  "/" + this.state.user_input_v,
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
          artists={charObject.artist.replace(/[\[\]']+/g,'')} 
          name={charObject.name} 
        /> 
      );

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        artists: charRows
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
            <form>
              <label>
                Song Name:
                <input type="text" value={this.state.artist} onChange={this.handleChange} />
              </label>
            </form>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getSong}> Submit </button>
              <div className="songs-header">
              </div>
              <div className="results-container" id="results">
                {this.state.characterList}
              </div>
            </div>
            <Chart
              width={800}
              height={300}
              chartType="ColumnChart"
              loader={<div>Loading Chart</div>}
              data={this.state.dataChar}
              options={{
                title: 'Song Characteristics',
                chartArea: { width: '70%' },
                hAxis: {
                  title: 'Characteristics',
                  minValue: 0,
                },
                vAxis: {
                  title: 'Measurements',
                },
              }}
              legendToggle
            />
          </div>
        </div>
        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="songs-container">
              <div style={{flex: 1, flexDirection: "row"}}>
                <Select
                    options={options}
                    onChange={this.onChange}
                    value={this.state.text}
                />
                <h3> D </h3>
                <Slider
                  value={this.state.user_input_d}
                  orientation="horizontal"
                  onChange={this.handleOnChangeD}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h3> E </h3>
                <Slider
                  value={this.state.user_input_e}
                  orientation="horizontal"
                  onChange={this.handleOnChangeE}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h3> L </h3>
                <Slider
                  value={this.state.user_input_l}
                  orientation="horizontal"
                  onChange={this.handleOnChangeL}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h3> S </h3>
                <Slider
                  value={this.state.user_input_s}
                  orientation="horizontal"
                  onChange={this.handleOnChangeS}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h3> V </h3>
                <Slider
                  value={this.state.user_input_v}
                  orientation="horizontal"
                  onChange={this.handleOnChangeV}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
            </div>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getHappy}> Get Songs!</button>
            <div className="songs-header">
                <div className="header-lg"><strong>Artist Name</strong></div>
                <div className="header"><strong>Song Name</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.artists}
              </div>
          </div>
          </div>
        </div>
      </div>
    );
  };
};


