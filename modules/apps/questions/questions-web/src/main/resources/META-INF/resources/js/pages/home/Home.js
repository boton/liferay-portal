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

import ClayCard from '@clayui/card';
import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {AppContext} from '../../AppContext.es';
import {getSections} from '../../utils/client.es';
import lang from '../../utils/lang.es';

export default () => {
	const context = useContext(AppContext);

	const [sections, setSections] = useState([]);

	useEffect(() => {
		getSections(context.siteKey).then(sections =>
			setSections(sections.items || [])
		);
	}, [context.siteKey]);

	function descriptionTruncate(description) {
		return description.length > 150
			? description.substring(0, 150) + '...'
			: description;
	}

	return (
		<div className="row">
			{sections.map(section => (
				<div className="col-lg-4 col-md-6 col-xl-3" key={section.id}>
					<Link
						className="question-card text-decoration-none text-secondary"
						to={`/questions/${section.title}`}
					>
<<<<<<< HEAD
						<Link to={`/questions/${section.title}`}>
							<ClayCard className="questions-home-card">
								<ClayCard.Body>
									<ClayCard.Description displayType="title">
										{section.title}
									</ClayCard.Description>
									<ClayCard.Description
										displayType="text"
										truncate={false}
									>
										<p>{section.description}</p>
										<p>
											{lang.sub(
												Liferay.Language.get(
													'x-questions'
												),
												[
													section.numberOfMessageBoardThreads,
												]
											)}
										</p>
									</ClayCard.Description>
								</ClayCard.Body>
							</ClayCard>
						</Link>
					</div>
				))}
			</div>
=======
						<ClayCard>
							<ClayCard.Body>
								<ClayCard.Description
									className="text-dark"
									displayType="title"
								>
									{section.title}
								</ClayCard.Description>

								<ClayCard.Description
									className="c-mt-3"
									displayType="text"
									truncate={false}
								>
									{descriptionTruncate(section.description)}
								</ClayCard.Description>

								<ClayCard.Description
									className="c-mt-4 small"
									displayType="text"
									truncate={false}
								>
									<span>
										{section.numberOfMessageBoardThreads}{' '}
										{Liferay.Language.get('threads')}
									</span>

									<button className="btn btn-link btn-sm d-xl-none float-right font-weight-bold p-0">
										View Topic
									</button>
								</ClayCard.Description>
							</ClayCard.Body>
						</ClayCard>
					</Link>
				</div>
			))}
>>>>>>> LPS-110094 Fix layout of questions landing cards
		</div>
	);
};
