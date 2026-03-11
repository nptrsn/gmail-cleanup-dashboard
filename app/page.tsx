"use client";
import { useState, useMemo, useCallback } from "react";
import { INITIAL_SENDERS, TOTAL_EMAILS, INDEXED_EMAILS, CATEGORIES, type Sender } from "./lib/sender-data";

type Status = "nuke" | "review" | "keep";
type OpStep = "confirm" | "drying" | "dry-done" | "deleting" | "done";
interface Op { name: string; domain: string; step: OpStep; max: number; }
interface LogEntry { sender: string; count: number; time: string; type: "deleted" | "error"; error?: string; }

const STATUS_CFG: Record<Status, { label: string; tw: string; bg: string; border: string }> = {
  nuke:   { label: "Delete", tw: "text-red-500", bg: "bg-red-50", border: "border-red-300" },
  review: { label: "Review", tw: "text-amber-500", bg: "bg-amber-50", border: "border-amber-300" },
  keep:   { label: "Keep",   tw: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-300" },
};

async function callDelete(sender: string, maxCount: number, dryRun: boolean) {
  try {
    const res = await fetch("/api/gmail/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, maxCount, dryRun }),
    });
    return await res.json();
  } catch (err) {
    return { error: String(err), count: 0 };
  }
}
export default function Dashboard() {
  const [data, setData] = useState<Sender[]>(INITIAL_SENDERS);
  const [filt, setFilt] = useState<"all" | Status>("all");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<"count" | "size">("count");
  const [search, setSearch] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [op, setOp] = useState<Op | null>(null);
  const [dryRes, setDryRes] = useState<{ count?: number; error?: string } | null>(null);

  const toggle = (name: string, status: Status) =>
    setData((p) => p.map((s) => (s.name === name ? { ...s, status } : s)));

  const stats = useMemo(() => {
    const g = (st: Status) => data.filter((s) => s.status === st);
    const sum = (arr: Sender[], k: "count" | "sizeMb") => arr.reduce((t, s) => t + s[k], 0);
    const n = g("nuke"), k = g("keep"), r = g("review");
    return { nC: sum(n, "count"), nM: sum(n, "sizeMb"), kC: sum(k, "count"), kM: sum(k, "sizeMb"), rC: sum(r, "count"), rM: sum(r, "sizeMb") };
  }, [data]);

  const rows = useMemo(() => {
    let l = data;
    if (filt !== "all") l = l.filter((s) => s.status === filt);
    if (cat !== "all") l = l.filter((s) => s.category === cat);
    if (search) l = l.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    return [...l].sort((a, b) => sort === "count" ? b.count - a.count : b.sizeMb - a.sizeMb);
  }, [data, filt, cat, sort, search]);

  const pct = Math.round((stats.nC / TOTAL_EMAILS) * 100);
  const totalDel = log.filter((l) => l.type === "deleted").reduce((a, l) => a + l.count, 0);
  const startOp = (s: Sender, max: number) => setOp({ name: s.name, domain: s.domain, step: "confirm", max });
  const cancel = () => { setOp(null); setDryRes(null); };

  const runDry = useCallback(async () => {
    if (!op) return;
    setOp((p) => p ? { ...p, step: "drying" } : null);
    const r = await callDelete(op.domain, op.max, true);
    setDryRes(r);
    setOp((p) => p ? { ...p, step: "dry-done" } : null);
  }, [op]);

  const runReal = useCallback(async () => {
    if (!op) return;
    setOp((p) => p ? { ...p, step: "deleting" } : null);
    const r = await callDelete(op.domain, op.max, false);
    const entry: LogEntry = { sender: op.name, count: r.count || 0, time: new Date().toLocaleTimeString(), type: r.error ? "error" : "deleted", error: r.error };
    setLog((p) => [entry, ...p]);
    if (!r.error && r.count > 0) {
      setData((p) => p.map((s) => s.name === op.name ? { ...s, count: Math.max(0, s.count - (r.count || 0)) } : s));
    }
    setOp((p) => p ? { ...p, step: "done" } : null);
    setTimeout(() => { setOp(null); setDryRes(null); }, 2000);
  }, [op]);
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-[Inter,system-ui,sans-serif]">
      {/* Modal */}
      {op && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={cancel}>
          <div className="bg-white rounded-2xl p-6 w-[440px] border border-stone-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-1">
              {op.step === "confirm" && `Delete emails from ${op.name}?`}
              {op.step === "drying" && "Running dry run…"}
              {op.step === "dry-done" && "Dry run complete"}
              {op.step === "deleting" && "Deleting…"}
              {op.step === "done" && "Done!"}
            </h3>

            {op.step === "confirm" && (
              <>
                <p className="text-sm text-stone-500 mt-2 mb-4">First runs a dry run to show exactly how many emails match. Nothing deleted until you confirm.</p>
                <div className="flex gap-2 justify-end">
                  <button onClick={cancel} className="px-4 py-2 rounded-lg text-sm bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors duration-150">Cancel</button>
                  <button onClick={runDry} className="px-4 py-2 rounded-lg text-sm font-semibold bg-violet-500 text-white hover:bg-violet-600 transition-colors duration-150">Run Dry Run</button>
                </div>
              </>
            )}

            {op.step === "drying" && <div className="py-6 text-center"><div className="text-3xl mb-2">⏳</div><p className="text-sm text-stone-500">Checking how many emails match…</p></div>}

            {op.step === "dry-done" && dryRes && (
              <>
                {dryRes.error ? (
                  <div className="p-3 bg-red-50 rounded-lg my-3 text-sm text-red-500">{dryRes.error}</div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-lg my-3">
                    <div className="text-2xl font-bold text-amber-500 font-mono">{dryRes.count || 0} emails</div>
                    <div className="text-xs text-stone-500 mt-1">will be moved to trash (recoverable 30 days)</div>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <button onClick={cancel} className="px-4 py-2 rounded-lg text-sm bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors duration-150">Cancel</button>
                  {!dryRes.error && <button onClick={runReal} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-150">Trash {dryRes.count || 0} Emails</button>}
                </div>
              </>
            )}
            {op.step === "deleting" && <div className="py-6 text-center"><div className="text-3xl mb-2">🗑️</div><p className="text-sm text-stone-500">Moving to trash…</p></div>}
            {op.step === "done" && <div className="py-6 text-center"><div className="text-3xl mb-2">✅</div><p className="text-sm font-semibold text-emerald-500">Done! Emails moved to trash.</p></div>}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">📧 Gmail Cleanup</h1>
            <p className="text-sm text-stone-500 mt-1">nick@lucidsolutions.io · {INDEXED_EMAILS.toLocaleString()} / {TOTAL_EMAILS.toLocaleString()} indexed{totalDel > 0 ? ` · ${totalDel} deleted` : ""}</p>
          </div>
          <span className="text-xs text-stone-400">{totalDel > 0 ? `${totalDel} trashed so far` : "Nothing deleted yet"}</span>
        </div>

        {/* Before → After */}
        <div className="grid grid-cols-[1fr_32px_1fr] items-center mb-5">
          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider mb-1">Before</div>
            <div className="text-3xl font-bold font-mono">{TOTAL_EMAILS.toLocaleString()}</div>
            <div className="text-xs text-stone-500 mt-1">emails · ~900 MB</div>
            <div className="mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full w-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" /></div>
          </div>
          <div className="text-center text-stone-300">→</div>
          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider mb-1">After</div>
            <div className="text-3xl font-bold font-mono text-emerald-500">{(TOTAL_EMAILS - stats.nC - totalDel).toLocaleString()}</div>
            <div className="text-xs text-stone-500 mt-1">emails · ~{Math.round(900 - stats.nM)} MB</div>
            <div className="mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${100 - pct}%` }} /></div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { l: "Staged to delete", v: stats.nC.toLocaleString(), s: `${stats.nM.toFixed(0)} MB · ${pct}%`, c: "text-red-500", bg: "bg-red-50" },
            { l: "Keeping", v: stats.kC.toLocaleString(), s: `${stats.kM.toFixed(0)} MB`, c: "text-emerald-500", bg: "bg-emerald-50" },
            { l: "Needs review", v: stats.rC.toLocaleString(), s: `${stats.rM.toFixed(0)} MB`, c: "text-amber-500", bg: "bg-amber-50" },
            { l: "Deleted so far", v: totalDel.toLocaleString(), s: log.length ? `${log.filter((l) => l.type === "deleted").length} ops` : "none yet", c: "text-violet-500", bg: "bg-violet-50" },
          ].map((x) => (
            <div key={x.l} className={`${x.bg} rounded-xl p-3`}>
              <div className="text-[10px] text-stone-500 font-medium mb-1">{x.l}</div>
              <div className={`text-xl font-bold font-mono ${x.c}`}>{x.v}</div>
              <div className="text-[10px] text-stone-500 mt-0.5">{x.s}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-3 flex-wrap items-center">
          {(["all", "nuke", "review", "keep"] as const).map((f) => (
            <button key={f} onClick={() => setFilt(f)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${filt === f ? (f === "all" ? "border-stone-900 bg-stone-100 text-stone-900" : `${STATUS_CFG[f].border} ${STATUS_CFG[f].bg} ${STATUS_CFG[f].tw}`) : "border-stone-200 bg-white text-stone-400 hover:border-stone-300"}`}>
              {f === "all" ? `All (${data.length})` : `${STATUS_CFG[f].label} (${data.filter((s) => s.status === f).length})`}
            </button>
          ))}
          <span className="w-px h-4 bg-stone-200 mx-1" />
          {["all", ...Object.keys(CATEGORIES)].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-full text-xs border transition-all duration-150 ${cat === c ? "border-stone-400 bg-stone-100 text-stone-700" : "border-stone-200 bg-white text-stone-400 hover:border-stone-300"}`}>
              {c === "all" ? "All" : `${CATEGORIES[c as keyof typeof CATEGORIES].icon} ${CATEGORIES[c as keyof typeof CATEGORIES].label}`}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="px-3 py-1 rounded-lg border border-stone-200 text-xs w-32 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all duration-150" />
            {(["count", "size"] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-full text-xs border transition-all duration-150 ${sort === s ? "border-stone-400 bg-stone-100 text-stone-700" : "border-stone-200 bg-white text-stone-400"}`}>
                {s === "count" ? "#" : "MB"}
              </button>
            ))}
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-[240px_64px_52px_1fr_130px] px-4 py-2 border-b-2 border-stone-100 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
            <div>Sender</div><div className="text-right">Count</div><div className="text-right">MB</div><div className="text-center">Action</div><div className="text-center">Delete</div>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {rows.map((row) => {
              const cfg = STATUS_CFG[row.status];
              return (
                <div key={row.name} className="grid grid-cols-[240px_64px_52px_1fr_130px] px-4 py-2 border-b border-stone-50 items-center hover:bg-stone-50/50 transition-colors duration-150">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{row.name}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{CATEGORIES[row.category].icon} {CATEGORIES[row.category].label}</div>
                  </div>
                  <div className={`text-right text-sm font-semibold font-mono ${row.status === "nuke" ? "text-red-500" : "text-stone-900"}`}>{row.count.toLocaleString()}</div>
                  <div className="text-right text-xs text-stone-500 font-mono">{row.sizeMb.toFixed(1)}</div>
                  <div className="flex gap-1 justify-center">
                    {(["nuke", "review", "keep"] as const).map((st) => (
                      <button key={st} onClick={() => toggle(row.name, st)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all duration-150 ${row.status === st ? `${cfg.border} ${cfg.bg} ${cfg.tw}` : "border-stone-200 bg-white text-stone-300 hover:border-stone-300"}`}>
                        {STATUS_CFG[st].label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1 justify-center">
                    {row.status === "nuke" && row.count > 0 && (
                      <>
                        <button onClick={() => startOp(row, 10)} className="px-2 py-1 rounded-md text-[10px] font-semibold bg-violet-50 text-violet-500 border border-violet-200/50 hover:bg-violet-100 transition-colors duration-150">Test 10</button>
                        <button onClick={() => startOp(row, 9999)} className="px-2 py-1 rounded-md text-[10px] font-semibold bg-red-50 text-red-500 border border-red-200/50 hover:bg-red-100 transition-colors duration-150">All</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {rows.length === 0 && <div className="p-8 text-center text-stone-400 text-sm">No senders match your filters</div>}
          </div>
        </div>
        {/* Delete Log */}
        {log.length > 0 && (
          <div className="mt-4 bg-violet-50 rounded-xl p-4 border border-violet-100">
            <h3 className="text-sm font-semibold text-violet-500 mb-2">Delete Log</h3>
            {log.map((l, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg mb-1 border border-violet-50">
                <span>{l.type === "error" ? "❌" : "✅"}</span>
                <span className="flex-1 text-sm font-medium">{l.sender}</span>
                <span className={`text-xs font-semibold font-mono ${l.type === "error" ? "text-red-500" : "text-emerald-500"}`}>
                  {l.type === "error" ? "failed" : `${l.count} trashed`}
                </span>
                <span className="text-xs text-stone-400">{l.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between text-[11px] text-stone-400">
          <span>Dry run → you confirm → trash (recoverable 30 days)</span>
          <span>{INDEXED_EMAILS.toLocaleString()} / {TOTAL_EMAILS.toLocaleString()} indexed</span>
        </div>
      </div>
    </div>
  );
}