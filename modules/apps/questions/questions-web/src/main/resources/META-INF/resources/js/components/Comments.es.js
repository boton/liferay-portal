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

import React, {useCallback, useState} from 'react';

import {createComment} from '../utils/client.es';
import Comment from './Comment.es';

export default ({commentChange, comments, entityId}) => {
	const [comment, setComment] = useState('');
	const [showNewComment, setShowNewComment] = useState(false);

	const postComment = () => {
		return createComment(comment, entityId).then(data => {
			setComment('');
			setShowNewComment(false);
			commentChange([...comments, data]);
		});
	};

	const _commentChange = useCallback(
		comment => {
			if (commentChange) {
				return commentChange([...comments.filter(o => o.id !== comment.id)]);
			}
			return null;
		}, [commentChange, comments]
	);

	return (
		<div>
			{comments.map(comment => (
				<Comment
					comment={comment}
					key={comment.id}
					commentChange={_commentChange}
				/>
			))}

			{!showNewComment && (
				<p onClick={() => setShowNewComment(true)}>Reply</p>
			)}

			{showNewComment && (
				<>
					<div className="autofit-row autofit-padded">
						<div className="autofit-col autofit-col-expand">
						<textarea
							onChange={event => setComment(event.target.value)}
							value={comment}
						/>
						</div>
						<div className="autofit-col">
							<button
								className="btn btn-primary"
								disabled={comment.length < 15}
								onClick={postComment}
							>
								Add Comment
							</button>
						</div>
					</div>
					<div className="autofit-row autofit-padded">
						<div className="autofit-col">
							{comment.length < 15 && (
								<span>
								Enter at least {15 - comment.length} characters
							</span>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};
