/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	TaxonomyCategoryAPI,
	TaxonomyVocabularyAPI,
} from '@liferay/headless-admin-taxonomy-client-js';
import {expect, mergeTests} from '@playwright/test';
import {createReadStream, readdirSync} from 'fs';
import path from 'path';

import {assetPublisherPagesTest} from '../../../fixtures/assetPublisherPagesTest';
import {assetPublisherWidgetPagesTest} from '../../../fixtures/assetPublisherWidgetPagesTest';
import {collectionsPagesTest} from '../../../fixtures/collectionsPagesTest';
import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {displayPageTemplatesPagesTest} from '../../../fixtures/displayPageTemplatesPagesTest';
import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {loginTest} from '../../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../../fixtures/pageEditorPagesTest';
import {pageViewModePagesTest} from '../../../fixtures/pageViewModePagesTest';
import {systemSettingsPageTest} from '../../../fixtures/systemSettingsPageTest';
import {uiElementsPageTest} from '../../../fixtures/uiElementsTest';
import {webContentDisplayPageTest} from '../../../fixtures/webContentDisplayPageTest';
import {workflowPagesTest} from '../../../fixtures/workflowPagesTest';
import getRandomString from '../../../utils/getRandomString';
import {normalizeRestPath} from '../../../utils/normalizeRestPath';
import {reloadUntilVisible} from '../../../utils/reloadUntilVisible';
import {enableLocalStaging} from '../../../utils/staging';
import getBasicWebContentStructureId from '../../../utils/structured-content/getBasicWebContentStructureId';
import {journalPagesTest} from '../../journal-web/main/fixtures/journalPagesTest';
import {exportImportConfig} from './export_import.config';
import {exportPageTest} from './fixtures/exportPageTest';
import {stagingConfigurationPageTest} from './fixtures/stagingConfigurationPageTest';
import {stagingPageTest} from './fixtures/stagingPageTest';
import {StageableEntities} from './utils/stagingConstants';
import {unzipAndCheckFolder} from './utils/stagingUtil';

const test = mergeTests(
	dataApiHelpersTest,
	featureFlagsTest({
		'LPD-35443': {enabled: true},
	}),
	loginTest(),
	assetPublisherPagesTest,
	assetPublisherWidgetPagesTest,
	collectionsPagesTest,
	displayPageTemplatesPagesTest,
	exportPageTest,
	journalPagesTest,
	pageEditorPagesTest,
	pageViewModePagesTest,
	stagingConfigurationPageTest,
	stagingPageTest,
	systemSettingsPageTest,
	webContentDisplayPageTest,
	workflowPagesTest,
	uiElementsPageTest
);

test('Staging only approved content goes to live', async ({
	apiHelpers,
	page,
	pageEditorPage,
	stagingPage,
	webContentDisplayPage,
	workflowPage,
	workflowTasksPage,
}) => {
	const site = await apiHelpers.headlessSite.createSite({
		name: `site-${getRandomString()}`,
	});

	apiHelpers.data.push({id: site.id, type: 'site'});

	const layout1 = await apiHelpers.jsonWebServicesLayout.addLayout({
		groupId: site.id,
		options: {type: 'content'},
		title: getRandomString(),
	});

	await pageEditorPage.goto(layout1, site.friendlyUrlPath);

	await pageEditorPage.addWidget('Content Management', 'Web Content Display');

	await pageEditorPage.publishPage();

	const layout2 = await apiHelpers.jsonWebServicesLayout.addLayout({
		groupId: site.id,
		options: {type: 'content'},
		title: getRandomString(),
	});

	await pageEditorPage.goto(layout2, site.friendlyUrlPath);
	await pageEditorPage.addWidget('Content Management', 'Web Content Display');
	await pageEditorPage.publishPage();

	await workflowPage.goto(site.friendlyUrlPath);
	await workflowPage.changeWorkflow('Web Content Article', 'Single Approver');

	await enableLocalStaging(apiHelpers, page, site, {
		branchingPrivate: true,
		branchingPublic: true,
	});

	const stagingSite =
		await apiHelpers.headlessAdminUser.getSiteByFriendlyUrlPath(
			`${site.friendlyUrlPath}-staging`
		);

	const webcontentContent1 = getRandomString();
	const webcontentContent2 = getRandomString();
	const basicWebcontentStructureId =
		await getBasicWebContentStructureId(apiHelpers);

	const webContent1 = await apiHelpers.jsonWebServicesJournal.addWebContent({
		content: webcontentContent1,
		ddmStructureId: basicWebcontentStructureId,
		groupId: stagingSite.id,
		titleMap: {en_US: getRandomString()},
	});
	const webContent2 = await apiHelpers.jsonWebServicesJournal.addWebContent({
		content: webcontentContent2,
		ddmStructureId: basicWebcontentStructureId,
		groupId: stagingSite.id,
		titleMap: {en_US: getRandomString()},
	});

	await pageEditorPage.goto(layout1, stagingSite.friendlyUrlPath);

	await webContentDisplayPage.addWebContentWithDisplay({
		pageType: 'content',
		webContentName: webContent1.title,
	});

	await pageEditorPage.publishPage();
	await pageEditorPage.goto(layout2, stagingSite.friendlyUrlPath);

	await webContentDisplayPage.addWebContentWithDisplay({
		pageType: 'content',
		webContentName: webContent2.title,
	});
	await pageEditorPage.publishPage();

	await workflowTasksPage.goto(site.friendlyUrlPath);
	await workflowTasksPage.goToAssignedToMyRoles();
	await workflowTasksPage.assignToMe(webContent1.title);
	await workflowTasksPage.goToAssignedToMyRoles();
	await workflowTasksPage.assignToMe(webContent2.title);
	await workflowTasksPage.approve(webContent1.title);

	await pageEditorPage.goto(layout1, stagingSite.friendlyUrlPath);
	await reloadUntilVisible({
		myLocator: page.getByText(webcontentContent1, {exact: true}),
		page,
	});
	await expect(
		page.getByText(webcontentContent1, {exact: true})
	).toBeVisible();

	await pageEditorPage.goto(layout2, stagingSite.friendlyUrlPath);
	await expect(
		page.getByText(`${webContent2.title} is not approved.`)
	).toBeVisible();

	await stagingPage.goto(`${site.name}-staging`);
	await stagingPage.publish();

	await pageEditorPage.goto(layout1, site.friendlyUrlPath);
	await reloadUntilVisible({
		myLocator: page.getByText(webcontentContent1, {exact: true}),
		page,
	});
	await expect(
		page.getByText(webcontentContent1, {exact: true})
	).toBeVisible();

	await pageEditorPage.goto(layout2, site.friendlyUrlPath);
	await expect(
		page.getByText(webcontentContent2, {exact: true})
	).toBeHidden();

	await workflowTasksPage.goto(site.friendlyUrlPath);
	await workflowTasksPage.approve(webContent2.title);

	await stagingPage.goto(`${site.name}-staging`);
	await stagingPage.publish();

	await apiHelpers.jsonWebServicesJournal.moveArticleToTrash(
		stagingSite.id,
		webContent2.articleId
	);

	await pageEditorPage.goto(layout2, site.friendlyUrlPath);

	await stagingPage.goto(`${site.name}-staging`);
	await stagingPage.publish();

	await pageEditorPage.goto(layout2, stagingSite.friendlyUrlPath);

	await expect(
		page.getByText(
			`The web content article ${webContent2.title} was moved to the Recycle Bin`
		)
	).toBeVisible();
});
