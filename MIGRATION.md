# MiraDay migration from Fumadocs

Source: https://github.com/mira-agents/mira-docs at
`a67b1f48585690d8b021e1a70a6c619defe1047c` (main).
Target: https://github.com/mirateams/mintlify-docs.

- 128 documentation pages: 32 each in English, simplified Chinese,
  traditional Chinese and Japanese.
- 16 blog pages, including the four localized landing pages. Blog card
  collections are materialized from existing article metadata; upcoming topics
  and the documentation CTA retain the source locale copy.
- Existing wording, FAQ and how-to metadata, screenshots and article artwork
  retained. Fumadocs components are converted to Mintlify components. Flow and
  SearchLoop are ported as local JSX snippets.
- Source paths `/{language}/docs/...` and `/{language}/blog/...` retained.
  Section-index and previous starter URLs redirect to the matching new pages.
- This comparison uses Mintlify's native Mint theme with default fonts,
  layout, cards, callouts and background, retaining the neutral brand palette
  and logo. Custom CSS is limited to the migrated diagrams and upcoming posts.
  The Next.js
  application shell cannot be copied unchanged into hosted Mintlify.
- The existing Next.js consent/analytics runtime and server API routes are
  not copied; migrating those requires a separate deployment integration.

## Blog separation — 2026-10-30

The current Mintlify site contains documentation only. The four blog tabs,
16 localized blog MDX pages and blog cover assets were removed after backup.
The logo links to https://miraday.ai. Documentation content and base styles
remain unchanged.

The complete state before removal is retained at commit
`ad11928b0b996c97a27a904076e09d70c3580b4a` on branch
[`backup/blog-before-wordpress-2026-10-30`](https://github.com/MiraTeams/mintlify-docs/tree/backup/blog-before-wordpress-2026-10-30).
A separate ZIP backup contains the articles, original cover images, diagram
components, old config, link inventory and checksums. WordPress import is a
separate step; these MDX components are not a WordPress WXR import file.
The migration script now imports documentation only so it cannot reintroduce
the blog into this site.

## Validation

Run with Node.js 24 LTS:

```sh
mint validate --no-build --format json
mint broken-links
mint validate
mint dev --no-open
```

Offline page/navigation/import validation and link checks are performed locally.
Full build and visual verification require a writable `~/.mintlify` preview
cache, which the current agent sandbox does not permit. Check the hosted
preview in all four languages, on desktop/mobile, and in light/dark modes
before merging.

No changes to the Fumadocs source repository are needed. The starter site is
preserved in this repository's Git history; revert the migration commit to
restore it.

## Usercentrics on Mintlify — 2026-10-30

`usercentrics.js` loads Web CMP v3 with the original Settings ID
`C1H8pFgAIf4I7k`, disables CMP interaction analytics, and adds a localized
Cookie settings control after the document content. It follows
`mintlify:navigate` and the official `__ucCmp` API for soft-navigation language
updates and preference reopening. The original Next.js runtime is not copied.

No GA, PostHog or Sentry SDK is added. Mintlify telemetry is explicitly disabled
in docs.json (and in the migration generator), which also disables Mintlify
page-feedback features. Custom JavaScript runs after interactivity and cannot
serve as a pre-load blocker for independently enabled native integrations.
Future analytics integrations need a separate consent-aware lifecycle and
network verification. The Usercentrics configuration and registered domains
remain managed in the Usercentrics dashboard.
