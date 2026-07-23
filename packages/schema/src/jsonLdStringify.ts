/**
 * Serialize JSON-LD for safe embedding in <script> tags (prevents `</script>`
 * from breaking out of the tag). Copied from seo-geo-trinity's
 * `@trinity/content-utils` package during the 2026-07-23 site-toolkit
 * migration — kept as a standalone one-liner here so this package has no
 * dependency on seo-geo-trinity's internal workspace packages.
 */
export function jsonLdStringify(data: unknown): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}
