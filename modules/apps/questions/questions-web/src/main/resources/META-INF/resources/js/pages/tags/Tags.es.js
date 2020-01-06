import ClayCard from '@clayui/card';
import React, {useContext, useEffect, useState} from 'react';

import {dateToInternationalHuman} from "../../utils/utils.es";
import {AppContext} from "../../AppContext.es";
import {getKeywords} from "../../utils/client.es";

export default () => {

	const context = useContext(AppContext);

	const [tags, setTags] = useState({});

	useEffect(() => {

		getKeywords(context.siteKey).then(
			data => setTags(data));
	}, [context.siteKey]);

	return (
		<section>
			<div className="col-md-5">
				{tags.items && tags.items.map(keyword =>
					<ClayCard key={keyword.id}>
						<ClayCard.Body>
							<ClayCard.Description displayType="title">
								#{keyword.name}
								{/*<Link*/}
								{/*	to={`/questions/tag/${keyword.name}`}></Link>*/}
							</ClayCard.Description>
							<ClayCard.Description truncate={false}
												  displayType="text">
								<span>Usage: {keyword.keywordUsageCount}</span>
								<br/>
								<span>{dateToInternationalHuman(keyword.dateCreated)}</span>
							</ClayCard.Description>
						</ClayCard.Body>
					</ClayCard>)
				}
			</div>
		</section>
	);
};