import React from 'react';
import '../style/Billboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import BillboardRankingRow from './BillboardRankingRow';

export default class Billboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      songs: []
    };
		this.submitCategory = this.submitCategory.bind(this);
  };

  // React function that is called when the page load.
  componentDidMount() {

  };


  /* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
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
		  // Map each keyword in this.state.keywords to an HTML element:
		  // A button which triggers the showMovies function for each keyword.
      const BillboardRankingRows = songList.map((songObject, i) =>
			<BillboardRankingRow
        year={songObject.year} 
        artists={songObject.artist.replace(/[\[\]']+/g,'')} 
        name={songObject.name}
			/> 
      
		);
	
    // Set the state of the keywords list to the value returned by the HTTP response from the server.
    this.setState({
      songs: BillboardRankingRows
    });

		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	};

  render() {    
    return (
      <div className="Billboard">

        <PageNavbar active="dashboard" />

        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Categories</div>
            <button id="submitMovieBtn" className="submit-btn" onClick={this.submitCategory}>Submit</button>
            <div className="keywords-container">
              {this.state.keywords}
            </div>
          </div>

          <br />
          <div className="jumbotron">
            <div className="songs-container">
              <div className="songs-header">
                <div className="header-lg"><strong>Name</strong></div>
                <div className="header"><strong>Artists</strong></div>
                <div className="header"><strong>Year</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.songs}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
