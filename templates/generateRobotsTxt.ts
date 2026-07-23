/**
 * Generates robots.txt content from ./robots.txt.template.
 *
 * All 4 seo-geo-trinity sites had near-identical static `public/robots.txt`
 * files (2026-07-23 audit) — the only real difference was each site's own
 * `Sitemap:` line, plus a cosmetic difference in Disallow line order between
 * alpha and the other three (functionally irrelevant — robots.txt directive
 * order within a User-agent block doesn't change behavior). This generator
 * standardizes on one canonical order and parameterizes only the sitemap
 * URL, so future rule changes (e.g. adding a new AI crawler) happen once
 * here instead of being hand-edited into 4 (or more, once hollowvane is on
 * this too) separate static files.
 *
 * Usage (e.g. in a small build script, or manually when robots.txt needs
 * to change): read the template, substitute, write to `public/robots.txt`.
 * Not wired into any site's build pipeline yet as of the 2026-07-23
 * extraction — sites still ship the static file until migrated; this
 * generator's output should be verified byte-for-byte equivalent (modulo
 * the Disallow line order, already confirmed harmless) before a site
 * switches over.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TEMPLATE_PATH = fileURLToPath(new URL('./robots.txt.template', import.meta.url));

export function generateRobotsTxt(sitemapUrl: string): string {
	const template = readFileSync(TEMPLATE_PATH, 'utf-8');
	return template.replace('{{SITEMAP_URL}}', sitemapUrl);
}
