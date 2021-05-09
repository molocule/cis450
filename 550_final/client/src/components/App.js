import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Artists from './Artists/Artists';
import Billboard from './Billboard/Billboard';
import Home from './Home/Home'
export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Home />}
						/>
						<Route
							exact
							path="/Popular Songs"
							render={() => <Billboard />}
						/>
						<Route
							exact
							path="/Discover Artists"
							render={() => <Artists/>}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};