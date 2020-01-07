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

	const unmountComment = useCallback(
		comment =>
			commentChange([...comments.filter(o => o.id !== comment.id)]),
		[commentChange, comments]
	);

	return (
		<div>
			{comments.map(comment => (
				<Comment
					comment={comment}
					key={comment.id}
					unmountComment={unmountComment}
				/>
			))}

			{!showNewComment && (
				<p onClick={() => setShowNewComment(true)}>Reply</p>
			)}

			{showNewComment && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexFlow: 'wrap'
					}}
				>
					<input
						onChange={event => setComment(event.target.value)}
						style={{flexGrow: 1}}
						value={comment}
					/>
					<button
						className="btn btn-primary"
						disabled={comment.length < 15}
						onClick={postComment}
					>
						Add Comment
					</button>
					<p style={{flexBasis: '100%'}}>
						{comment.length < 15 && (
							<span>
								Enter at least {15 - comment.length} characters
							</span>
						)}
					</p>
				</div>
			)}
		</div>
	);
};
