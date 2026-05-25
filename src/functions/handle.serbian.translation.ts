import SerbianTransliteration from '@exvorn/serbian-transliteration';

const handleSerbianTranslation = (translations: Record<string, string>, availableColumns: string[]): Record<string, string> => {
	const result: Record<string, string> = {};

	if (availableColumns.includes('name_sr')) {
		if (translations.sr) result.name_sr = translations.sr;
		else if (translations['sr-Latn']) result.name_sr = SerbianTransliteration.toCyrillic(translations['sr-Latn']);
		else if (translations.hr) result.name_sr = SerbianTransliteration.toCyrillic(translations.hr);
	}

	if (availableColumns.includes('name_sr_latn')) {
		if (translations['sr-Latn']) result.name_sr_latn = translations['sr-Latn'];
		else if (translations.sr) result.name_sr_latn = SerbianTransliteration.toLatin(translations.sr);
		else if (translations.hr) result.name_sr_latn = translations.hr;
	}

	return result;
};
export default handleSerbianTranslation;
