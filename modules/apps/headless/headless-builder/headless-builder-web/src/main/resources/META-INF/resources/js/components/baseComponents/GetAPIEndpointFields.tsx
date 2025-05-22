/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import {Text} from '@clayui/core';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {Dispatch, SetStateAction, useState} from 'react';

import {Select} from '../fieldComponents/Select';
import {HTTP_METHODS, RETRIEVE_TYPES, STR_BLANK} from '../utils/constants';
import {
	makeURLPathParameterString,
	makeURLPathStringWithForwardSlashes,
	removeLeadingForwardSlash,
	stringBetweenCurlyBraces,
} from '../utils/string';

// interface GetApiEndpointFieldsProps {
// 	handleDropdownChange: any;
// 	displayError: any;
//     endpointPathHostTextPreview: any;
//     scopeOptions: any;
//     setScopeOptions: any;
//     setSelectedScope: any;
//     selectedScope: any; 
//     endpointPathLabel: any;
//     data: any;
//     setData: any;
//     selectedHttpMethod: any;
// }

export default function GetApiEndpointFields({
	handleDropdownChange,
    displayError,
    scopeOptions,
    endpointPathHostTextPreview,
    setSelectedScope,
    selectedScope,
    endpointPathLabel,
    data,
    setData,
    selectedHttpMethod,
    pathHasErrors,
    endpointParameterLabel,
    selectedRetrieveType,
    pathErrorMessage
}: any) {

	return (
        <>
            <ClayForm.Group
                className={classNames({
                    'has-error': displayError.scope,
                })}
            >
                <label htmlFor="selectTrigger">
                    {Liferay.Language.get('scope')}

                    <span className="ml-1 reference-mark text-warning">
                        <ClayIcon symbol="asterisk" />
                    </span>
                </label>

                <Select
                    disabled={false}
                    dropDownSearchAriaLabel={Liferay.Language.get(
                        'search-for-an-object-definition-or-use-the-arrow-keys-to-navigate-and-select-an-object-definition-from-the-list'
                    )}
                    invalid={displayError.scope}
                    onClick={(value) =>
                        handleDropdownChange(
                            'scope',
                            value,
                            scopeOptions,
                            setSelectedScope
                        )
                    }
                    options={scopeOptions}
                    placeholder={Liferay.Language.get('select-scope')}
                    required
                    searchable={false}
                    selectedOption={selectedScope}
                    triggerAriaLabel={
                        !selectedScope
                            ? Liferay.Language.get(
                                    Liferay.Language.get('select-scope')
                                )
                            : sub(
                                    Liferay.Language.get('scope-x-is-selected'),
                                    selectedScope.label
                                )
                    }
                />

                {displayError.scope && (
                    <ClayAlert
                        className="mt-2"
                        displayType="danger"
                        title={Liferay.Language.get('please-select-a-scope')}
                        variant="feedback"
                    ></ClayAlert>
                )}
            </ClayForm.Group>

            <ClayForm.Group>
                <label htmlFor="endpointPathField">
                    {Liferay.Language.get('path')}

                    <span className="ml-1 reference-mark text-warning">
                        <ClayIcon symbol="asterisk" />
                    </span>
                </label>

                <Text as="p" color="secondary" id="hostTextPreview" size={3}>
                    {endpointPathHostTextPreview}
                </Text>

                <ClayInput.Group>
                    <ClayInput.GroupItem prepend shrink>
                        <ClayInput.GroupText>/</ClayInput.GroupText>
                    </ClayInput.GroupItem>

                    <ClayInput.GroupItem
                        append
                        className={classNames({
                            'has-error': displayError.path,
                        })}
                    >
                        <ClayInput
                            aria-label={endpointPathLabel}
                            id="endpointPathField"
                            onChange={({target: {value}}) =>
                                setData((previousData) => ({
                                    ...previousData,
                                    path: makeURLPathStringWithForwardSlashes(
                                        value
                                    ),
                                }))
                            }
                            placeholder={endpointPathLabel}
                            type="text"
                            value={
                                data.path
                                    ? removeLeadingForwardSlash(data.path)
                                    : STR_BLANK
                            }
                        />
                    </ClayInput.GroupItem>

                    {selectedHttpMethod?.value === HTTP_METHODS.GET &&
                        selectedRetrieveType?.value ===
                            RETRIEVE_TYPES.SINGLE_ELEMENT && (
                            <>
                                <ClayInput.GroupItem
                                    prepend
                                    shrink
                                    style={{marginLeft: 0}}
                                >
                                    <ClayInput.GroupText>/</ClayInput.GroupText>
                                </ClayInput.GroupItem>

                                <ClayInput.GroupItem
                                    append
                                    className={classNames({
                                        'has-error': displayError.parameter,
                                    })}
                                >
                                    <ClayInput
                                        aria-label={endpointParameterLabel}
                                        id="endpointParameterField"
                                        onBlur={() =>
                                            setData((previousData) => ({
                                                ...previousData,
                                                parameter:
                                                    stringBetweenCurlyBraces(
                                                        removeLeadingForwardSlash(
                                                            previousData.parameter!
                                                        )
                                                    ),
                                            }))
                                        }
                                        onChange={({target: {value}}) =>
                                            setData((previousData) => ({
                                                ...previousData,
                                                parameter:
                                                    makeURLPathParameterString(
                                                        value
                                                    ),
                                            }))
                                        }
                                        placeholder={endpointParameterLabel}
                                        type="text"
                                        value={
                                            data.parameter
                                                ? removeLeadingForwardSlash(
                                                        data.parameter
                                                    )
                                                : STR_BLANK
                                        }
                                    />
                                </ClayInput.GroupItem>
                            </>
                        )}
                </ClayInput.Group>

                {pathHasErrors && (
                    <ClayAlert
                        className="mt-2"
                        displayType="danger"
                        title={pathErrorMessage}
                        variant="feedback"
                    ></ClayAlert>
                )}
            </ClayForm.Group>
        </>
	);
}
