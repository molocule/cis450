import React from 'react';
export default class PopPlaylistRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.perc_rank} </div>
				<div className="artists"> {this.props.num_followers}</div>
			</div>
		);
	};
};
