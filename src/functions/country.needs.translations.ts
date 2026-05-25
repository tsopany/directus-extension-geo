const countryNeedsTranslations = async (database: any, countryId: string, translationColumns: string[]): Promise<boolean> => {
	if (translationColumns.length === 0) return false;

	const conditions: string = translationColumns.map((col: string) => `${col} IS NULL`).join(' OR ');
	const query: string = `SELECT COUNT(*) as count FROM countries WHERE id = ? AND (${conditions})`;

	const {rows}: any = await database.raw(query, [countryId]);
	return Number.parseInt(rows[0].count, 10) > 0;
};
export default countryNeedsTranslations;
