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

import ClayButton from '@clayui/button';
import {TreeView as ClayTreeView} from '@clayui/core';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import {navigate} from 'frontend-js-web';
import React from 'react';

const ITEM_TYPES_SYMBOL = {
	article: 'document-text',
	folder: 'folder',
};

// TODO: we need specific actions depending on the types: root, folder, or article.

const _FOLDER_DROPDOWN_ITEMS = [
	{
		href: '/mock_url',
		label: Liferay.Language.get('edit'),
		symbolLeft: 'pencil',
	},
	{
		href: '/mock_url',
		label: Liferay.Language.get('import'),
		symbolLeft: 'import',
	},
	{
		href: '/mock_url',
		label: Liferay.Language.get('move'),
		symbolLeft: 'move-folder',
	},
	{type: 'divider'},
	{
		href: '/mock_url',
		label: Liferay.Language.get('permissions'),
		symbolLeft: 'password-policies',
	},
	{
		href: '/mock_url',
		label: Liferay.Language.get('delete'),
		symbolLeft: 'trash',
	},
];

const TEST_ITEMS = [
	{
		children: [
			{
				actions: _FOLDER_DROPDOWN_ITEMS,
				children: [
					{
						href: '/mock_url',
						id: 5,
						name: 'Welcome to Liferay',
						type: 'article',
					},
					{
						children: [
							{
								href: '/mock_url',
								id: 7,
								name: 'Lead by Serving',
								type: 'article',
							},
							{
								href: '/mock_url',
								id: 8,
								name: 'Value People',
								type: 'article',
							},
							{
								href: '/mock_url',
								id: 9,
								name: 'Stay Nerdy',
								type: 'article',
							},
						],
						href: '/mock_url',
						id: 6,
						name: 'Our Company Values',
						type: 'article',
					},
				],
				href: '/mock_url',
				id: 4,
				name: 'Introduction',
				type: 'folder',
			},
			{
				actions: _FOLDER_DROPDOWN_ITEMS,
				href: '/mock_url',
				id: 1,
				name: 'Company',
				type: 'folder',
			},

			{
				actions: _FOLDER_DROPDOWN_ITEMS,
				href: '/mock_url',
				id: 2,
				name: 'Design Team',
				type: 'folder',
			},
			{
				href: '/mock_url',
				id: 3,
				name: 'Weekly Notes',
				type: 'article',
			},
		],
		href: '/mock_url',
		id: 0,
		name: 'Home',
		type: 'folder',
	},
];

export default function Navigation({
	items = TEST_ITEMS,
	selectedItemId = TEST_ITEMS[0].children[0].children[1].id,
}) {
	const handleClickItem = (event, item) => {
		event.stopPropagation();
		event.preventDefault();

		// BUG: Disabled on folder because we are navigate when expand dropdown actions

		if (item.type === 'folder') {
			return;
		}

		// TODO: navigate to item.href when we have proper URLs

		navigate(window.location.toString());
	};

	return (
		<ClayTreeView
			defaultItems={items}
			defaultSelectedKeys={new Set([selectedItemId])}
			nestedKey="children"
			showExpanderOnHover={false}
		>
			{(item) => {
				return (
					<ClayTreeView.Item
						onClick={(event) => {
							handleClickItem(event, item);
						}}
					>
						<ClayTreeView.ItemStack>
							<ClayIcon symbol={ITEM_TYPES_SYMBOL[item.type]} />

							{item.name}
						</ClayTreeView.ItemStack>

						<ClayTreeView.Group items={item.children}>
							{(item) => {
								return (
									<ClayTreeView.Item
										actions={
											<>
												<ClayButton
													displayType={null}
													monospaced
												>
													<ClayIcon symbol="plus" />
												</ClayButton>

												{item?.actions?.length && (
													<ClayDropDownWithItems
														items={item.actions}
														trigger={
															<ClayButton
																displayType={
																	null
																}
																monospaced
															>
																<ClayIcon symbol="ellipsis-v" />
															</ClayButton>
														}
													/>
												)}
											</>
										}
										onClick={(event) => {
											handleClickItem(event, item);
										}}
									>
										<ClayIcon
											symbol={
												ITEM_TYPES_SYMBOL[item.type]
											}
										/>

										{item.name}
									</ClayTreeView.Item>
								);
							}}
						</ClayTreeView.Group>
					</ClayTreeView.Item>
				);
			}}
		</ClayTreeView>
	);
}
