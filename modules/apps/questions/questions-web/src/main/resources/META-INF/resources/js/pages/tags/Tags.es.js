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

import {AppContext} from '../../AppContext.es';
import {getKeywords} from '../../utils/client.es';
import {dateToInternationalHuman} from '../../utils/utils.es';

export default () => {
	const context = useContext(AppContext);

	const [tags, setTags] = useState({});

	useEffect(() => {
		getKeywords(context.siteKey).then(data => setTags(data));
	}, [context.siteKey]);

	return (
		<>
			{tags.items &&
			 tags.items.map(keyword => (
				 <ClayCard key={keyword.id}>
					 <ClayCard.Body>
						 <ClayCard.Description displayType="title">
							 #{keyword.name}
						 </ClayCard.Description>
						 <ClayCard.Description displayType="text">
							<span>
								Usage: {keyword.keywordUsageCount}
							</span>
							 <span>
								{dateToInternationalHuman(keyword.dateCreated)}
							</span>
						 </ClayCard.Description>
					 </ClayCard.Body>
				 </ClayCard>
			 ))}
		</>
	);
};
