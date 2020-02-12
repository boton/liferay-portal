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

import {ClayButtonWithIcon} from '@clayui/button';
import ClayProgressBar from '@clayui/progress-bar';
import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';

// import ClayCard from '@clayui/card';
import '../css/main.scss';

const noop = () => {};

function parse(req) {
	var result;
	try {
		result = JSON.parse(req.responseText);
	} catch (e) {
		result = req.responseText;
	}

	return result;
}

function openPreview(itemData) {
	const itemFile = itemData.file;
	const itemFileUrl = itemFile.url;
	let itemFileValue = itemFile.resolvedValue;

	if (!itemFileValue) {
		const imageValue = {
			fileEntryId: itemFile.fileEntryId,
			groupId: itemFile.groupId,
			title: itemFile.title,
			type: itemFile.type,
			url: itemFileUrl,
			uuid: itemFile.uuid
		};

		itemFileValue = JSON.stringify(imageValue);
	}

	Liferay.componentReady('ItemSelectorPreview').then(() => {
		Liferay.fire('updateCurrentItem', {
			url: itemFileUrl,
			value: itemFileValue
		});
	});
}

function sendFile({
	file,
	fileFieldName = 'imageSelectorFileName',
	onProgress = noop,
	onSuccess = noop,
	onError = noop,
	url
}) {
	var formData = new FormData();
	var request = new XMLHttpRequest();

	request.upload.addEventListener('progress', event => {
		onProgress(Math.trunc((event.loaded * 100.0) / event.total || 100));
	});

	request.addEventListener('readystatechange', () => {
		if (request.readyState === 4) {
			const response = parse(request);
			onProgress(null);
			if (request.status >= 200 && request.status < 300) {
				onSuccess(response);
			} else {
				onError(response);
			}
		}
	});

	formData.append(fileFieldName, file);
	request.open('POST', url);
	request.send(formData);

	return request;
}

function validateFile(acceptedFiles) {
	return acceptedFiles.map(file => ({
		file,
		preview: URL.createObjectURL(file)
	}));
}

function SingleUploader({maxFileSize, uploadItemURL, validExtensions}) {
	const [file, setFile] = useState();
	const [progress, setProgess] = useState(null);
	const [abort, setAbort] = useState(null);
	const {getInputProps, getRootProps} = useDropzone({
		accept: validExtensions,
		maxSize: maxFileSize,
		multiple: false,
		onDrop: acceptedFiles => {
			setFile(validateFile(acceptedFiles)[0]);
		}
	});

	function clear() {
		setFile(null);
		setAbort(null);
		setProgess(null);
	}

	useEffect(() => {
		if (file) {
			const client = sendFile({
				file: file.file,
				onProgress: setProgess,
				onSuccess: openPreview,
				url: uploadItemURL
			});

			setAbort(() => () => {
				clear();
				client.abort();
			});

			return () => {
				if (URL.revokeObjectURL) {
					URL.revokeObjectURL(file.preview);
				}
			};
		}
	}, [file, uploadItemURL]);

	return (
		<section>
			<div {...getRootProps({className: 'dropzone'})}>
				<input {...getInputProps()} />
				<span>
					<strong>NEW </strong> Drag &apos;n&apos; drop some file
					here, or click to select file
				</span>
			</div>
			{/* {file ? (
				<div className="mt-3 row">
					<div className="col-md-3">
						<ClayCard displayType="image">
							<ClayCard.AspectRatio className="card-item-first">
								<img
									className="aspect-ratio-item aspect-ratio-item-center-middle aspect-ratio-item-fluid"
									src={file.preview}
								/>
							</ClayCard.AspectRatio>
							<ClayCard.Body>
								<ClayCard.Row>
									<ClayCard.Description displayType="title">
										{file.file.name}
									</ClayCard.Description>
								</ClayCard.Row>
								{progress && (
									<ClayCard.Row>
										<ClayProgressBar
											className="w-100"
											value={progress}
										/>{' '}
										<ClayButtonWithIcon
											borderless
											displayType="secondary"
											onClick={abort}
											symbol="times"
										/>
									</ClayCard.Row>
								)}
							</ClayCard.Body>
						</ClayCard>
					</div>
				</div>
			) : null} */}
			{file ? (
				<div className="mt-3 row">
					<div className="col-md-3">
						<div className="card-type-asset form-check form-check-card image-card item-preview">
							<div className="card card-interactive">
								<div className="aspect-ratio card-item-first">
									<img
										alt=""
										className="aspect-ratio-item-center-middle aspect-ratio-item-fluid"
										src={file.preview}
									/>
								</div>
								<div className="card-body">
									<div className="card-row">
										<div className="autofit-col autofit-col-expand">
											<span
												className="card-title text-truncate"
												title={file.file.name}
											>
												{file.file.name}
											</span>
										</div>
									</div>
									{progress && (
										<div className="card-row">
											<div className="autofit-col autofit-col-expand">
												<ClayProgressBar
													className="w-100"
													value={progress}
												/>
											</div>
											<div className="autofit-col">
												<ClayButtonWithIcon
													borderless
													displayType="secondary"
													onClick={abort}
													symbol="times"
												/>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}

export default props => <SingleUploader {...props} />;
