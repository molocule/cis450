import React, {useState} from 'react';
import '../../style/Billboard.css';
import PageNavbar from '../PageNavbar';
import SongRow from './SongRow';
import SongOnlyRow from './SongOnlyRow';
import Chart from "react-google-charts";
import Select from "react-select";
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

const options = [
  { value: 'Major', label: 'Major' },
  { value: 'Minor', label: 'Minor' },
]




export default class Songs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      characterList: [],
      songsList: [],
      acousticList: [],
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
        [ 'Valence', 0],
      ],
      acoustic: 0.1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getSong = this.getSong.bind(this);
    this.getHappy =this.getHappy.bind(this);
    this.getAcoustic =this.getAcoustic.bind(this);
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


  handleOnChangeAcoustic = (value) => {
    this.setState({
      acoustic: value
    })
  }

    /* Simple Query: 0. Display SIDs of songs that are similar to song name {song_name}
    /
    /
    */  

    /* Simple Query: ???
    /
    /
    */  
  getAcoustic() {
    fetch("http://localhost:8081/acoustic/" + this.state.acoustic,
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
    var songRows = songList.map((songObject, i) =>
      <SongOnlyRow
        songName={songObject.name} 
      /> 
    );

    if(songRows.length == 0) {
      songRows = <p> No Results Found</p>
    }

    // Set the state of the keywords list to the value returned by the HTTP response from the server.
    this.setState({
      acousticList: songRows
    });
    }, err => {
    // Print the error if there is one.
    console.log(err);
    });
  }
    /* Simple Query: 2. Display song characteristics of a selected song: {song_name}
    /
    /
    */  
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
		var charData = charList.map((charObject, i) =>
      [ 
        [ 'Characteristics', 'Measure'], 
        [ 'Acousticness', charObject.acousticness], 
        [ 'Danceability', charObject.danceability], 
        [ 'Energy', charObject.energy],
        [ 'Valence', charObject.valence]
      ]
		);

    if(charData.length == 0) {
      charData = <p> No Results Found</p>
    } else {
      charData = charData.flat()
    }

    const data = [
      ['City', '2010 Population'],
      ['New York City, NY', 8175000],
      ['Los Angeles, CA', 3792000],
      ['Chicago, IL', 2695000],
      ['Houston, TX', 2099000],
      ['Philadelphia, PA', 1526000],
    ]

		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
			dataChar: charData
		});
		}, err => {
		// Print the error if there is one.
		console.log(err);
		});
  }
    /* Complex Query: 2. get happiest songs from happiness heuristic
    /
    /
    */  
  getHappy() {
      fetch("http://localhost:8081/happy/" + this.state.submitMajor + "/" + this.state.user_input_d +  "/" + this.state.user_input_e +  "/" + this.state.user_input_l +  "/" + this.state.user_input_s +  "/" + this.state.user_input_v,
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
      var songRows = songList.map((songObject, i) =>
        <SongRow
          artists={songObject.artist.replace(/[\[\]']+/g,'')} 
          songName={songObject.name} 
        /> 
      );

      if(songRows.length == 0) {
        songRows = <p> No Results Found</p>
      }

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        songsList: songRows
      });
      }, err => {
      // Print the error if there is one.
      console.log(err);
      });

      this.setState({submitted: this.state.text})
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
              </div>
              <div className="results-container" id="results">
                {this.state.characterList}
              </div>
            </div>
            <Chart
              width={1000}
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
        <div className="table-title"><strong>It’s your turn to mix!<br></br>Drag the sliders around to create a certain mood and we’ll return to you the songs that have the highest score for the mood you create</strong></div>
          <div className="jumbotron">
          <div className="songs-container">

                <Select
                    options={options}
                    onChange={this.onChange}
                    value={this.state.text}
                />
                <br></br>
                <h5> Danceability </h5>
                <Slider
                  value={this.state.user_input_d}
                  orientation="horizontal"
                  onChange={this.handleOnChangeD}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h5> Energy </h5>
                <Slider
                  value={this.state.user_input_e}
                  orientation="horizontal"
                  onChange={this.handleOnChangeE}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h5> Liveness </h5>
                <Slider
                  value={this.state.user_input_l}
                  orientation="horizontal"
                  onChange={this.handleOnChangeL}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h5> Speechiness </h5>
                <Slider
                  value={this.state.user_input_s}
                  orientation="horizontal"
                  onChange={this.handleOnChangeS}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
                <h5> Valence </h5>
                <Slider
                  value={this.state.user_input_v}
                  orientation="horizontal"
                  onChange={this.handleOnChangeV}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
            <br></br>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getHappy}> Get Songs!</button>
            <br></br>
            <br></br>
              <div className="songs-header">
                <div className="header-lg"><strong>Artist Name</strong></div>
                <div className="header"><strong>Song Name</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.songsList}
              </div>
          </div>
          </div>
        </div>
        <br />
        <div className="container movies-container">
        <div className="table-title"><strong>Enter an acousticness value (higher is more acoustic) and see songs with that acoustic value ranked by the number of people who listen to that song in a playlist!<br></br></strong></div>
          <div className="jumbotron">
          <div className="songs-container">
                <br></br>
                <h5> Acousticness </h5>
                <Slider
                  value={this.state.acoustic}
                  orientation="horizontal"
                  onChange={this.handleOnChangeAcoustic}
                  min={0.1}
                  max={1}
                  step={0.02}
                />
            <br></br>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.getAcoustic}> Get Songs!</button>
            <br></br>
            <br></br>
              <div className="songs-header">
                <div className="header"><strong>Song Name</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.acousticList}
              </div>
          </div>
          </div>
        </div>
      </div>
    );
  };
};


