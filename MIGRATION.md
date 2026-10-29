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
