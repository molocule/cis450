// import React from 'react';
// import '../../style/Billboard.css';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useParams
// } from "react-router-dom";
// import { withRouter } from "react-router";
// import PageNavbar from '../PageNavbar';
// import BillboardRankingRow from './BillboardRankingRow';
// import FreqSongsRow from './FreqSongsRow';
// import GrammyRow from './GrammyRow';

// function Topic() {
//     let { PID } = useParams();
//     return <h3> Now, showing the playlist { PID }. </h3>;
// }



  
// export default class PlayList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//         freqSongs: [],
//     };

//   };

  

//   componentDidMount() {
//     const id = this.props.match.params.PID;
//   };
  
  



//   render() {    
//     return (
//       <div className="Billboard">
//         <PageNavbar active="dashboard" />
//         <br />
//         <Topic />
//         <button id="submitMovieBtn" className="submit-btn" onClick={this.submitCategory}>Submit</button>
//         {this.state.freqSongs}

//       </div>
//     );
//   };
// };
