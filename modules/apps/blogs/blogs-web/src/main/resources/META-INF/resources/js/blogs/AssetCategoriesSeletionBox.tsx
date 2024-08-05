/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayDualListBox} from '@clayui/form';
import {normalizeFriendlyURL} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';

declare module 'frontend-js-web' {
	export function normalizeFriendlyURL(text: string): string;
}

type TCategory = {
	label: string;
	value: string;
};

export default function AssetCategoriesSeletionBox({
	automaticURL: initialDisabled,
	availableCategories: initialAvailableCategories = [
		{label: 'cat-1', value: '1'},
		{label: 'cat-2', value: '2'},
		{label: 'cat-3', value: '3'},
	],
	currentCategories: initialCurrentCategories = [
		{label: 'cat-4', value: '4'},
		{label: 'cat-5', value: '5'},
	],
	inputAddon = '',
	portletNamespace,
}: {
	automaticURL: string;
	availableCategories?: Array<TCategory>;
	currentCategories?: Array<TCategory>;
	inputAddon?: string;
	portletNamespace: string;
}) {
	const [categories, setCategories] = useState([
		initialAvailableCategories,
		initialCurrentCategories,
	]);
	const [disabled, setDisabled] = useState<boolean>(Boolean(initialDisabled));
	const [_, currentCategories] = categories;

	const friendlyURLInputRef = useRef(
		document.getElementById(`${portletNamespace}urlTitle`)
	);

	useEffect(() => {
		const friendlyURLInput = friendlyURLInputRef.current;

		if (friendlyURLInput) {
			const mutationObserver = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (
						mutation.type === 'attributes' &&
						mutation.attributeName === 'disabled'
					) {
						const targetInput = mutation.target as HTMLFormElement;
						setDisabled(targetInput.disabled);
					}
				});
			});

			mutationObserver.observe(friendlyURLInput, {
				attributeFilter: ['disabled'],
				attributes: true,
			});

			return () => {
				mutationObserver.disconnect();
			};
		}
	}, []);

	const inputAddonNodeRef = useRef(
		document.querySelector(
			`[for="${portletNamespace}urlTitle"] + .form-text`
		)
	);

	useEffect(() => {
		if (inputAddonNodeRef.current) {
			const inputAddonElement = inputAddonNodeRef.current as HTMLElement;

			inputAddonElement.innerText =
				inputAddon +
				(disabled
					? ''
					: currentCategories
							.map(
								(category) =>
									`${normalizeFriendlyURL(category.label)}/`
							)
							.join(''));
		}
	}, [inputAddon, inputAddonNodeRef, currentCategories, disabled]);

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
