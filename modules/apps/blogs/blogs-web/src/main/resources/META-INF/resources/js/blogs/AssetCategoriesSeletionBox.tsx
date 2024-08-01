/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayDualListBox} from '@clayui/form';
import React, {useState} from 'react';

type TCategory = {
	label: string;
	value: string;
};

export default function AssetCategoriesSeletionBox({
	availableCategories: initialAvailableCategories = [
		{label: 'cat-1', value: '1'},
		{label: 'cat-2', value: '2'},
		{label: 'cat-3', value: '3'},
	],
	currentCategories: initialCurrentCategories = [
		{label: 'cat-4', value: '4'},
		{label: 'cat-5', value: '5'},
	],
	portletNamespace,
}: {
	availableCategories?: Array<TCategory>;
	currentCategories?: Array<TCategory>;
	portletNamespace: string;
}) {
	const [categories, setCategories] = useState([
		initialAvailableCategories,
		initialCurrentCategories,
	]);

	const [_, currentCategories] = categories;

	return (
		<>
			<ClayDualListBox
				items={categories}
				left={{
					id: `${portletNamespace}available`,
					label: Liferay.Language.get('available'),
				}}
				onItemsChange={setCategories}
				right={{
					id: `${portletNamespace}current`,
					label: Liferay.Language.get('current'),
				}}
				size={3}
			/>

			<input
				name={`${portletNamespace}friendlyURLAssetCategoryIds`}
				type="hidden"
				value={currentCategories.map(({value}) => value).join(',')}
			/>
		</>
	);
}
