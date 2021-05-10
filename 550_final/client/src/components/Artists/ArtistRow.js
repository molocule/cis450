import React from 'react';
export default class ArtistRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.artist}</div>
				<div className="artists"> {this.props.characteristic}</div>
				<div className="year"> {this.props.rank}</div>
			</div>
		);
	};
};
