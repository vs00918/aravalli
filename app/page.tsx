export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto text-center space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
        <span>●</span>
        <span>Phase 0: Architectural Foundation Established</span>
      </div>

      {/* Hero Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Mind of Aravalli
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A living personal encyclopedia that turns scattered information into structured, connected, durable understanding.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left pt-4">
        <div className="p-5 rounded-2xl bg-aravalli-card border border-aravalli-border space-y-2">
          <div className="text-lg text-emerald-400 font-bold">01</div>
          <h3 className="font-semibold text-sm text-slate-200">Living Master Chapters</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consolidated knowledge volumes instead of hundreds of isolated, fragmented notes.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-aravalli-card border border-aravalli-border space-y-2">
          <div className="text-lg text-emerald-400 font-bold">02</div>
          <h3 className="font-semibold text-sm text-slate-200">First-Principles Concepts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Layered explanations designed for genuine understanding, from simple intuition to mathematical models.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-aravalli-card border border-aravalli-border space-y-2">
          <div className="text-lg text-emerald-400 font-bold">03</div>
          <h3 className="font-semibold text-sm text-slate-200">Rigorous Connections</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Defensible cross-domain relationships linking physics, biology, technology, and society.
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className="w-full p-4 rounded-xl bg-aravalli-card/60 border border-aravalli-border/80 text-xs text-slate-500 font-mono flex items-center justify-between">
        <span>Stack: Next.js 14 • React 18 • TypeScript • Tailwind • Prisma SQLite</span>
        <span className="text-emerald-400">Ready for Phase 1</span>
      </div>
    </div>
  );
}
