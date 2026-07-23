/**
 * Shared `@astrojs/sitemap` config (filter + serialize), extracted from
 * seo-geo-trinity's apps/*\/astro.config.mjs on 2026-07-23, where the exact
 * same filter/serialize functions were duplicated across all 4 sites'
 * config files.
 *
 * Usage in astro.config.mjs:
 *
 *   import sitemap from '@astrojs/sitemap';
 *   import { sitemapConfig } from '../../../site-toolkit/templates/sitemapConfig';
 *
 *   integrations: [
 *     sitemap(sitemapConfig()),
 *     // or with extra excluded paths for a given site:
 *     // sitemap(sitemapConfig({ excludePaths: ['/some-other-utility-page/'] })),
 *   ],
 */

export interface SitemapConfigOptions {
	/** Path fragments to exclude in addition to the shared defaults below. */
	excludePaths?: string[];
}

const DEFAULT_EXCLUDED_PATHS = ['/newsletter/', '/privacy/', '/terms/', '/disclosure/', '/disclaimer/'];

export function sitemapConfig(options: SitemapConfigOptions = {}) {
	const excluded = [...DEFAULT_EXCLUDED_PATHS, ...(options.excludePaths ?? [])];

	return {
		filter: (page: string) => !excluded.some((fragment) => page.includes(fragment)),
		serialize(item: { url: string; lastmod?: string }) {
			item.lastmod = new Date().toISOString();
			return item;
		},
	};
}
