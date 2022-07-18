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
	folder: 'folder',
	page: 'document-text',
};

const TEST_ITEMS = [
	{
		children: [
			{
				children: [
					{
						id: 5,
						name: 'Welcome to Liferay',
						type: 'page',
					},
					{
						id: 6,
						name: 'Our Company Values',
						type: 'page',
					},
				],
				id: 4,
				name: 'Introduction',
				type: 'folder',
			},
			{id: 1, name: 'Company', type: 'folder'},
			{
				id: 2,
				name: 'Design Team',
				type: 'folder',
			},
			{
				id: 3,
				name: 'Weekly Notes',
				type: 'page',
			},
		],
		id: 0,
		name: 'Home',
		type: 'folder',
	},
];

const getFolderDropdownItems = () => [
	{label: Liferay.Language.get('edit'), symbolLeft: 'pencil'},
	{label: Liferay.Language.get('import'), symbolLeft: 'import'},
	{
		label: Liferay.Language.get('move'),
		symbolLeft: 'move-folder',
	},
	{type: 'divider'},
	{
		label: Liferay.Language.get('permissions'),
		symbolLeft: 'password-policies',
	},
	{label: Liferay.Language.get('delete'), symbolLeft: 'trash'},
];

export default function Navigation({
	items = TEST_ITEMS,
	selectedItemId = TEST_ITEMS[0].children[0].children[1].id,
}) {
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
							event.stopPropagation();
							event.preventDefault();
							console.log('navigate to: ', item.name);

							// navigate(window.location.toString());

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
												<ClayDropDownWithItems
													items={getFolderDropdownItems()}
													trigger={
														<ClayButton
															displayType={null}
															monospaced
														>
															<ClayIcon symbol="ellipsis-v" />
														</ClayButton>
													}
												/>
											</>
										}
										onClick={(event) => {
											event.stopPropagation();
											event.preventDefault();
											console.log(
												'navigate to: ',
												item.name
											);

											// navigate(
											// 	window.location.toString()
											// );

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

// export default function Navigation({items: initialItems = TEST_ITEMS}) {
// 	const [items, setItems] = useState([initialItems]);

// 	const handeItemsChange = (items) => {
// 		console.log(items);

// 		setItems(items);
// 	};

// 	return (
// 		<ClayTreeView
// 			defaultItems={initialItems}
// 			dragAndDrop
// 			items={items}
// 			onItemsChange={handeItemsChange}
// 		>
// 			{(item) => {
// 				console.log(item);

// 				return (
// 					<ClayTreeView.Item>
// 						<ClayTreeView.ItemStack>
// 							<ClayIcon symbol={ITEM_TYPES_SYMBOL[item.type]} />

// 							{item.name}
// 						</ClayTreeView.ItemStack>

// 						{item.children?.length ? (
// 							<ClayTreeView.Group items={item.children}>
// 								{(item) => {
// 									console.log(item);

// 									return (
// 										<ClayTreeView.Item>
// 											<ClayIcon
// 												symbol={
// 													ITEM_TYPES_SYMBOL[item.type]
// 												}
// 											/>

// 											{item.name}
// 										</ClayTreeView.Item>
// 									);
// 								}}
// 							</ClayTreeView.Group>
// 						) : (
// 							<ClayTreeView.Group>
// 								<ClayTreeView.Item disabled={true}>
// 									No Content
// 								</ClayTreeView.Item>
// 							</ClayTreeView.Group>
// 						)}
// 					</ClayTreeView.Item>
// 				);
// 			}}
// 		</ClayTreeView>
// 	);
// }
