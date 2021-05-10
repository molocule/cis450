import React from 'react';
export default class SongOnlyRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.songName}</div>
			</div>
		);
	};
};
