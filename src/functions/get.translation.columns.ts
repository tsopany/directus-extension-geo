const getTranslationColumns = async (database: any, tableName: string): Promise<string[]> => {
	const query: string = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ?
          AND column_name LIKE 'name_%'
        ORDER BY column_name
	`;

	const {rows}: any = await database.raw(query, [tableName]);
	return rows.map((row: any) => row.column_name);
};
export default getTranslationColumns;
