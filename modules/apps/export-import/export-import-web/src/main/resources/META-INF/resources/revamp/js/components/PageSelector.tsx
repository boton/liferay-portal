/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import {sub} from 'frontend-js-web';

// @ts-ignore

import {SelectLayout} from 'layout-taglib';
import React, {useState} from 'react';

// @ts-ignore

import initialPages from '../mocks/initialPages.json';

export type Page = {
	name: string;
};

export function PageSelector({
	onSelectionChange,
}: {
	onSelectionChange: (pages: Page[]) => void;
}) {
	const {observer, onOpenChange, open} = useModal();

	const [selectedPages, setSelectedPages] = useState<Page[]>([]);

	return (
		<ClayButton
			className="font-weight-semi-bold"
			displayType="link"
			onClick={() => {
				onOpenChange(true);
			}}
		>
			{sub(
				Liferay.Language.get('select-x'),
				Liferay.Language.get('pages')
			)}

			{open && (
				<ClayModal observer={observer}>
					<ClayModal.Header
						closeButtonAriaLabel={Liferay.Language.get('close')}
					>
						{sub(
							Liferay.Language.get('select-x'),
							Liferay.Language.get('pages')
						)}
					</ClayModal.Header>

					<ClayModal.Body className="p-0" style={{height: '60vh'}}>
						<SelectLayout
							multiSelection
							nodes={initialPages}
							onSelectionChange={(seletion: any) => {
								setSelectedPages(seletion);
							}}
						/>
					</ClayModal.Body>

					<ClayModal.Footer
						last={
							<ClayButton.Group spaced>
								<ClayButton
									displayType="secondary"
									onClick={() => onOpenChange(false)}
								>
									{Liferay.Language.get('cancel')}
								</ClayButton>

								<ClayButton
									onClick={() => {
										onSelectionChange(selectedPages);
										onOpenChange(false);
									}}
								>
									{Liferay.Language.get('select')}
								</ClayButton>
							</ClayButton.Group>
						}
					/>
				</ClayModal>
			)}
		</ClayButton>
	);
}
