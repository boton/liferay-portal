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

import React, {useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';

const MAX_LENGTH_DESCIPTION = 160;

const PreviewSeo = ({
	description = '',
	displayType = 'serp',
	imgUrl = '',
	suffixTitle = '',
	title = '',
	url = ''
}) => {
	const titleUrl = [
		<div className="preview-seo-title text-truncate" key="title">
			{title}
			{suffixTitle && ` - ${suffixTitle}`}
		</div>,
		<div className="preview-seo-url text-truncate" key="url">
			{url}
		</div>
	];

	return (
		<div className={`preview-seo preview-seo-${displayType}`}>
			{imgUrl && (
				<div className="preview-seo-image aspect-ratio aspect-ratio-191-to-100">
					<img
						alt=""
						className="aspect-ratio-item aspect-ratio-item-center-middle aspect-ratio-item-flush"
						src={imgUrl}
					/>
				</div>
			)}
			{displayType === 'og' ? titleUrl.reverse() : titleUrl}
			<div className="preview-seo-description">
				{description.length < MAX_LENGTH_DESCIPTION
					? description
					: `${description.slice(0, MAX_LENGTH_DESCIPTION)}\u2026`}
				{suffixTitle && ` - ${suffixTitle}`}
			</div>
		</div>
	);
};
PreviewSeo.propTypes = {
	description: PropTypes.string,
	displayType: PropTypes.oneOf(['serp', 'og']),
	suffixTitle: PropTypes.string,
	title: PropTypes.string,
	url: PropTypes.string
};

const PreviewSeoContainer = ({
	portletNamespace,
	targets,
	displayType,
	suffixTitle
}) => {
	const [description, setDescription] = useState('');
	const [title, setTitle] = useState('');
	const [url, setUrl] = useState('');

	useEffect(() => {
		const setPreviewState = ({
			placeholder = '',
			type,
			usePlaceholderAsFallback,
			value
		}) => {
			if (value === '' && usePlaceholderAsFallback) {
				value = placeholder;
			}

			if (type === 'description') {
				setDescription(value);
			} else if (type === 'title') {
				setTitle(value);
			} else if (type === 'canonicalURL') {
				setUrl(value);
			}
		};

		const handleInputChange = ({type, event, usePlaceholderAsFallback}) => {
			const target = event.target;
			if (!target) {
				return;
			}

			setPreviewState({
				placeholder: target.placeholder,
				type,
				usePlaceholderAsFallback,
				value: target.value
			});
		};

		const inputs = targets.map(({id, type, usePlaceholderAsFallback}) => {
			const listener = event => {
				handleInputChange({
					event,
					type,
					usePlaceholderAsFallback
				});
			};

			const node = document.getElementById(`_${portletNamespace}_${id}`);

			node.addEventListener('input', listener);

			setPreviewState({
				placeholder: node.placeholder,
				type,
				usePlaceholderAsFallback,
				value: node.value
			});

			return {listener, node};
		});

		return () => {
			inputs.forEach(({listener, node}) =>
				node.removeEventListener('input', listener)
			);
		};
	}, [portletNamespace, targets]);

	return (
		<PreviewSeo
			description={description}
			displayType={displayType}
			suffixTitle={suffixTitle}
			title={title}
			url={url}
			displayType="og"
			imgUrl="https://placekitten.com/1000/1000"
		/>
	);
};

PreviewSeoContainer.propTypes = {
	displayType: PropTypes.string,
	targets: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			usePlaceholderAsFallback: PropTypes.bool
		})
	).isRequired
};

export default PreviewSeoContainer;
