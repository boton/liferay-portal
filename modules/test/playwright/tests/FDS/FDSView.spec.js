/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {test as FDSViewPagesTest} from '../../fixtures/FDSViewPages.fixture';
import {test as apiHelpersTest} from '../../fixtures/apiHelpers.fixture';
import {test as applicationsMenuPageTest} from '../../fixtures/applicationsMenuPages.fixture';

export const test = mergeTests(
	apiHelpersTest,
	applicationsMenuPageTest,
	FDSViewPagesTest
);

test('CreationActionsAdminPageIsDisplayed', async ({
	_FDSViewPage,
	_apiHelpers,
	page,
}) => {
	await _apiHelpers.featureFlag.updateFeatureFlag('LPS-192282', 'true');
	await _apiHelpers.featureFlag.updateFeatureFlag('LPS-191488', 'true');
	await _apiHelpers.featureFlag.updateFeatureFlag('LPS-164563', 'true');
	await _apiHelpers.featureFlag.updateFeatureFlag('LPS-167253', 'true');
	await _apiHelpers.featureFlag.updateFeatureFlag('LPS-194395', 'true');

	await _FDSViewPage.createTestDataSet();
	await _FDSViewPage.createTestDataSetView();
	await _FDSViewPage.gotoTestDataSetView();

	await expect(page.getByLabel('Open Applications MenuCtrl+')).toBeVisible({
		timeout: 100 * 1000,
	});
});
