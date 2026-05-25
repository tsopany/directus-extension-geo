const buildCountryData = (apiCountry: any, translationData: Record<string, string>): Record<string, any> => {
	return {
		iso2: apiCountry.iso2,
		iso3: apiCountry.iso3,
		name: apiCountry.name,
		currency: apiCountry.currency,
		phonecode: apiCountry.phonecode,
		...translationData
	};
};
export default buildCountryData;
