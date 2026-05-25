# directus-extension-geo

Directus endpoint extension that syncs countries from [Country State City API](https://countrystatecity.in/) into a `countries` collection, with optional translation columns (`name_*`) and Serbian transliteration support.

## Requirements

- Directus `^11.15.0`
- A `countries` collection (fields used: `iso2`, `iso3`, `name`, `currency`, `phonecode`, plus optional `name_*` translation columns)
- Environment variable `COUNTRYSTATECITY_API_KEY` (API key from Country State City)

## Install

**Local extension folder** (route `/geo/`):

```bash
git clone https://github.com/tsopany/directus-extension-geo.git extensions/geo
cd extensions/geo
pnpm i
pnpm build
```

**From GitHub** (package name `geo`; install into Directus `extensions/geo` or link per your setup):

```bash
pnpm add github:tsopany/directus-extension-geo
```

Restart Directus after install.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/geo/` | API info (authenticated) |
| GET | `/geo/countries` | Sync all countries from the external API |
| GET | `/geo/country/:iso2` | Read one country by ISO2 code |

## Development

```bash
pnpm i
pnpm dev
pnpm build
pnpm validate
```

## License

Unlicense — see [LICENSE](LICENSE).
