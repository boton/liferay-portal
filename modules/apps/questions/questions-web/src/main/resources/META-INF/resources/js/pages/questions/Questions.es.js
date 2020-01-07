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

import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {AppContext} from '../../AppContext.es';
import {getThreads} from '../../utils/client.es';
import {dateToInternationalHuman} from '../../utils/utils.es';
import KeywordsList from '../components/KeywordList.es';
import UserAvatar from '../components/UserAvatar.es';

export default () => {
	const context = useContext(AppContext);

	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(5);
	const [questions, setQuestions] = useState([]);

	useEffect(() => {
		getThreads({page, pageSize, siteKey: context.siteKey})
			.then(data => setQuestions(data))
			.then(() => setLoading(false));
	}, [page, pageSize, context.siteKey]);

	const hasValidAnswer = question =>
		question.messageBoardMessages.items.filter(
			message => message.showAsAnswer
		).length > 0;

	return (
		<section>
			{loading && <ClayLoadingIndicator />}
			{questions.items &&
				questions.items.map(question => (
					<div key={question.id}>
						<h2>
							<Link to={'/questions/' + question.id}>
								{question.headline}
							</Link>
							<small>
								<ClayIcon symbol="caret-top" />
								{(question.aggregateRating &&
									question.aggregateRating.ratingCount) ||
									0}
							</small>
							<small>
								<ClayIcon symbol="view" />
								{question.viewCount}
							</small>
							<small
								style={{
									background: hasValidAnswer(question)
										? 'green'
										: ''
								}}
							>
								<ClayIcon
									symbol={
										hasValidAnswer(question)
											? 'check-circle-full'
											: 'message'
									}
								/>
								{question.messageBoardMessages.items.length}
							</small>
						</h2>
						<p className="text-truncate">{question.articleBody}</p>

						<div>
							<p>
								<UserAvatar user={question.creator} />

								{question.creator.name}
								<span className="date-posted">
									{dateToInternationalHuman(
										question.dateModified
									)}
								</span>
							</p>

							<KeywordsList keywords={question.keywords} />
						</div>
					</div>
				))}

			{!!questions.totalCount &&
				questions.totalCount > questions.pageSize && (
					<ClayPaginationWithBasicItems
						activePage={page}
						ellipsisBuffer={2}
						onPageChange={setPage}
						spritemap={
							Liferay.ThemeDisplay.getPathThemeImages() +
							'/lexicon/icons.svg'
						}
						totalPages={questions.totalCount / questions.pageSize}
					/>
				)}
		</section>
	);
};
