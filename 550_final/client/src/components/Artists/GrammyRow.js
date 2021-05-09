import React from 'react';
export default class GrammyRow extends React.Component {

	render() {
		return (
			<div className="song">
				<div className="name"> {this.props.artists}</div>
				<div className="year"> {this.props.numGrammys}</div>
			</div>
		);
	};
};
