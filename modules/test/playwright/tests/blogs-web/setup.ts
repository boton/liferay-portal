/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DPT_CONTENT_TYPE} from '../../pages/layout-page-template-admin-web/DisplayPageTemplatesPage';
import {clickAndExpectToBeVisible} from '../../utils/clickAndExpectToBeVisible';
import getRandomString from '../../utils/getRandomString';
import {waitForSuccessAlert} from '../../utils/waitForSuccessAlert';
import getPageDefinition from '../layout-content-page-editor-web/utils/getPageDefinition';
import getWidgetDefinition from '../layout-content-page-editor-web/utils/getWidgetDefinition';

import type {ApiHelpers} from '../../helpers/ApiHelpers';
import type {PageEditorPage} from '../../pages/layout-content-page-editor-web/PageEditorPage';
import type {DisplayPageTemplatesPage} from '../../pages/layout-page-template-admin-web/DisplayPageTemplatesPage';

async function createAssetPublisherAndConfigure({
	apiHelpers,
	page,
	pageEditorPage,
	site,
}: {
	apiHelpers: ApiHelpers;
	page;
	pageEditorPage: PageEditorPage;
	site: Site;
}) {
	const widgetId = getRandomString();

	const widgetDefinition = getWidgetDefinition({
		id: widgetId,
		widgetName:
			'com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet',
	});

	const layout = await apiHelpers.headlessDelivery.createSitePage({
		pageDefinition: getPageDefinition([widgetDefinition]),
		siteId: site.id,
		title: getRandomString(),
	});

	await pageEditorPage.goto(layout, site.friendlyUrlPath);

	const topper = pageEditorPage.getTopper(widgetId);

	await topper.hover();
	await clickAndExpectToBeVisible({
		autoClick: true,
		target: page.getByRole('menuitem', {
			exact: true,
			name: 'Configuration',
		}),
		trigger: topper.locator('.portlet-options'),
	});

	const assetPublisherConfigurationIframe = await page.frameLocator(
		'iframe[title="Asset Publisher\\a      - Configuration"]'
	);

	const assetPublisherConfigurationDynamicRadio =
		assetPublisherConfigurationIframe.getByText('Dynamic', {exact: true});
	await assetPublisherConfigurationDynamicRadio.waitFor();
	if (await assetPublisherConfigurationDynamicRadio.isHidden()) {
		await assetPublisherConfigurationIframe
			.getByRole('link', {name: 'Asset Selection'})
			.click();
	}
	await assetPublisherConfigurationDynamicRadio.click();

	const assetPublisherConfigurationSourceAssetTypeSelect =
		await assetPublisherConfigurationIframe.getByLabel('Asset Type');
	if (await assetPublisherConfigurationSourceAssetTypeSelect.isHidden()) {
		await assetPublisherConfigurationIframe
			.getByRole('link', {name: 'Source'})
			.click();
	}
	await assetPublisherConfigurationSourceAssetTypeSelect.selectOption({
		label: 'Blogs Entry',
	});

	await assetPublisherConfigurationIframe
		.getByRole('button', {name: 'Save'})
		.click();

	await page.getByLabel('close', {exact: true}).click();
	await page.getByLabel('Publish', {exact: true}).click();

	await waitForSuccessAlert(
		page,
		'Success:The page was published successfully.'
	);
}

async function createCategories({
	apiHelpers,
	friendlyUrlCategories,
	site,
	vocabularyName,
}: {
	apiHelpers: ApiHelpers;
	friendlyUrlCategories: string[];
	site: Site;
	vocabularyName: string;
}) {
	const {id: vocabularyId} =
		await apiHelpers.headlessAdminTaxonomy.createVocabulary({
			name: vocabularyName,
			siteId: site.id,
		});

	for (const categoryName of friendlyUrlCategories) {
		await apiHelpers.headlessAdminTaxonomy.createCategory({
			name: categoryName,
			vocabularyId,
		});
	}
}

async function createDPTandMarkAsDefault({
	displayPageTemplatesPage,
	site,
}: {
	displayPageTemplatesPage: DisplayPageTemplatesPage;
	site: Site;
}) {
	await displayPageTemplatesPage.goto(site.friendlyUrlPath);

	const displayPageTemplateName = getRandomString();

	await displayPageTemplatesPage.publishNewTemplate({
		contentType: DPT_CONTENT_TYPE.BLOGS_ENTRY,
		name: displayPageTemplateName,
	});

	await displayPageTemplatesPage.markAsDefault(displayPageTemplateName);
}
export async function friendlyURLCategoriesSetup({
	apiHelpers,
	displayPageTemplatesPage,
	friendlyUrlCategories,
	page,
	pageEditorPage,
	site,
	vocabularyName,
}: {
	apiHelpers: ApiHelpers;
	displayPageTemplatesPage: DisplayPageTemplatesPage;
	friendlyUrlCategories: string[];
	page;
	pageEditorPage: PageEditorPage;
	site: Site;
	vocabularyName: string;
}) {
	await createCategories({
		apiHelpers,
		friendlyUrlCategories,
		site,
		vocabularyName,
	});
	await createDPTandMarkAsDefault({displayPageTemplatesPage, site});
	await createAssetPublisherAndConfigure({
		apiHelpers,
		page,
		pageEditorPage,
		site,
	});
}
