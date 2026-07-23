# Changelog

## 2026-07-23 — Initial extraction from seo-geo-trinity

Repo created fresh (no prior `独立站/site-toolkit` existed — checked before creating, per the migration kickoff plan). Source: `seo-geo-trinity` at commit `1849bbcb111c69f3b9aaf8de417168334d8468fe` (`1849bbc`, 2026-07-23, "feat(alpha): add per-article OG image generation, wire into Article schema").

**Extracted:**

- `packages/schema/` — all 10 files from `seo-geo-trinity/packages/ui/src/schema/*.astro` (Article, BreadcrumbList, Dataset, FAQPage, HowTo, Organization, Person, Product, Review, WebSite), byte-identical apart from one change: the `jsonLdStringify` import was rewired from `@trinity/content-utils` (a seo-geo-trinity-internal workspace package) to a new local `packages/schema/src/jsonLdStringify.ts` (same one-line implementation, copied so this package has zero dependency on seo-geo-trinity internals).
- `packages/related-guides/` — new file, not a direct copy. The rotating-window algorithm was duplicated identically across `apps/alpha/src/pages/[slug].astro`, `apps/beta/...`, `apps/gamma/...`, `apps/delta/...` (confirmed byte-identical via grep before extraction). Consolidated into one generic `pickRelatedGuides<T>()` function plus a new `verifyRelatedGuidesCoverage()` helper (not present in any site before this — added to make the coverage check CLAUDE.md already mandated for this algorithm a reusable function instead of a one-off script each time).
- `templates/sitemapConfig.ts` — new file. The `filter`/`serialize` functions passed to `@astrojs/sitemap` were duplicated identically across all 4 sites' `astro.config.mjs` (confirmed via grep before extraction). Consolidated into a `sitemapConfig()` factory with an `excludePaths` extension point for future sites.
- `templates/robots.txt.template` + `generateRobotsTxt.ts` — new files. The 4 sites' `public/robots.txt` were static files, not generated — near-identical except each site's own `Sitemap:` line, plus a cosmetic Disallow-line-order difference between alpha and the other three (functionally irrelevant, robots.txt directive order doesn't affect behavior). Not wired into any site's build yet; sites keep shipping their static file until individually migrated and verified byte-equivalent.
- `skills/humanizer/` — direct copy of `seo-geo-trinity/.agents/skills/humanizer` (a vendored, MIT-licensed third-party skill, © Siqi Chen — `.claude/skills/humanizer` in that repo is a symlink to the same directory, not a separate copy). LICENSE file preserved.

**Explicitly out of scope for this pass** (flagged to Owen before starting, confirmed to defer): `seo-geo-trinity/agents/schema` (a structured-data *validator* Astro integration — distinct from `packages/ui/src/schema`'s components, easy to confuse), `agents/redirects` (301 redirect generation), `agents/indexnow` (index-ping integration). All three are already shared across the 4 sites via relative imports (`../../agents/...`), not npm workspace packages. Candidates for a follow-up migration once this first pass is proven out — not migrating them now to keep this pass's blast radius smaller.

**Site migration status** (updated as each seo-geo-trinity site switches over to consuming this via submodule):

| Site | Status |
|---|---|
| beta (commsadvisor.com) | not started |
| gamma (hrpaypick.com) | not started |
| delta (cashflowpick.com) | not started |
| alpha (chinaabroadguide.com) | not started — deliberately last; only English/zh-CN site with a real, currently-recovering organic traffic trend (verified via GSC on 2026-07-23: 0 clicks in early June → 69-72 clicks/week and position ~13-14 by mid-July), migrate last and verify extra carefully |
| hollowvane | separate project/session, not tracked here yet |
