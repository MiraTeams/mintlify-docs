import { projectNetworkRules, type OutboundContext, type OutboundVerdict } from '../../mira-docs/lib/consent/outbound';
import { classifyOutbound } from '../../mira-docs/lib/consent/core/outbound';
import type { ServiceKey } from '../../mira-docs/lib/consent/services';

/** The documentation search is a user-requested feature, not analytics. */
export function judgeOutbound(url: string, context: OutboundContext): OutboundVerdict {
  const baseOrigin = context.baseOrigin ?? `https://${context.selfHost}`;
  const rules = projectNetworkRules(baseOrigin, context.config);
  rules.necessary.push({
    origins: ['https://leaves.mintlify.com'],
    path: /^\/api\/search\/forward-ai-labs\/?$/,
    methods: ['POST'],
  });
  const verdict = classifyOutbound(url, {
    baseOrigin, method: context.method, permit: context.permit, ...rules,
  });
  return verdict.allowed ? verdict : { allowed: false, host: verdict.host, service: verdict.scope as ServiceKey | null };
}
