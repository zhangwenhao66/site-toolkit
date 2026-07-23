/**
 * Picks up to 6 "related guides" from the same category, using a rotating
 * window keyed off the current guide's position in its category — not a
 * fixed `.slice(0, 6)`.
 *
 * Why this matters (seo-geo-trinity history, 2026-07-11): a fixed
 * `.slice(0, 6)` always surfaces the same first 6 articles in a category,
 * so anything ranked 7th or later in that category's array NEVER gets
 * linked from any "related guides" sidebar. On beta (commsadvisor.com) this
 * meant 127 articles had only 28 ever been linked to internally, because
 * the Help Desk category alone had 77 articles and only the first 6
 * rotated through every sidebar. Likely root cause of repeated "orphan
 * page" / "starved internal links" incidents before this was found.
 *
 * If you change this algorithm, you MUST verify coverage before shipping —
 * run it across every guide in a category and confirm the union of all
 * `related` results covers close to 100% of that category (small
 * categories with <=6 peers are trivially covered; anything below ~80-90%
 * on a larger category means the rotation logic broke). See
 * `verifyRelatedGuidesCoverage` below for a ready-made check.
 *
 * Extracted from seo-geo-trinity's apps/*\/src/pages/[slug].astro on
 * 2026-07-23, where it was duplicated identically across all 4 sites.
 */

export interface RelatableGuide {
	slug: string;
	category: string;
}

export function pickRelatedGuides<T extends RelatableGuide>(
	allGuides: T[],
	current: T,
	max = 6,
): T[] {
	const categoryGuides = allGuides.filter((g) => g.category === current.category);
	const categoryPeers = categoryGuides.filter((g) => g.slug !== current.slug);
	const selfIndex = categoryGuides.findIndex((g) => g.slug === current.slug);

	if (categoryPeers.length <= max) {
		return categoryPeers;
	}
	return Array.from(
		{ length: max },
		(_, k) => categoryPeers[(selfIndex + k) % categoryPeers.length],
	);
}

/**
 * Verification helper matching the coverage-check pattern documented in
 * seo-geo-trinity's CLAUDE.md. Run this after any change to
 * `pickRelatedGuides` (or its `max` parameter) before shipping — coverage
 * should be close to 100% (isolated singletons in a tiny category aside).
 * A regression back down to ~20-30% means the same bug has resurfaced.
 */
export function verifyRelatedGuidesCoverage<T extends RelatableGuide>(
	allGuides: T[],
	max = 6,
): { total: number; linkedTo: number; coveragePct: number; neverLinked: string[] } {
	const linkedTo = new Set<string>();
	for (const guide of allGuides) {
		for (const related of pickRelatedGuides(allGuides, guide, max)) {
			linkedTo.add(related.slug);
		}
	}
	const neverLinked = allGuides.map((g) => g.slug).filter((slug) => !linkedTo.has(slug));
	return {
		total: allGuides.length,
		linkedTo: linkedTo.size,
		coveragePct: allGuides.length > 0 ? (linkedTo.size / allGuides.length) * 100 : 100,
		neverLinked,
	};
}
