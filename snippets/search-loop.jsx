// 招聘流程「非直线」示意图：需求 → 寻访 → 证据 向前推进，
// 但每个阶段都会反过来影响上一个（相邻回环），且证据可一路打回起点。
// 专为 blog《Recruiting Was Never One Job》而写——现有 Flow 是线性带箭头，
// 表达不了这里的回环语义。配色走 fumadocs 中性 token，与站点主题一致。
// 节点用圆角矩形（不是圆）以完整容纳两行文字，箭头连到矩形边、不压文字。
export function SearchLoop({ nodes, back, caption, }) {
    const cx = [100, 310, 520];
    const W = 118;
    return (<figure className="not-prose my-8">
      <div className="rounded-xl border border-fd-border px-4 pb-2 pt-6">
        <svg viewBox="0 0 620 200" className="mx-auto block h-auto w-full max-w-[620px]" role="img" aria-label={caption}>
          <defs>
            <marker id="sl-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fill-fd-foreground"/>
            </marker>
            <marker id="sl-bwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fill-fd-muted-foreground"/>
            </marker>
          </defs>

          {/* nodes — rounded rectangles hold both lines of text */}
          <g textAnchor="middle">
            {cx.map((x, i) => (<g key={i}>
                <rect x={x - W / 2} y="37" width={W} height="46" rx="12" className="fill-fd-card stroke-fd-border"/>
                <text x={x} y="56" className="fill-fd-foreground text-diagram-label font-semibold">
                  {nodes[i]?.label}
                </text>
                <text x={x} y="71" className="fill-fd-muted-foreground text-diagram-caption">
                  {nodes[i]?.sub}
                </text>
              </g>))}
          </g>

          {/* forward: intake → sourcing → evidence */}
          <g fill="none" strokeWidth="1.8" className="stroke-fd-foreground" markerEnd="url(#sl-fwd)">
            <path d="M167 60 L243 60"/>
            <path d="M377 60 L453 60"/>
          </g>

          {/* adjacent feedback: each stage talks back to the one before it */}
          <g fill="none" strokeWidth="1.4" strokeDasharray="4 4" className="stroke-fd-muted-foreground" markerEnd="url(#sl-bwd)">
            <path d="M265 86 C 235 122, 178 122, 150 86"/>
            <path d="M475 86 C 445 122, 388 122, 360 86"/>
          </g>

          {/* long feedback: evidence can send you back to the start */}
          <g fill="none" strokeWidth="1.2" strokeDasharray="3 5" className="stroke-fd-muted-foreground/60" markerEnd="url(#sl-bwd)">
            <path d="M500 88 C 395 176, 225 176, 120 88"/>
          </g>

          {/* what the feedback means — bg-colored halo (paint-order:stroke)
            so the dashed feedback line breaks around the label text */}
          <g textAnchor="middle" className="fill-fd-muted-foreground stroke-fd-background [paint-order:stroke] [stroke-linejoin:round] [stroke-width:5px]">
            <text x="205" y="108" className="text-diagram-caption">
              {back[0]}
            </text>
            <text x="415" y="108" className="text-diagram-caption">
              {back[1]}
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-xs leading-relaxed text-fd-muted-foreground">
        {caption}
      </figcaption>
    </figure>);
}
