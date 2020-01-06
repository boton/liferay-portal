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
import ClayLabel from '@clayui/label';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import React, {useContext, useEffect, useState} from 'react';

import {AppContext} from '../../AppContext.es';
import {getThreads} from '../../utils/client.es';
import {dateToInternationalHuman} from '../../utils/utils.es';

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
							{/*<Link to={'/questions/' + question.id}>{question.headline}</Link>*/}
							{question.headline}
							<small>
								<ClayIcon
									spritemap={
										Liferay.ThemeDisplay.getPathThemeImages() +
										'/lexicon/icons.svg'
									}
									symbol="caret-top"
								/>
								{(question.aggregateRating &&
									question.aggregateRating.ratingCount) ||
									0}
							</small>
							<small>
								<ClayIcon
									spritemap={
										Liferay.ThemeDisplay.getPathThemeImages() +
										'/lexicon/icons.svg'
									}
									symbol="view"
								/>
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
									spritemap={
										Liferay.ThemeDisplay.getPathThemeImages() +
										'/lexicon/icons.svg'
									}
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
								{question.creator.image ? (
									<img
										src={question.creator.image}
										style={{height: '15px'}}
									/>
								) : (
									<ClayIcon
										spritemap={
											Liferay.ThemeDisplay.getPathThemeImages() +
											'/lexicon/icons.svg'
										}
										symbol="user"
									/>
								)}
								{question.creator.name}
								<span className="date-posted">
									{dateToInternationalHuman(
										question.dateModified
									)}
									{/*<Link*/}
									{/* to={`/user/${question.creator.id}`}>*/}

									{/*</Link>*/}
								</span>
							</p>

							{question.keywords &&
								question.keywords.map(keyword => (
									// <Link key={keyword}
									//    to={`/questions/tag/${keyword}`}>
									<ClayLabel
										displayType="secondary"
										key={keyword}
									>
										{keyword}
									</ClayLabel>
									// 	 </Link>
								))}
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
