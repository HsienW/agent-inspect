export function TerminalDemo() {
  return (
    <div className="rounded-2xl border border-border bg-[#0b1220] p-1 shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-xs text-slate-400">
          agent-inspect · local terminal
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-5 text-slate-200 sm:text-[13px] sm:leading-6">
        <code>
          <span className="text-slate-500">$ </span>
          <span>npx agent-inspect list --dir .agent-inspect</span>
          {"\n"}
          <span className="text-rose-300">run_abc123</span>
          <span>  failed  186ms</span>
          {"\n\n"}
          <span className="text-slate-500">$ </span>
          <span>npx agent-inspect report run_abc123 --dir .agent-inspect</span>
          {"\n"}
          <span className="text-rose-300">✗</span>
          <span> first causal failure: tool &quot;refund&quot; → error</span>
          {"\n"}
          <span className="text-slate-500">  parent: support-agent · siblings: 2 tools</span>
          {"\n\n"}
          <span className="text-slate-500">$ </span>
          <span>npx agent-inspect mcp configure --client cursor</span>
          {"\n"}
          <span className="text-success">✓</span>
          <span> dry-run config (stdio → @agent-inspect/mcp-server)</span>
          {"\n"}
          <span className="text-slate-500">  ask agent: get_first_causal_failure</span>
          {"\n\n"}
          <span className="text-slate-500">$ </span>
          <span>npx agent-inspect check run_abc123 --dir .agent-inspect</span>
          {"\n"}
          <span className="text-amber-300">✗</span>
          <span> contract: require completed run</span>
          {"\n\n"}
          <span className="text-slate-500">$ </span>
          <span>npx agent-inspect bundle run_abc123 --dir .agent-inspect --profile share</span>
          {"\n"}
          <span className="text-success">✓</span>
          <span> evidence.json + evidence.html (share-checked)</span>
          {"\n\n"}
          <span className="text-slate-500">$ </span>
          <span>npx agent-inspect bundle verify .agent-inspect/bundles/run_abc123</span>
          {"\n"}
          <span className="text-success">✓</span>
          <span> integrity OK</span>
        </code>
      </pre>
    </div>
  );
}
