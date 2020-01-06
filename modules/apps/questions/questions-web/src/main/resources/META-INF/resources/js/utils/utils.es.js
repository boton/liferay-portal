export function dateToInternationalHuman(
	ISOString,
	localeKey = navigator.language
) {
	const date = new Date(ISOString);

	const options = {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	};

	const intl = new Intl.DateTimeFormat(localeKey, options);

	return intl.format(date);
}