/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayModal from '@clayui/modal';
import { openToast } from 'frontend-js-components-web';
import { fetch } from 'frontend-js-web';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import BaseAPIEndpointFields from '../baseComponents/BaseAPIEndpointFields';
import { HTTP_METHODS, RETRIEVE_TYPES, STR_BLANK } from '../utils/constants';
import { headers } from '../utils/fetchUtil';
import { beginStringWithForwardSlash } from '../utils/string';
import { useFormik } from 'formik';
import { FieldPicker, FieldText } from '../fieldComponents';
import { required, requiredMessage, validate } from '../fieldComponents/utils/validations';

function getInitialValues() {
	return {
		httpMethod: '',
		scope: '',
		path: '',
		description: '',
	};
}

interface CreateAPIEndpointModalProps {
	apiApplicationBaseURL: string;
	apiEndpointsURLPath: string;
	basePath: string;
	closeModal: voidReturn;
	currentAPIApplicationId: string | null;
	loadData: voidReturn;
	setMainEndpointNav: Dispatch<SetStateAction<MainNav>>;
}

export function CreateAPIEndpointForm({
	apiApplicationBaseURL,
	apiEndpointsURLPath,
	basePath,
	closeModal,
	currentAPIApplicationId,
	loadData,
	setMainEndpointNav,
}: CreateAPIEndpointModalProps) {
	const { handleSubmit, values, handleChange, setFieldValue, touched, errors } = useFormik({
		initialValues: {
			httpMethod: '',
			scope: '',
			path: '',
			description: '',
		},
		onSubmit: postData,
		validate: (values) => {
			return validate(
				{
					httpMethod: requiredMessage(Liferay.Language.get('please-select-a-method')),
					scope: requiredMessage(Liferay.Language.get('please-select-a-scope')),
					path: requiredMessage(Liferay.Language.get('please-enter-a-path')),
				},
				values
			)
		}
	});

	async function postData(values: any) {
		fetch(apiEndpointsURLPath, {
			body: JSON.stringify({
				...values,
				applicationStatus: { key: 'unpublished' },
				httpMethod: {
					key: values.httpMethod,
				},
				name: values.path,
				...(values.path && {
					path: beginStringWithForwardSlash(
						values.path
					),
				}),
				r_apiApplicationToAPIEndpoints_l_apiApplicationId:
					currentAPIApplicationId,
				...(values.scope && {
					scope: { key: values.scope },
				}),
				version: '1.0',
			}),
			headers,
			method: 'POST',
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				else {
					throw response.json();
				}
			})
			.then((responseJSON) => {
				loadData();
				closeModal();
				setMainEndpointNav({ edit: responseJSON.id });
				openToast({
					message: Liferay.Language.get(
						'new-api-application-endpoint-was-created'
					),
					type: 'success',
				});
			})
			.catch((error) => {
				error.then((response: { message: string; title: string }) => {
					{
						openToast({
							message: response.title ?? response.message,
							type: 'danger',
						});
					}
				});
			});
	}

	return (
		<>
			<ClayModal.Header>
				{Liferay.Language.get('new-api-endpoint')}
			</ClayModal.Header>

			<form onSubmit={handleSubmit} id='createAPIEndpointForm'>
				<div className="modal-body">
					<FieldPicker
						items={[
							{ value: 'get', label: Liferay.Language.get('get') },
							{
								value: 'post',
								label: Liferay.Language.get('post'),
							},
						]}
						label={Liferay.Language.get('method')}
						name="httpMethod"
						onSelectionChange={(value: string) => {
							setFieldValue('httpMethod', value);
						}}
						required
						selectedKey={values.httpMethod}
						errorMessage={touched.httpMethod ? errors.httpMethod : undefined}
					/>
					<FieldPicker
						items={[
							{
								value: 'site',
								label: Liferay.Language.get('site')
							},
							{
								value: 'company',
								label: Liferay.Language.get('company'),
							},
						]}
						label={Liferay.Language.get('scope')}
						name="scope"
						onSelectionChange={(value: string) => {
							setFieldValue('scope', value);
						}}
						required
						selectedKey={values.scope}
						errorMessage={touched.scope ? errors.scope : undefined}
					/>
					<FieldText
						helpMessage='http://localhost:8080/o/c/'
						label={Liferay.Language.get('path')}
						name="path"
						onChange={handleChange}
						placeholder='Path'
						prepend='/'
						required
						value={values.path}
						errorMessage={touched.path ? errors.path : undefined}
					/>
					<FieldText
						label={Liferay.Language.get('description')}
						name="description"
						onChange={handleChange}
						placeholder='Description'
						type='textarea'
						value={values.description}
						errorMessage={touched.description ? errors.description : undefined}
					/>

				</div>
			</form>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							id="modalCancelButton"
							onClick={closeModal}
							type="button"
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="primary"
							id="modalCreateButton"
							type="submit"
							form="createAPIEndpointForm"
						>
							{Liferay.Language.get('create')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
}
