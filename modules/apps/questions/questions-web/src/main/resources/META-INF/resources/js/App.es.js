/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayNavigationBar from '@clayui/navigation-bar';
import ClayLink from '@clayui/link';
import React from 'react';
import {Link, Route, HashRouter as Router, Switch} from 'react-router-dom';

import {AppContextProvider} from './AppContext.es';
import Tags from './pages/tags/Tags.es';
import Questions from './pages/questions/Questions.es';

export default function (props) {
	return <AppContextProvider {...props}>

		<Router>
			<div>
				
				<ClayNavigationBar triggerLabel="Questions">
					<ClayNavigationBar.Item active>
						<ClayLink className="nav-link" displayType="unstyled">
							<Link to={"/"}>Questions</Link>
						</ClayLink>
					</ClayNavigationBar.Item>
					<ClayNavigationBar.Item>
						<ClayLink className="nav-link" displayType="unstyled">
							<Link to={"/tags"}>Tags</Link>
						</ClayLink>
					</ClayNavigationBar.Item>
				</ClayNavigationBar>

				<Switch>
					<Route
						component={Questions}
						exact
						path="/"
					/>

					<Route
						component={Tags}
						path="/tags"
					/>
				</Switch>
			</div>
		</Router>
	</AppContextProvider>;
}
