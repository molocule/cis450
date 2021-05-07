import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Billboard from './Billboard';
import Recommendations from './Recommendations';
import BestMovies from './BestMovies';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Billboard />}
						/>
						<Route
							exact
							path="/billboard"
							render={() => <Billboard />}
						/>
						<Route
							path="/recommendations"
							render={() => <Recommendations />}
						/>
						<Route
							path="/bestmovies"
							render={() => <BestMovies />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};