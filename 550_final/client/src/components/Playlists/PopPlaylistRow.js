import React from 'react';
export default class PopPlaylistRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.name} </div>
				<div className="artists"> {this.props.playlist_appearances}</div>
			</div>
		);
	};
};
