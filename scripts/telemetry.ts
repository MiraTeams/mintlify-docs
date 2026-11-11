import { startBrowserRuntime, reportCurrentPage } from '../../mira-docs/lib/consent/browser-runtime';
import { createConsentStore } from '../../mira-docs/lib/consent/store';
import { readTelemetryConfig } from '../../mira-docs/lib/consent/telemetry-config';
import { BLOG_CMP_BINDING, BLOG_SERVICE_IDS } from '../../mira-docs/infrastructure/blog-telemetry/config';
import { mountCookieControls } from './cookie-controls.js';
import { installCmpConsentSync } from '../../mira-docs/lib/consent/cmp-sync';

// Public browser configuration verified against docs.mira.day on 2026-11-03.
export const telemetry = readTelemetryConfig({
  ga4Enabled: 'true', ga4MeasurementId: 'G-0F5EMJKSFL',
  posthogEnabled: 'true', posthogKey: 'phc_BNEkYrebLHidPUu5xFFd2vaU78r6diSfeRm7jdtaifWA',
  posthogHost: 'https://us.i.posthog.com', posthogRecording: 'true',
  sentryEnabled: 'false',
});

const source = createConsentStore({
  binding: BLOG_CMP_BINDING, supportedTypes: ['GDPR', 'US'], serviceIds: BLOG_SERVICE_IDS,
});
startBrowserRuntime(telemetry, source);
installCmpConsentSync({ binding: BLOG_CMP_BINDING, supportedTypes: ['GDPR', 'US'] });
mountCookieControls();
reportCurrentPage();
window.addEventListener('mintlify:navigate', reportCurrentPage);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') reportCurrentPage();
});
