const fetchCountryDetails = async (iso2: string, headers: Record<string, string>): Promise<any> => {
	const response: Response = await fetch(`https://api.countrystatecity.in/v1/countries/${iso2}`, {headers});
	return await response.json();
};
export default fetchCountryDetails;
