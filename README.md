# Mintlify Starter Kit

Use the starter kit to get your docs deployed and ready to customize.

Click the green **Use this template** button at the top of this repo to copy the Mintlify starter kit. The starter kit contains examples with

- Guide pages
- Navigation
- Customizations
- API reference pages
- Use of popular components

**[Follow the full quickstart guide](https://starter.mintlify.com/quickstart)**

## AI-assisted writing

Set up your AI coding tool to work with Mintlify:

```bash
npx skills add https://mintlify.com/docs
```

This command installs Mintlify's documentation skill for your configured AI tools like Claude Code, Cursor, Windsurf, and others. The skill includes component reference, writing standards, and workflow guidance.

See the [AI tools guides](/ai-tools) for tool-specific setup.

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview your documentation changes locally. To install, use the following command:

```
npm i -g mint
```

Run the following command at the root of your documentation, where your `docs.json` is located:

```
mint dev
```

View your local preview at `http://localhost:3000`.

## Publishing changes

Install our GitHub app from your [dashboard](https://dashboard.mintlify.com/settings/organization/github-app) to propagate changes from your repo to your deployment. Changes are deployed to production automatically after pushing to the default branch.

## Need help?

### Troubleshooting

- If your dev environment isn't running: Run `mint update` to ensure you have the most recent version of the CLI.
- If a page loads as a 404: Make sure you are running in a folder with a valid `docs.json`.

### Resources
- [Mintlify documentation](https://mintlify.com/docs)

### Consent-controlled analytics

Google Analytics (`G-0F5EMJKSFL`) and PostHog (US region) use the public browser
configuration verified in the deployed `docs.mira.day` bundle on 2026-11-03.
`usercentrics.js` is generated; edit `scripts/telemetry.ts` and
`scripts/cookie-controls.js`, then rebuild with:

```sh
bun scripts/build-telemetry.ts
```

The build requires the sibling `../mira-docs` checkout and its installed Bun
dependencies. It bundles that project's consent lifecycle, request gate,
revocation cleanup, URL filtering and masked session recording. Sentry is disabled
in this integration. Keep analytics out of `docs.json` to avoid a second loader
that bypasses the consent runtime.

The current Usercentrics Ruleset and published regional Settings/service mapping
are reused from `mira-docs/infrastructure/blog-telemetry/config.ts`. The early
event and consent-persistence observers run before the CMP loader. Unknown or
implicit consent does not authorize analytics. In the current US regional setting,
clicking OK still leaves individual services IMPLICIT, so they remain blocked,
matching the source policy. Pageviews follow Mintlify
navigation events. The Cookie settings link follows Powered by Mintlify.

The generated file is a local deliverable; rebuilding does not publish the site.

The Mintlify build adds one necessary request rule in `scripts/docs-outbound.ts`:
`POST https://leaves.mintlify.com/api/search/forward-ai-labs`. This is the native
documentation search, so it works independently of analytics consent. Other
tenants, endpoint paths, and HTTP methods remain blocked; the shared App/Blog
network rules are unchanged. Verify with `bun test scripts/docs-outbound.test.ts`.
