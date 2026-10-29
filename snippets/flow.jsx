export function Flow({ steps, }) {
    const iconMap = {
        search: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>),
        type: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5"/>
        <path d="M5 12H2"/>
        <path d="M22 12h-3"/>
        <path d="m6 9-3 3 3 3"/>
        <path d="m18 9 3 3-3 3"/>
      </svg>),
        eye: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>),
        repeat: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m17 2 4 4-4 4"/>
        <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
        <path d="m7 22-4-4 4-4"/>
        <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
      </svg>),
        describe: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>),
        agent: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/>
        <path d="M20 14h2"/>
        <path d="M15 13v2"/>
        <path d="M9 13v2"/>
      </svg>),
        list: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/>
        <path d="M15 3v4a2 2 0 0 0 2 2h4"/>
        <path d="M9 13h6"/>
        <path d="M9 17h3"/>
      </svg>),
    };
    return (<div className="not-prose my-8">
      {/* Desktop */}
      <div className="hidden items-stretch sm:flex">
        {steps.map((step, i) => (<div key={i} className="flex flex-1 items-stretch">
            <div className="flex flex-1 flex-col items-center gap-3 px-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-fd-border text-fd-muted-foreground">
                {iconMap[step.icon] ?? iconMap.search}
              </div>
              <span className="text-xs leading-snug text-fd-muted-foreground">
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (<div className="flex items-start pt-5">
                <svg width="40" height="1" viewBox="0 0 40 1" className="shrink-0" aria-hidden="true">
                  <line x1="0" y1="0.5" x2="40" y2="0.5" className="stroke-fd-border" strokeWidth="1" strokeDasharray="4 3"/>
                </svg>
              </div>)}
          </div>))}
      </div>
      {/* Mobile */}
      <div className="flex flex-col sm:hidden">
        {steps.map((step, i) => (<div key={i} className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fd-border text-fd-muted-foreground">
                {iconMap[step.icon] ?? iconMap.search}
              </div>
              <span className="text-sm text-fd-muted-foreground">
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (<div className="ml-4 flex h-6 items-center">
                <svg width="1" height="24" viewBox="0 0 1 24" aria-hidden="true">
                  <line x1="0.5" y1="0" x2="0.5" y2="24" className="stroke-fd-border" strokeWidth="1" strokeDasharray="4 3"/>
                </svg>
              </div>)}
          </div>))}
      </div>
    </div>);
}
