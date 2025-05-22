/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

type ValidationFunction = (value: any) => string | undefined;
type ValidationSchema = Record<string, ValidationFunction[] | ValidationFunction>;

const required: ValidationFunction = (value) => {
	if (!value) {
		return Liferay.Language.get('this-field-is-required');
	}
};

export const requiredMessage = (errorMessage: string = Liferay.Language.get('this-field-is-required')) => {
	return (value: string) => {
		if (!value.trim()) {
			return errorMessage;
		}
	};
};

const validate = (
	fields: ValidationSchema,
	values: Record<string, any>
): Record<string, string> => {
	const errors: Record<string, string> = {};
	Object.entries(fields).forEach(([inputName, validations]) => {
		(Array.isArray(validations) ? validations : [validations]).some((validation) => {
			const error = validation(values[inputName]);
			
			if (error) {
				errors[inputName] = error;
			}
			
			return Boolean(error);
		});
	});
	
	return errors;
};

export { required, validate};
