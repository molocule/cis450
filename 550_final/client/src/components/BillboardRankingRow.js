import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class BillboardRankingRow extends React.Component {

	/* ---- Q1b (Dashboard) ---- */
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.name} </div>
				<div className="artists"> {this.props.artists}</div>
				<div className="year"> {this.props.year} </div>
			</div>
		);
	};
};
