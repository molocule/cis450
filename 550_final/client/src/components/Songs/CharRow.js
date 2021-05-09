import React from 'react';
export default class FreqSongsRow extends React.Component {

	render() {
		return (
			<div>
				<div className="name"> {this.props.artists}</div>
				<div className="year"> {this.props.name}</div>
			</div>
		);
	};
};
