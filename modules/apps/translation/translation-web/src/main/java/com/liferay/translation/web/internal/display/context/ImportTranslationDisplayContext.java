/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.translation.web.internal.display.context;

import com.liferay.info.item.provider.InfoItemWorkflowProvider;
import com.liferay.petra.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.portlet.LiferayPortletResponse;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.portlet.PortletURL;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Adolfo Pérez
 */
public class ImportTranslationDisplayContext {

	public ImportTranslationDisplayContext(
		long classNameId, long classPK, long groupId,
		HttpServletRequest httpServletRequest,
		InfoItemWorkflowProvider<Object> infoItemWorkflowProvider,
		LiferayPortletResponse liferayPortletResponse, Object model,
		String title) {

		_classNameId = classNameId;
		_classPK = classPK;
		_groupId = groupId;
		_httpServletRequest = httpServletRequest;
		_infoItemWorkflowProvider = infoItemWorkflowProvider;
		_liferayPortletResponse = liferayPortletResponse;
		_model = model;
		_title = title;

		_importErrors = HashMapBuilder.put(
			"web-content-name-en_GB.xlf",
			"The ID of this file does not match" +
				" any of the currently used languages."
		).put(
			"web-content-name-en_US.xlf",
			"The ID of this file does not match" +
				" any of the currently used languages."
		).build();
		_importSuccess = Arrays.asList(
			"web-content-name-es_ES.xlf", "web-content-name-fr_FR.xlf",
			"web-content-name-it_IT.xlf");
	}

	public int getImportErrorsCount() {
		return _importErrors.size();
	}

	public Map<String, String> getImportErrorsMap() {
		return _importErrors;
	}

	public int getImportSuccessCount() {
		return _importSuccess.size();
	}

	public List<String> getImportSuccessEntries() {
		return _importSuccess;
	}

	public String getImportTranslationResetURL() {
		return "/import-translation-reset-url";
	}

	public PortletURL getImportTranslationURL() {
		return PortletURLBuilder.createActionURL(
			_liferayPortletResponse
		).setActionName(
			"/translation/import_translation"
		).setParameter(
			"classNameId", _classNameId
		).setParameter(
			"classPK", _classPK
		).setParameter(
			"groupId", _groupId
		).buildPortletURL();
	}

	public String getMustHaveValidIdMessage() {
		String className = PortalUtil.getClassName(_classNameId);

		if (className.equals(Layout.class.getName())) {
			return "the-translation-file-does-not-correspond-to-this-page";
		}

		return "the-translation-file-does-not-correspond-to-this-web-content";
	}

	public String getPublishButtonLabel() throws PortalException {
		if ((_infoItemWorkflowProvider == null) ||
			!_infoItemWorkflowProvider.isWorkflowEnabled(_model)) {

			return "publish";
		}

		return "submit-for-publication";
	}

	public String getRedirect() {
		if (Validator.isNotNull(_redirect)) {
			return _redirect;
		}

		_redirect = ParamUtil.getString(_httpServletRequest, "redirect");

		return _redirect;
	}

	public String getSaveButtonLabel() {
		if (_infoItemWorkflowProvider == null) {
			return "save";
		}

		int status = _infoItemWorkflowProvider.getStatus(_model);

		if ((status == WorkflowConstants.STATUS_APPROVED) ||
			(status == WorkflowConstants.STATUS_DRAFT) ||
			(status == WorkflowConstants.STATUS_EXPIRED) ||
			(status == WorkflowConstants.STATUS_SCHEDULED)) {

			return "save-as-draft";
		}

		return "save";
	}

	public String getTitle() throws PortalException {
		return _title;
	}

	public String getUploadedFileName() {
		return "web-content-name-translations.zip";
	}

	public boolean isPending() throws PortalException {
		if ((_infoItemWorkflowProvider == null) ||
			!_infoItemWorkflowProvider.isWorkflowEnabled(_model)) {

			return false;
		}

		if (_infoItemWorkflowProvider.getStatus(_model) ==
				WorkflowConstants.STATUS_PENDING) {

			return true;
		}

		return false;
	}

	private final long _classNameId;
	private final long _classPK;
	private final long _groupId;
	private final HttpServletRequest _httpServletRequest;
	private final Map<String, String> _importErrors;
	private final List<String> _importSuccess;
	private final InfoItemWorkflowProvider<Object> _infoItemWorkflowProvider;
	private final LiferayPortletResponse _liferayPortletResponse;
	private final Object _model;
	private String _redirect;
	private final String _title;

}