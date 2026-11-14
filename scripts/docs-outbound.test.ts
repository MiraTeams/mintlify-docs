import { expect, test } from 'bun:test';
import { judgeOutbound } from './docs-outbound';

const context = { selfHost: 'docs.miraday.ai', baseOrigin: 'https://docs.miraday.ai', method: 'POST' };
test('native Docs search works without granting analytics consent', () => {
  expect(judgeOutbound('https://leaves.mintlify.com/api/search/forward-ai-labs', context).allowed).toBe(true);
});
test('search rule does not allow other tenants, methods, or telemetry', () => {
  for (const url of [
    'https://leaves.mintlify.com/api/search/another-site',
    'https://leaves.mintlify.com/api/analytics',
    'https://leaves.mintlify.com.evil.test/api/search/forward-ai-labs',
    'https://us.i.posthog.com/e/',
    'https://www.google-analytics.com/g/collect',
  ]) expect(judgeOutbound(url, context).allowed).toBe(false);
  expect(judgeOutbound('https://leaves.mintlify.com/api/search/forward-ai-labs', { ...context, method: 'GET' }).allowed).toBe(false);
});
