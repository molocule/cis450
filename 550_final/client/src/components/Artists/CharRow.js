import React from 'react';
export default class CharRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.name}</div>
				<div className="artists"> {this.props.acousticness}</div>
				<div className="year"> {this.props.danceability}</div>
			</div>
		);
	};
};
