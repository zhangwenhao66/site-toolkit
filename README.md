# site-toolkit

Shared technical implementation for the 独立站 (indie site) portfolio — currently `seo-geo-trinity` (chinaabroadguide.com, commsadvisor.com, hrpaypick.com, cashflowpick.com) and the in-progress `hollowvane` project.

**Shared code, not shared runtime.** This is a standalone repo. Each consuming site pins a `git submodule` at a specific commit and updates deliberately — a change here does not automatically ripple into an already-deployed site.

## What's here

| Path | What it is | Extracted from |
|---|---|---|
| `packages/schema/` | Schema.org JSON-LD Astro components (Article, Review, FAQPage, BreadcrumbList, HowTo, Product, Dataset, Organization, Person, WebSite) | `seo-geo-trinity/packages/ui/src/schema/` (2026-07-23) |
| `packages/related-guides/` | Rotating-window "related guides" selection algorithm + coverage verification helper | `seo-geo-trinity/apps/*/src/pages/[slug].astro` (2026-07-23, was duplicated identically 4x) |
| `packages/sitemap-config/` | Shared `@astrojs/sitemap` filter/serialize config factory (`excludePaths` option covers per-site customization — import, don't fork) | `seo-geo-trinity/apps/*/astro.config.mjs` (2026-07-23, was duplicated identically 4x) |
| `templates/robots.txt.template` + `generateRobotsTxt.ts` | Parameterized robots.txt template + generator — lives in `templates/` rather than `packages/` because robots rules (which bots to block, extra Disallow paths) are more likely to genuinely diverge per site than sitemap config is; treat as a copy-and-adjust starting point, not a stable import | `seo-geo-trinity/apps/*/public/robots.txt` (2026-07-23, sites previously shipped 4 near-identical static files) |
| `skills/humanizer/` | Claude Code skill for removing AI-writing tells from text (MIT licensed, © Siqi Chen — see `skills/humanizer/LICENSE`) | `seo-geo-trinity/.agents/skills/humanizer` (2026-07-23) |

Explicitly **not** included yet (seo-geo-trinity also has these, but they were out of scope for the first migration pass — see `CHANGELOG.md`): the `agents/schema` structured-data *validator* integration, `agents/redirects`, and `agents/indexnow` Astro integrations. These live in `seo-geo-trinity/agents/` and are candidates for a later migration once this first pass has proven out.

## Using this in a site

```bash
git submodule add <this-repo-url> vendor/site-toolkit
git submodule update --init --remote  # then pin to a specific commit deliberately, don't auto-track
```

Then import directly from the submodule path, e.g.:

```astro
import Article from '../../vendor/site-toolkit/packages/schema/src/Article.astro';
```

```ts
import { pickRelatedGuides } from '../../vendor/site-toolkit/packages/related-guides/src/index.ts';
import { sitemapConfig } from '../../vendor/site-toolkit/packages/sitemap-config/src/index.ts';
```

See `CHANGELOG.md` for the migration history and which seo-geo-trinity sites have switched over so far.
