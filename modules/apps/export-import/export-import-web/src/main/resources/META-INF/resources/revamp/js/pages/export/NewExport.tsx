/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLayout from '@clayui/layout';
import React, {useState} from 'react';

import {Page, PageSelector} from '../../components/PageSelector';

export function NewExport() {
	const [pages, setPages] = useState<Page[]>([]);

	return (
		<ClayLayout.Sheet>
			<h1>New Export UI</h1>

			<PageSelector
				onSelectionChange={setPages}
				selectedPageIds={new Set(pages.map(({id}) => id))}
			/>

			<div className="smal">
				<strong>Pages: </strong>

				{pages.length
					? JSON.stringify(pages.map(({name}) => name))
					: 'No Pages Selected'}
			</div>
		</ClayLayout.Sheet>
	);
}
