import {defineEndpoint} from '@directus/extensions-sdk';

import syncCountries from './functions/sync.countries';

// http://localhost:8065/geo
// https://app.countrystatecity.in/
// https://docs.countrystatecity.in/api/examples
export default defineEndpoint((router: any, {database, services, getSchema}: any): void => {
	const {ItemsService} = services;

	// GET /geo - Sync countries from API to database
	router.get('/', async (req: any, res: any): Promise<void> => {
		const userRoleID: any = req.accountability?.role;
		if (!userRoleID) return res.status(401).send('Not authenticated');

		const {rows}: any = await database.raw('SELECT id, name, description FROM directus_roles where id = ?', [userRoleID]);
		if (rows.length === 0) return res.status(401).send('Not authenticated');
		const userRole: any = rows[0];

		res.send({
			description: 'This API synchronizes Countries with https://countrystatecity.in/.',
			access: 'Only She:Matic Administrators have access to these API endpoints.',
			routes: {
				welcome: '/geo/',
				countries: '/geo/countries',
				country: '/geo/country/:iso2'
			},
			role: userRole.name,
			admin: 'Administrator' === userRole.name
		});
	});

	// GET /geo/countries - Sync countries from API to database
	router.get('/countries', async (req: any, res: any): Promise<void> => {
		try {
			const services: any = {
				countries: new ItemsService('countries', {
					schema: await getSchema(),
					accountability: req.accountability
				})
			};

			const result: any = await syncCountries(database, services);
			res.send(result);
		} catch (error: any) {
			res.status(500).json({
				error: 'Failed to sync countries',
				details: error.message
			});
		}
	});

	// GET /geo/country/:iso2 - Get a single country by ISO2 code
	router.get('/country/:iso2', async (req: any, res: any): Promise<void> => {
		try {
			const countriesService = new ItemsService('countries', {
				schema: await getSchema(),
				accountability: req.accountability
			});

			const results = await countriesService.readByQuery({
				filter: {iso2: {_eq: req.params.iso2.toUpperCase()}},
				limit: 1
			});

			if (results.length === 0) return res.status(404).json({error: 'Country not found'});
			res.json(results[0]);
		} catch (error: any) {
			res.status(500).json({error: 'Failed to fetch country', details: error.message});
		}
	});
});
