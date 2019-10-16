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
				{description > MAX_LENGTH_DESCIPTION
					? description
					: `${description.slice(0, MAX_LENGTH_DESCIPTION)} \u2026`}
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
	displayType,
	portletNamespace,
	suffixTitle,
	targetsIds,
	url
}) => {
	const [description, setDescription] = useState('');
	const [title, setTitle] = useState('');

	const handlerInputChange = ({type, event}) => {
		const value = event.target && event.target.value;
		if (typeof value === undefined) {
			return;
		}

		if (type === 'description') {
			setDescription(value);
		} else if (type === 'title') {
			setTitle(value);
		}
	};

	useEffect(() => {
		const inputs = Object.entries(targetsIds).reduce(
			(memo, [key, targetId]) => {
				const listener = event => {
					handlerInputChange({event, type: key});
				};

				const node = document.getElementById(
					`_${portletNamespace}_${targetId}`
				);

				node.addEventListener('input', listener);
				node.dispatchEvent(new Event('input'));

				memo[key] = {listener, node};

				return memo;
			},
			{}
		);

		return () => {
			Object.values(inputs).forEach(({node, listener}) =>
				node.removeEventListener('input', listener)
			);
		};
	}, [portletNamespace, targetsIds]);

	return (
		<PreviewSeo
			description={description}
			displayType={displayType}
			suffixTitle={suffixTitle}
			title={title}
			url={url}
			url="https://liferay.com/blog/en/example-url"
			displayType="og"
			imgUrl="https://placekitten.com/1200/630"
			imgUrl="https://placekitten.com/1000/1000"
		/>
	);
};

PreviewSeoContainer.propTypes = {
	displayType: PropTypes.string,
	targetsIds: PropTypes.shape({
		description: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired
	}).isRequired,
	url: PropTypes.string
};

export default PreviewSeoContainer;
