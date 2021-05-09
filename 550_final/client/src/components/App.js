import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Artists from './Artists/Artists';
import Billboard from './Billboard/Billboard';
import Home from './Home/Home'
import Songs from './Songs/Songs'
import Playlists from './Playlists/Playlists'
import Characteristics from './Characteristics/Characteristics'
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
						<Route
							exact
							path="/Explore Songs"
							render={() => <Songs/>}
						/>
						<Route
							exact
							path="/Uncover New Playlists"
							render={() => <Playlists/>}
						/>
						<Route
							exact
							path="/Popular Characteristics"
							render={() => <Characteristics/>}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};