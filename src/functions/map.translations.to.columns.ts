import handleSerbianTranslation from './handle.serbian.translation';

const mapTranslationsToColumns = (translations: Record<string, string>, availableColumns: string[]): Record<string, string> => {
	const result: Record<string, string> = {};

	// Standard mapping: extract language code from column name (name_en -> en)
	availableColumns.forEach((columnName: string) => {
		const langCode: string = columnName.replace('name_', '').replace('_', '-');
		const translation: string | undefined = translations[langCode];

		if (translation) result[columnName] = translation;
	});

	// Handle Serbian special cases
	const serbianTranslations: Record<string, string> = handleSerbianTranslation(translations, availableColumns);
	Object.assign(result, serbianTranslations);

	return result;
};
export default mapTranslationsToColumns;
