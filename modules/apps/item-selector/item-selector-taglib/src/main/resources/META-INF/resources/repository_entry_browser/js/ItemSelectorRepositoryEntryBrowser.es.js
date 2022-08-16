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

import {render} from '@liferay/frontend-js-react-web';
import {EventHandler, PortletBase, delegate} from 'frontend-js-web';
import ReactDOM from 'react-dom';

import ItemSelectorPreview from '../../item_selector_preview/js/ItemSelectorPreview.es';

/**
 * Handles the events in the Repository Entry Browser taglib.
 *
 * @abstract
 * @extends {PortletBase}
 */
class ItemSelectorRepositoryEntryBrowser extends PortletBase {

	/**
	 * @inheritDoc
	 */
	created(props) {
		const {
			closeCaption,
			editImageURL,
			rootNode,
			uploadItemReturnType,
		} = props;

		this.closeCaption = closeCaption;
		this.editImageURL = editImageURL;
		this.rootNode = rootNode;
		this.uploadItemReturnType = uploadItemReturnType;

		this._eventHandler = new EventHandler();
	}

	/**
	 * @inheritDoc
	 */
	attached() {
		this._bindEvents();
		this.attachItemSelectorPreviewComponent();
	}

	attachItemSelectorPreviewComponent() {
		const itemsNodes = Array.from(this.all('.item-preview-editable'));

		const items = itemsNodes.map((node) => node.dataset);

		const clicableItems = Array.from(this.all('.icon-view'));

		if (items.length === clicableItems.length) {
			clicableItems.forEach((clicableItem, index) => {
				clicableItem.addEventListener('click', (event) => {
					event.preventDefault();
					event.stopPropagation();

					this.openItemSelectorPreview(items, index);
				});
			});
		}

		this._itemSelectorPreviewContainer = this.one(
			'.item-selector-preview-container'
		);
	}

	openItemSelectorPreview(items, index) {
		const container = this._itemSelectorPreviewContainer;

		const data = {
			container,
			currentIndex: index,
			editImageURL: this.editImageURL,
			handleSelectedItem: this._onItemSelected.bind(this),
			headerTitle: this.closeCaption,
			itemReturnType: this.uploadItemReturnType,
			items,
		};

		render(ItemSelectorPreview, data, container);
	}

	closeItemSelectorPreview() {
		ReactDOM.unmountComponentAtNode(this._itemSelectorPreviewContainer);
	}

	/**
	 * @inheritDoc
	 */
	detached() {
		super.detached();

		this._eventHandler.removeAllListeners();
	}

	/**
	 * Bind events
	 *
	 * @private
	 */
	_bindEvents() {
		this._eventHandler.add(
			delegate(this.rootNode, 'click', '.item-preview', (event) =>
				this._onItemSelected(event.delegateTarget.dataset)
			)
		);
	}

	/**
	 * Send the selected item.
	 *
	 * @param {Object} item
	 * @private
	 */
	_onItemSelected(item) {
		this.emit('selectedItem', {
			data: {
				returnType: item.returntype,
				value: item.value,
			},
		});
	}
}

export default ItemSelectorRepositoryEntryBrowser;
