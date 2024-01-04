/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

test('test', async ({page}) => {
	await page.goto('http://localhost:8080/');
	await page.getByRole('button', {name: 'Sign In'}).click();
	await page.getByLabel('Email Address').click();
	await page.getByLabel('Email Address').fill('test@liferay.com');
	await page.getByLabel('Password').fill('test');
	await page.getByLabel('Remember Me').check();
	await page
		.getByLabel('Sign In- Loading')
		.getByRole('button', {name: 'Sign In'})
		.click();
	await page.goto('http://localhost:8080/');
	await page.getByLabel('Control Menu').getByRole('button').nth(4).click();
	await page.getByLabel('Open Applications MenuCtrl+⌥+A').click();
	await page.getByRole('tab', {name: 'Control Panel'}).click();
	await page.getByRole('menuitem', {name: 'Data Sets'}).click();
	await page.getByLabel('New Data Set').click();
	await page.getByLabel('NameRequired').click();
	await page.getByLabel('NameRequired').fill('dts');
	await page.getByLabel('REST ApplicationRequired').click();
	await page.getByRole('option', {name: '/data-engine/v2.0'}).click();
	await page.getByRole('button', {name: 'Save'}).click();
});
