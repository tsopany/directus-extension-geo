const hasEmptyTranslations = async (database: any, tableName: string, translationColumns: string[]): Promise<boolean> => {
	if (translationColumns.length === 0) return false;

	const conditions: string = translationColumns.map((col: string) => `${col} IS NULL`).join(' OR ');
	const query: string = `SELECT COUNT(*) as count
                           FROM ${tableName}
                           WHERE ${conditions}`;

	const {rows}: any = await database.raw(query);
	return Number.parseInt(rows[0].count, 10) > 0;
};
export default hasEmptyTranslations;
