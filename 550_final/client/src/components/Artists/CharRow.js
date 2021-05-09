import React from 'react';
export default class FreqSongsRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.name}</div>
				<div className="artists"> {this.props.level}</div>
				<div className="year"> {this.props.rank}</div>
			</div>
		);
	};
};
