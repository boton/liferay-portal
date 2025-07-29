/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {dataRemoteApiHelpersTest} from '../../../fixtures/dataRemoteApiHelpersTest';
import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {loginTest} from '../../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../../fixtures/pageEditorPagesTest';
import {pageViewModePagesTest} from '../../../fixtures/pageViewModePagesTest';
import {pagesAdminPagesTest} from '../../../fixtures/pagesAdminPagesTest';
import {productMenuPageTest} from '../../../fixtures/productMenuPageTest';
import {remotePageTest} from '../../../fixtures/remotePageTest';
import {uiElementsPageTest} from '../../../fixtures/uiElementsTest';
import {webContentDisplayPageTest} from '../../../fixtures/webContentDisplayPageTest';
import {createCategories} from '../../../helpers/CreateCategories';
import getGlobalSiteId from '../../../utils/getGlobalSiteId';
import getRandomString from '../../../utils/getRandomString';
import {reloadUntilVisible} from '../../../utils/reloadUntilVisible';
import getBasicWebContentStructureId from '../../../utils/structured-content/getBasicWebContentStructureId';
import {pagesPagesTest} from '../../layout-admin-web/main/fixtures/pagesPagesTest';
import {remoteStagingPagesTest} from './fixtures/remoteStagingPagesTest';

const remotePort = '9080';
const remotePage = remotePageTest(remotePort);

export const test = mergeTests(
	dataApiHelpersTest,
	dataRemoteApiHelpersTest(remotePage, remotePort),
	loginTest(),
	featureFlagsTest({
		'LPD-39304': {enabled: true},
	}),
	pageEditorPagesTest,
	pagesAdminPagesTest,
	pagesPagesTest,
	pageViewModePagesTest,
	productMenuPageTest,
	remoteStagingPagesTest,
	uiElementsPageTest,
	webContentDisplayPageTest
);

test(
	'Check Web contents can be published via their portlet using remote staging',
	{tag: '@LPS-81950'},
	async ({
		apiHelpers,
		pageEditorPage,
		remoteApiHelpers,
		remotePage,
		remoteStagingPage,
		uiElementsPage,
		webContentDisplayPage,
		widgetPagePage,
	}) => {
		test.slow();

		const site = await apiHelpers.headlessSite.createSite({
			name: 'Site Name',
		});

		apiHelpers.data.push({id: site.id, type: 'site'});

		const layout = await apiHelpers.jsonWebServicesLayout.addLayout({
			groupId: site.id,
			options: {
				type: 'portlet',
			},
			title: 'Staging Test Page',
		});

		const remoteSite = await remoteApiHelpers.headlessSite.createSite({
			name: 'Remote Site Name',
		});

		remoteApiHelpers.data.push({id: remoteSite.id, type: 'site'});

		await apiHelpers.jsonWebServicesStaging.enableRemoteStaging({
			groupId: site.id,
			remoteGroupId: remoteSite.id,
			remotePort,
		});

		await remoteStagingPage.publishToLive({
			layoutFriendlyURL: layout.friendlyURL,
			siteFriendlyUrl: site.friendlyUrlPath,
		});

		const basicWebContentStructureId =
			await getBasicWebContentStructureId(apiHelpers);

		await apiHelpers.jsonWebServicesJournal.addWebContent({
			content: 'WC WebContent Content',
			ddmStructureId: basicWebContentStructureId,
			groupId: site.id,
			titleMap: {en_US: 'WC WebContent Title'},
		});

		await pageEditorPage.goto(layout, site.friendlyUrlPath);
		await uiElementsPage.addButton.click();
		await widgetPagePage.addPortlet(
			'Web Content Display',
			'Content Management'
		);
		await webContentDisplayPage.addWebContentWithDisplay({
			pageType: 'widget',
			webContentName: 'WC WebContent Title',
		});

		await remoteStagingPage.publishToLive({
			layoutFriendlyURL: layout.friendlyURL,
			siteFriendlyUrl: site.friendlyUrlPath,
		});

		const remoteUrl = remoteApiHelpers.baseUrl.substring(
			0,
			remoteApiHelpers.baseUrl.length - 3
		);

		await remotePage.goto(`${remoteUrl}/web${remoteSite.friendlyUrlPath}`);

		await reloadUntilVisible({
			myLocator: remotePage.getByRole('heading', {
				name: 'WC WebContent Title',
			}),
			page: remotePage,
		});

		await expect(
			remotePage.getByRole('heading', {name: 'WC WebContent Title'})
		).toBeVisible();
		await expect(
			remotePage.getByText('WC WebContent Content')
		).toBeVisible();
	}
);

test(
	'holaaa',
	{tag: '@wip'},
	async ({
		apiHelpers,
		page,

		// pageEditorPage,

		remoteApiHelpers,

		// remotePage,
		// remoteStagingPage,
		// uiElementsPage,
		// webContentDisplayPage,
		// widgetPagePage,

	}) => {
		test.slow();

		const categoryNames = [
			{name: getRandomString()},
			{name: getRandomString()},
		];
		const vocabularyName = getRandomString();
		const siteId = await getGlobalSiteId(apiHelpers);
		const remoteSiteId = await getGlobalSiteId(remoteApiHelpers);

		// const categories: Array<any> = await createCategories({
		// 	apiHelpers,
		// 	categoryNames,
		// 	siteId,
		// 	vocabularyName,
		// });

		// apiHelpers.data.push({
		// 	id: categories[0].vocabularyId,
		// 	type: 'taxonomyVocabulary',
		// });

		console.log(
			'remoteApiHelpers.headlessAdminTaxonomy',
			remoteApiHelpers.headlessAdminTaxonomy.postSiteTaxonomyVocabulary
		);

		// console.log({
		// 	apiHelpers: remoteApiHelpers,
		// 	categoryNames,
		// 	siteId: remoteSiteId,
		// 	vocabularyName,
		// })

		// console.log(
		// 	await remoteApiHelpers.headlessAdminTaxonomy.postSiteTaxonomyVocabulary(
		// 		{
		// 			name: vocabularyName,
		// 			siteId: remoteSiteId,
		// 		}
		// 	)
		// );

		const categories: any[] = await createCategories({
			apiHelpers: remoteApiHelpers,
			categoryNames,
			siteId: remoteSiteId,
			vocabularyName,
		});

		// await remoteApiHelpers.headlessAdminTaxonomy.postSiteTaxonomyVocabulary(
		// 	{
		// 		name: vocabularyName,
		// 		siteId: remoteSiteId,
		// 	}
		// );

		// remoteApiHelpers.data.push({
		// 	id: categories[0].vocabularyId,
		// 	type: 'taxonomyVocabulary',
		// });

		// const site = await apiHelpers.headlessSite.createSite({
		// 	name: 'Site Name',
		// });

		// apiHelpers.data.push({id: site.id, type: 'site'});

		// const remoteSite = await remoteApiHelpers.headlessSite.createSite({
		// 	name: 'Remote Site Name',
		// });

		// remoteApiHelpers.data.push({id: remoteSite.id, type: 'site'});

		await apiHelpers.jsonWebServicesStaging.enableRemoteStaging({
			groupId: siteId,
			remoteGroupId: remoteSiteId,
			remotePort,
		});

		await page.pause();
	}
);
