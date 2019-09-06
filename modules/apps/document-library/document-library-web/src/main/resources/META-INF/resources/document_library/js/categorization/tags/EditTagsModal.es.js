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

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import {ClayRadio, ClayRadioGroup} from '@clayui/form';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal, {useModal} from '@clayui/modal';
import EditTagsContext from './EditTagsContext.es';
import PropTypes from 'prop-types';
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import {fetch} from 'frontend-js-web';
import {AssetTagsSelector} from 'asset-taglib';

const EditTagsModal = ({
	fileEntries,
	folderId,
	groupIds,
	pathModule,
	repositoryId,
	selectAll = false,
	urlSelection = '/bulk/v1.0/bulk-selection',
	urlTags = '/bulk/v1.0/keywords/common',
	urlUpdateTags = '/bulk/v1.0/keywords/batch',
	onModalClose = () => {}
}) => {
	const {namespace} = useContext(EditTagsContext);

	const [append, setAppend] = useState(true);
	const [bulkSelection, setBulkSelection] = useState();
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(true);
	const [multiple, setMultiple] = useState(false);
	const [initialSelectedItems, setInitialSelectedItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectedRadioGroupValue, setSelectedRadioGroupValue] = useState(
		'add'
	);

	const {observer, onClose} = useModal({
		onClose: onModalClose
	});

	useEffect(() => {
		setBulkSelection(getBulkSelection());
	}, [fileEntries, folderId, getBulkSelection, repositoryId, selectAll]);

	useEffect(() => {
		fetchSelectedItems();
	}, [urlTags, urlSelection, bulkSelection, fetchSelectedItems]);

	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;

		return () => {
			isMounted.current = false;
		};
	});

	const fetchSelectedItems = () => {
		const selection = getBulkSelection();

		return Promise.all([
			fetchTags(urlTags, 'POST', selection),
			fetchTags(urlSelection, 'POST', selection)
		]).then(([responseTags, responseSelection]) => {
			if (responseTags && responseSelection) {
				const selectedItems = (responseTags.items || []).map(
					item => item.name
				);

				if (isMounted.current) {
					setLoading(false);
					setInitialSelectedItems(selectedItems);
					setSelectedItems(selectedItems);
					setDescription(getDescription(responseSelection.size));
					setMultiple(fileEntries.length > 1 || selectAll);
				}
			}
		});
	};

	const fetchTags = (url, method, bodyData) => {
		const init = {
			body: JSON.stringify(bodyData),
			headers: {'Content-Type': 'application/json'},
			method
		};

		return fetch(`${pathModule}${url}`, init)
			.then(response => response.json())
			.catch(() => {
				onModalClose();
			});
	};

	const getBulkSelection = useCallback(() => {
		return {
			documentIds: fileEntries,
			selectionScope: {
				folderId,
				repositoryId,
				selectAll
			}
		};
	});

	const getDescription = size => {
		if (size === 1) {
			return Liferay.Language.get(
				'you-are-editing-the-tags-for-the-selected-item'
			);
		}

		return Liferay.Util.sub(
			Liferay.Language.get(
				'you-are-editing-the-common-tags-for-x-items.-select-edit-or-replace-current-tags'
			),
			size
		);
	};

	const handleMultipleSelectedOptionChange = value => {
		setAppend(value === 'add');
		setSelectedRadioGroupValue(value);
	};

	const handleSubmit = event => {
		event.preventDefault();

		const initialSelectedItemsSet = new Set(initialSelectedItems);
		const selectedItemsSet = new Set(selectedItems);

		const addedLabels = !append
			? selectedItems
			: selectedItems.filter(item => !initialSelectedItemsSet.has(item));

		const removedLabels = initialSelectedItems.filter(
			item => !selectedItemsSet.has(item)
		);

		fetchTags(urlUpdateTags, append ? 'PATCH' : 'PUT', {
			documentBulkSelection: getBulkSelection(),
			keywordsToAdd: addedLabels,
			keywordsToRemove: removedLabels
		}).then(() => {
			const bulkStatusComponent = Liferay.component(
				`${namespace}BulkStatus`
			);
			if (bulkStatusComponent) {
				bulkStatusComponent.startWatch();
			}

			onModalClose();
		});
	};

	return (
		<ClayModal observer={observer} size="md">
			<ClayModal.Header>
				{Liferay.Language.get('edit-tags')}
			</ClayModal.Header>

			<form onSubmit={handleSubmit}>
				<ClayModal.Body>
					{loading && <ClayLoadingIndicator />}

					{selectAll && (
						<ClayAlert title="">
							{Liferay.Language.get(
								'this-operation-will-not-be-applied-to-any-of-the-selected-folders'
							)}
						</ClayAlert>
					)}

					<p>{description}</p>

					{multiple && (
						<ClayRadioGroup
							name="add-replace"
							onSelectedValueChange={
								handleMultipleSelectedOptionChange
							}
							selectedValue={selectedRadioGroupValue}
						>
							<ClayRadio
								label={Liferay.Language.get('edit')}
								value="add"
							>
								<div className="form-text">
									{Liferay.Language.get(
										'add-new-categories-or-remove-common-categories'
									)}
								</div>
							</ClayRadio>

							<ClayRadio
								label={Liferay.Language.get('replace')}
								value="replace"
							>
								<div className="form-text">
									{Liferay.Language.get(
										'these-categories-replace-all-existing-categories'
									)}
								</div>
							</ClayRadio>
						</ClayRadioGroup>
					)}

					<AssetTagsSelector
						groupIds={groupIds}
						inputName={`${namespace}_hiddenInput`}
						onSelectedItemsChange={setSelectedItems}
						selectedItems={selectedItems}
					/>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						<ClayButton.Group spaced>
							<ClayButton
								displayType="secondary"
								onClick={onClose}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>

							<ClayButton displayType="primary" type="submit">
								{Liferay.Language.get('save')}
							</ClayButton>
						</ClayButton.Group>
					}
				/>
			</form>
		</ClayModal>
	);
};

EditTagsModal.propTypes = {
	fileEntries: PropTypes.array,
	folderId: PropTypes.string,
	groupIds: PropTypes.array,
	id: PropTypes.string,
	pathModule: PropTypes.string,
	repositoryId: PropTypes.string,
	selectAll: PropTypes.bool,
	urlSelection: PropTypes.string,
	urlTags: PropTypes.string,
	urlUpdateTags: PropTypes.string
};

export default EditTagsModal;
