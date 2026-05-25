import buildCountryData from './build.country.data';
import fetchCountryDetails from './fetch.country.details';
import hasEmptyTranslations from './has.empty.translations';
import getTranslationColumns from './get.translation.columns';
import mapTranslationsToColumns from './map.translations.to.columns';
import countryNeedsTranslations from './country.needs.translations';

interface Country {
	iso2: string;
	iso3: string;
	name: string;
	phonecode: string;
	currency: string;
}

const HEADERS: Record<string, string> = {
	'X-CSCAPI-KEY': process.env.COUNTRYSTATECITY_API_KEY ?? ''
};

const syncCountries = async (database: any, services: any): Promise<any> => {
	const {countries: countriesService} = services;

	// Discover translation columns once
	const translationColumns: string[] = await getTranslationColumns(database, 'countries');

	// Check if translations are needed
	const needsTranslations: boolean = translationColumns.length > 0 && (await hasEmptyTranslations(database, 'countries', translationColumns));

	// Fetch countries from external API
	const response: Response = await fetch('https://api.countrystatecity.in/v1/countries', {headers: HEADERS});
	const apiCountries: Country[] = (await response.json()) ?? [];
	const apiCount: number = apiCountries.length;

	const {rows}: any = await database.raw('SELECT COUNT(*) as count FROM countries');
	const dbCount: number = Number.parseInt(rows[0].count, 10);

	// Sync each country to database (INSERT or UPDATE)
	const syncResults: any[] = [];
	if (Array.isArray(apiCountries)) {
		for (const apiCountry of apiCountries) {
			const existingCountry: any = await countriesService.readByQuery({
				filter: {iso3: {_eq: apiCountry.iso3}},
				fields: ['id'],
				limit: 1
			});

			let countryDataObject: any;

			// Check if this specific country needs translations
			const thisCountryNeedsTranslations: boolean =
				needsTranslations && existingCountry.length > 0 && (await countryNeedsTranslations(database, existingCountry[0].id, translationColumns));

			if (thisCountryNeedsTranslations) {
				// Fetch detailed country data with translations
				const countryDetails: any = await fetchCountryDetails(apiCountry.iso2, HEADERS);
				const translations: Record<string, string> =
					typeof countryDetails.translations === 'string' ? JSON.parse(countryDetails.translations) : (countryDetails.translations ?? {});

				// Map translations to available columns
				const translationData = mapTranslationsToColumns(translations, translationColumns);

				// Build complete country data object
				countryDataObject = buildCountryData(apiCountry, translationData);
			} else {
				// Basic sync without translations
				countryDataObject = {
					iso2: apiCountry.iso2,
					iso3: apiCountry.iso3,
					name: apiCountry.name,
					currency: apiCountry.currency,
					phonecode: apiCountry.phonecode
				};
			}

			let dbCountryUpdateResult: any;
			if (existingCountry.length > 0) dbCountryUpdateResult = await countriesService.updateOne(existingCountry[0].id, countryDataObject);
			else dbCountryUpdateResult = await countriesService.createOne(countryDataObject);

			syncResults.push(dbCountryUpdateResult);
		}
	}

	return {
		message: needsTranslations ? 'Countries synced successfully with translations' : 'Countries synced successfully (no translations needed)',
		synced: syncResults.length,
		dbCount,
		apiCount,
		translationColumnsFound: translationColumns.length
	};
};
export default syncCountries;
