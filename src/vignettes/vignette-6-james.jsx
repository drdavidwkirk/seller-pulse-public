import { useState, useRef, useEffect, useCallback } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUOTA = 1250000;
const fmt = (n) => "$" + Math.round(n / 1000) + "K";

const INITIAL_DEALS = [
  { id: "OPP-100023", account: "Meridian Group",      seller: "Liam O'Brien",   value: 85000,  category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100031", account: "Ashton & Co",         seller: "Liam O'Brien",   value: 120000, category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100045", account: "Vertex Systems",      seller: "Liam O'Brien",   value: 65000,  category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100058", account: "Crestline UK",        seller: "Liam O'Brien",   value: 200000, category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100067", account: "Hartwell Group",      seller: "Priya Sharma",   value: 95000,  category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100072", account: "Caldera Partners",    seller: "Priya Sharma",   value: 140000, category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100089", account: "Renfield & Sons",     seller: "Priya Sharma",   value: 75000,  category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100094", account: "Kirkstone Capital",   seller: "Tom Ashworth",   value: 110000, category: "Commit",   quarter: "Q2", sophieOverride: "Upside", jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100103", account: "Dunmore Financial",   seller: "Tom Ashworth",   value: 180000, category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100117", account: "Pemberton Trust",     seller: "Tom Ashworth",   value: 60000,  category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100126", account: "Apex Cloud Solutions",seller: "Chloe Bennett",  value: 220000, category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100134", account: "Northgate Systems",   seller: "Chloe Bennett",  value: 90000,  category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100148", account: "Ironveil Technologies",seller: "Chloe Bennett", value: 160000, category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100155", account: "Redwood Telecom",     seller: "Dev Patel",      value: 75000,  category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100163", account: "Castleford Networks", seller: "Dev Patel",      value: 130000, category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100177", account: "Prism Mobile",        seller: "Dev Patel",      value: 55000,  category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100182", account: "Horizon Connect",     seller: "Dev Patel",      value: 185000, category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
];

const SELLERS = ["Liam O'Brien", "Priya Sharma", "Tom Ashworth", "Chloe Bennett", "Dev Patel"];

const PROMPTS = [
  "Where are we really on Q2?",
  "Which deals should I be worried about?",
  "Draft me a narrative for Isabelle",
  "What's Tom's pipeline telling us?",
  "Flag anything that's drifting",
];

// ─── Opening message ──────────────────────────────────────────────────────────

const OPENING = {
  reply: `Good morning, James.\n\nYour Q2 commit stands at $705K against a $1.25M team quota — 56% of target with 5 weeks remaining.\n\nTwo things need your attention today:\n\nSophie has moved Kirkstone Capital ($110K) from Commit to Upside. Tom hasn't corrected his submission. That gap is live in your forecast right now.\n\nDunmore Financial ($180K) is your biggest upside deal and has had no next step logged in 14 days.\n\nWhat do you want to look at first?`,
  actions: { overrides: [], flags: [], narrative: null },
  highlights: ["OPP-100094", "OPP-100103"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEffective(deal) {
  return deal.jamesOverride || deal.sophieOverride || deal.category;
}

function CategoryPill({ deal }) {
  const eff = getEffective(deal);
  const isJ = !!deal.jamesOverride;
  const isS = !deal.jamesOverride && !!deal.sophieOverride;

  const styles = {
    Commit:   { bg: "#0d3028", color: "#34d399", border: "transparent" },
    Upside:   { bg: "#162040", color: "#7eb8f7", border: "transparent" },
    Pipeline: { bg: "#1e2340", color: "#9090b8", border: "transparent" },
    Risk:     { bg: "#3a1515", color: "#f87171", border: "transparent" },
  };

  const s = isJ
    ? { bg: "#231a48", color: "#c4b8ff", border: "#6254c8" }
    : isS
    ? { bg: "#0d3028", color: "#34d399", border: "#1a6a50" }
    : styles[eff] || styles.Pipeline;

  return (
    <span style={{
      display: "inline-block",
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 9,
      letterSpacing: "0.04em",
      fontFamily: "inherit",
    }}>
      {eff}{isJ ? " ·J" : isS ? " ·S" : ""}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JamesView() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [messages, setMessages] = useState([{ role: "assistant", content: OPENING }]);
  const [highlights, setHighlights] = useState(OPENING.highlights);
  const [flags, setFlags] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const calcStats = useCallback(() => {
    const commit = deals.filter(d => getEffective(d) === "Commit" && d.quarter === "Q2").reduce((s, d) => s + d.value, 0);
    const upside = deals.filter(d => getEffective(d) === "Upside" && d.quarter === "Q2").reduce((s, d) => s + d.value, 0);
    return { commit, upside, coverage: Math.round(((commit + upside) / QUOTA) * 100) };
  }, [deals]);

  const { commit, upside, coverage } = calcStats();

  const applyActions = useCallback((actions, currentDeals, currentFlags) => {
    let updated = currentDeals.map(d => ({ ...d }));
    const newFlags = { ...currentFlags };

    if (actions?.overrides?.length) {
      actions.overrides.forEach(ov => {
        const idx = updated.findIndex(d => d.id === ov.dealId);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], jamesOverride: ov.newCategory, jamesReason: ov.reason };
        }
      });
    }
    if (actions?.flags?.length) {
      actions.flags.forEach(f => { newFlags[f.dealId] = f.level; });
    }
    return { updatedDeals: updated, updatedFlags: newFlags };
  }, []);

  const getMockResponse = (text) => {
    const q = text.toLowerCase();

    if (q.includes("where are we") || q.includes("q2")) {
      return {
        reply: `Here's the honest picture, James.\n\nRaw commit is $705K — but Sophie's override on Kirkstone Capital ($110K) drops your effective commit to $595K until Tom corrects his submission. That's 48% of quota with 5 weeks left.\n\nUpside adds $715K on paper. Realistically, Dunmore Financial ($180K) is stale — no next step in 14 days. Strip that out and your working upside is $535K.\n\nBest case: $1.13M. You need $1.25M. The gap is real.\n\nTwo conversations need to happen today: Tom on Kirkstone Capital, and whoever owns Dunmore Financial next steps.`,
        actions: { overrides: [], flags: [], narrative: null },
        highlights: ["OPP-100094", "OPP-100103"],
      };
    }

    if (q.includes("worried") || q.includes("risk") || q.includes("flag")) {
      return {
        reply: `Four deals need your attention.\n\nDunmore Financial ($180K) — Tom Ashworth, Upside, Q2. No next step logged in 14 days. This is your biggest single risk. If it slips to Q3 your upside number falls off a cliff.\n\nKirkstone Capital ($110K) — Sophie moved it from Commit to Upside. Tom hasn't corrected. That $110K is sitting in two buckets simultaneously right now.\n\nHorizon Connect ($185K) — Dev Patel, Q3. High value, no champion identified. Risk of drifting to Q4 without intervention.\n\nVertex Systems ($65K) — Liam O'Brien, Upside, Q2. Three weeks no activity. Close date hasn't moved. Someone needs to call this one.`,
        actions: {
          overrides: [],
          flags: [
            { dealId: "OPP-100103", level: "high", reason: "No next step 14 days — Q2 upside at risk" },
            { dealId: "OPP-100094", level: "high", reason: "Sophie override unresolved — Tom hasn't corrected" },
            { dealId: "OPP-100182", level: "medium", reason: "No champion identified — Q3 slip risk" },
            { dealId: "OPP-100045", level: "medium", reason: "3 weeks no activity — close date stale" },
          ],
          narrative: null,
        },
        highlights: ["OPP-100103", "OPP-100094", "OPP-100182", "OPP-100045"],
      };
    }

    if (q.includes("narrative") || q.includes("isabelle")) {
      return {
        reply: `Here's a draft narrative for Isabelle.\n\nReady to copy when you are:`,
        actions: {
          overrides: [],
          flags: [],
          narrative: "Q2 commit stands at $595K effective against $1.25M quota. Upside of $535K (ex-Dunmore Financial pending next step) gives us a realistic range of $1.08M–$1.13M. Key risk: Dunmore Financial ($180K) needs next step by end of week or moves to Q3. Kirkstone Capital correction in progress — Tom Ashworth revising submission. Chloe Bennett is tracking clean; Apex Cloud Solutions ($220K) commit solid. Focused on closing the $120K gap through Dunmore Financial acceleration and Vertex Systems reactivation.",
        },
        highlights: ["OPP-100103", "OPP-100126"],
      };
    }

    if (q.includes("tom") || q.includes("ashworth")) {
      return {
        reply: `Tom's pipeline tells a mixed story.\n\nHe has three deals totalling $350K. On paper that's 156% coverage against his $225K quota.\n\nBut look closer:\n\nKirkstone Capital ($110K) — Sophie moved it from Commit to Upside last week. Tom hasn't corrected his submission. That's an accountability gap you need to close today.\n\nDunmore Financial ($180K) — his biggest deal. No next step logged in 14 days. This is either moving or it isn't, and right now you can't tell which.\n\nPemberton Trust ($60K) is clean Pipeline for Q3.\n\nTom's Q2 position is weaker than his headline number suggests. I'd have that conversation before the week is out.`,
        actions: {
          overrides: [],
          flags: [
            { dealId: "OPP-100094", level: "high", reason: "Unresolved Sophie override — seller correction outstanding" },
            { dealId: "OPP-100103", level: "high", reason: "Largest upside deal — stale, no next step" },
          ],
          narrative: null,
        },
        highlights: ["OPP-100094", "OPP-100103", "OPP-100117"],
      };
    }

    if (q.includes("drift") || q.includes("slip") || q.includes("stale")) {
      return {
        reply: `Three deals showing drift signals.\n\nVertex Systems ($65K, Liam O'Brien) — last activity 3 weeks ago. Close date unchanged. Classic stale upside. Needs a call this week or a close date push.\n\nDunmore Financial ($180K, Tom Ashworth) — 14 days no next step. For your biggest upside deal, that's too long. Either there's news Tom hasn't logged, or the deal is drifting.\n\nHorizon Connect ($185K, Dev Patel) — Q3, no champion identified. Still early, but $185K without a named champion at this stage is a risk. Dev needs to answer the champion question before your next forecast call.\n\nEverything else is moving cleanly. Chloe Bennett's pipeline in particular is well maintained.`,
        actions: {
          overrides: [],
          flags: [
            { dealId: "OPP-100045", level: "medium", reason: "3 weeks no activity" },
            { dealId: "OPP-100103", level: "high", reason: "14 days no next step" },
            { dealId: "OPP-100182", level: "medium", reason: "No champion identified" },
          ],
          narrative: null,
        },
        highlights: ["OPP-100045", "OPP-100103", "OPP-100182"],
      };
    }

    // Default fallback
    return {
      reply: `Good question. Here's my read based on the current pipeline.\n\nYour cleanest performers are Chloe Bennett (Apex Cloud Solutions commit solid at $220K, disciplined pipeline) and Priya Sharma (Hartwell Group commit holding, Caldera Partners upside progressing).\n\nThe pressure points are in Tom Ashworth's book — Kirkstone Capital and Dunmore Financial both need intervention this week.\n\nDev Patel's Q3 pipeline ($240K across Renfield & Sons, Prism Mobile and Horizon Connect) looks strong on paper but Horizon Connect needs a champion before you can rely on it.\n\nWhat specifically do you want to dig into?`,
      actions: { overrides: [], flags: [], narrative: null },
      highlights: ["OPP-100126", "OPP-100094", "OPP-100103"],
    };
  };

  const sendMessage = async (text) => {
    if (!text?.trim() || loading) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setHighlights([]);

    // Simulate Pipeline thinking
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const response = getMockResponse(text);
    if (response.highlights?.length) setHighlights(response.highlights);
    const { updatedDeals, updatedFlags } = applyActions(response.actions, deals, flags);
    setDeals(updatedDeals);
    setFlags(updatedFlags);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #111827; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
        @keyframes sp-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        .sp-dot-1 { animation: sp-pulse 1.2s ease-in-out 0.0s infinite; }
        .sp-dot-2 { animation: sp-pulse 1.2s ease-in-out 0.2s infinite; }
        .sp-dot-3 { animation: sp-pulse 1.2s ease-in-out 0.4s infinite; }
        .sp-prompt:hover { border-color: #7c6fe0 !important; color: #b8adf5 !important; }
        .sp-send:hover { background: #3730a3 !important; }
        .sp-input:focus { border-color: #7c6fe0 !important; outline: none; }
        .sp-deal { transition: background 0.3s ease, border-color 0.3s ease; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#111827", color: "#f1f0fc", fontFamily: "'DM Mono', 'Courier New', monospace", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <div style={{ borderBottom: "1px solid #2d2d4a", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f1120", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2e2470", border: "1px solid #7c6fe0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#c4b8ff", flexShrink: 0 }}>JC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif", color: "#f1f0fc" }}>James Calloway</div>
              <div style={{ fontSize: 9, color: "#7070a0", letterSpacing: "0.08em", marginTop: 2 }}>RVP · MAKE THE NEWS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Q2 COMMIT", value: fmt(commit), color: "#b8adf5" },
              { label: "Q2 UPSIDE", value: fmt(upside), color: "#7eb8f7" },
              { label: "QUOTA", value: fmt(QUOTA), color: "#6b7280" },
              { label: "COVERAGE", value: `${coverage}%`, color: coverage >= 100 ? "#34d399" : "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "#7070a0", letterSpacing: "0.08em" }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* ── Chat Panel ── */}
          <div style={{ width: "44%", borderRight: "1px solid #2d2d4a", display: "flex", flexDirection: "column", minHeight: 0 }}>

            {/* Chat header */}
            <div style={{ padding: "10px 18px", borderBottom: "1px solid #2d2d4a", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#b8adf5" }} />
              <span style={{ fontSize: 10, color: "#b8adf5", letterSpacing: "0.08em" }}>PIPELINE — AI FORECAST INTELLIGENCE</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  {msg.role === "user" ? (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-block", background: "#1e2340", border: "1px solid #3a3d5c", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#d0d0f0", maxWidth: "82%", textAlign: "left", lineHeight: 1.65 }}>
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#2e2470", border: "1px solid #6254c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#c4b8ff", flexShrink: 0, marginTop: 2 }}>P</div>
                      <div style={{ background: "#181f38", border: "1px solid #2d3252", borderRadius: 8, padding: "10px 13px", fontSize: 12, color: "#d0d0f0", lineHeight: 1.75, maxWidth: "87%" }}>
                        <div style={{ whiteSpace: "pre-line" }}>{msg.content.reply}</div>

                        {/* Override receipts */}
                        {msg.content.actions?.overrides?.length > 0 && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #2d3252" }}>
                            {msg.content.actions.overrides.map((ov, j) => (
                              <div key={j} style={{ fontSize: 10, color: "#b8adf5", marginBottom: 3 }}>
                                ↗ {ov.dealId} → <strong>{ov.newCategory}</strong> — {ov.reason}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Narrative */}
                        {msg.content.actions?.narrative && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #2d3252", fontStyle: "italic", color: "#a0a8cc", fontSize: 11, lineHeight: 1.85 }}>
                            "{msg.content.actions.narrative}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#2e2470", border: "1px solid #6254c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#c4b8ff", flexShrink: 0 }}>P</div>
                  <div style={{ background: "#181f38", border: "1px solid #2d3252", borderRadius: 8, padding: "12px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                    {[1, 2, 3].map(n => (
                      <div key={n} className={`sp-dot-${n}`} style={{ width: 5, height: 5, borderRadius: "50%", background: "#b8adf5" }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested prompts */}
            <div style={{ padding: "8px 18px", borderTop: "1px solid #2d2d4a", display: "flex", flexWrap: "wrap", gap: 5, flexShrink: 0 }}>
              {PROMPTS.map((p, i) => (
                <button key={i} className="sp-prompt" onClick={() => sendMessage(p)} style={{ background: "transparent", border: "1px solid #2d3252", borderRadius: 20, padding: "3px 10px", fontSize: 10, color: "#7070a0", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "10px 18px", borderTop: "1px solid #2d2d4a", display: "flex", gap: 8, flexShrink: 0 }}>
              <input
                className="sp-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask Pipeline anything..."
                style={{ flex: 1, background: "#181f38", border: "1px solid #2d3252", borderRadius: 7, padding: "9px 12px", fontSize: 12, color: "#f1f0fc", fontFamily: "inherit", transition: "border-color 0.15s" }}
              />
              <button className="sp-send" onClick={() => sendMessage(input)} style={{ background: "#2e2470", border: "1px solid #7c6fe0", borderRadius: 7, padding: "9px 16px", color: "#c4b8ff", cursor: "pointer", fontSize: 11, fontFamily: "inherit", transition: "background 0.15s" }}>
                Send
              </button>
            </div>
          </div>

          {/* ── Deal Board ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
            <div style={{ fontSize: 9, color: "#7070a0", letterSpacing: "0.08em", marginBottom: 16 }}>DEAL BOARD — 17 OPPORTUNITIES</div>

            {SELLERS.map(seller => {
              const sellerDeals = deals.filter(d => d.seller === seller);
              const total = sellerDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={seller} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#9090b8", marginBottom: 7, display: "flex", justifyContent: "space-between" }}>
                    <span>{seller}</span>
                    <span style={{ color: "#7070a0", fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
                  </div>
                  {sellerDeals.map(deal => {
                    const isHl = highlights.includes(deal.id);
                    const flag = flags[deal.id];
                    return (
                      <div
                        key={deal.id}
                        className="sp-deal"
                        style={{
                          background: isHl ? "#231a48" : "#192038",
                          border: `1px solid ${isHl ? "#7c6fe0" : flag === "high" ? "#7a2020" : "#2d3252"}`,
                          borderRadius: 6,
                          padding: "7px 10px",
                          marginBottom: 5,
                          display: "grid",
                          gridTemplateColumns: "1fr 68px 74px 34px",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: isHl ? "#d8c8ff" : "#c0c0e0" }}>{deal.account}</div>
                          <div style={{ fontSize: 9, color: "#505070", marginTop: 1 }}>{deal.id}</div>
                        </div>
                        <div style={{ fontSize: 11, color: "#9090b8", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(deal.value)}</div>
                        <div style={{ textAlign: "center" }}>
                          <CategoryPill deal={deal} />
                        </div>
                        <div style={{ fontSize: 9, color: "#606080", textAlign: "right" }}>
                          {deal.quarter}
                          {flag && <span style={{ marginLeft: 4, color: flag === "high" ? "#f87171" : "#fbbf24" }}>⚑</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Legend */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #2d3252", display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Seller", color: "#9090b8", bg: "#192038", border: "#2d3252" },
                { label: "Sophie override", color: "#34d399", bg: "#0d3028", border: "#1a6a50" },
                { label: "James override", color: "#c4b8ff", bg: "#231a48", border: "#6254c8" },
              ].map(({ label, color, bg, border }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", background: bg, color, border: `1px solid ${border}`, borderRadius: 4, padding: "1px 8px", fontSize: 9 }}>eg</span>
                  <span style={{ fontSize: 10, color: "#7070a0" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
