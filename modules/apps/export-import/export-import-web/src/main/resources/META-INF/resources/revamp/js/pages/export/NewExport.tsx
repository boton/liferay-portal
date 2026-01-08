/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayLayout from '@clayui/layout';
import ClayModal, {useModal} from '@clayui/modal';
import React from 'react';

export function NewExport() {
	const {observer, onOpenChange, open} = useModal({
		defaultOpen: false,
	});

	return (
		<ClayLayout.Sheet>
			<h1>New Export UI</h1>

			<ClayButton
				onClick={() => {
					onOpenChange(true);
				}}
			>
				Open Page Selection Modal
				{open && (
					<ClayModal observer={observer}>
						<ClayModal.Header
							closeButtonAriaLabel={Liferay.Language.get('close')}
						>
							Page Selection Modal
						</ClayModal.Header>

						<ClayModal.Body>
							Lorem ipsum dolor sit, amet consectetur adipisicing
							elit. Autem repellendus dolore excepturi minima
							libero deserunt saepe eius officia rem architecto,
							dignissimos deleniti soluta, placeat quisquam
							corporis facilis sapiente? Accusamus, sunt?
						</ClayModal.Body>
					</ClayModal>
				)}
			</ClayButton>
		</ClayLayout.Sheet>
	);
}
