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
import React, {useCallback, useEffect, useState} from 'react';

import Comments from './Comments.es';
import Rating from './Rating.es';
import UserRow from './UserRow.es';

export default ({answer}) => {
	const [comments, setComments] = useState(answer.messageBoardMessages.items);
	const [showAsAnswer, setShowAsAnswer] = useState(answer.showAsAnswer);

	const _answerRatingChange = useCallback(
		ratingValue => {
			answer.aggregateRating = {...answer.aggregateRating, ratingValue};
		},
		[answer]
	);

	const _commentsChange = useCallback(comments => {
		setComments([...comments]);
	}, []);

	useEffect(() => {
		setShowAsAnswer(answer.showAsAnswer);
	}, [answer.showAsAnswer]);

	return (
		<>
			<div
				className={
					'autofit-row autofit-padded ' +
					(showAsAnswer ? 'question-accepted-answer' : '')
				}
			>
				<div className="autofit-col">
					<Rating
						aggregateRating={answer.aggregateRating}
						entityId={answer.id}
						myRating={
							answer.myRating && answer.myRating.ratingValue
						}
						ratingChange={_answerRatingChange}
						type={'Message'}
					/>
				</div>

				<div className="autofit-col autofit-col-expand">
					<div className="autofit-section">
						{showAsAnswer && (
							<p>
								<ClayIcon symbol="check-circle-full" /> Chosen
								answer
							</p>
						)}
						<p>{answer.articleBody}</p>

						<Comments
							comments={comments}
							commentsChange={_commentsChange}
							entityId={answer.id}
						/>
					</div>
				</div>
				<div className="autofit-col">
					<UserRow answer={true} creator={answer.creator} />
				</div>
			</div>
			<hr />
		</>
	);
};
