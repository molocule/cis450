import React from 'react';
export default class CharRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.char} </div>
				<div className="artists"> {this.props.playlist_appearances}</div>
			</div>
		);
	};
};
