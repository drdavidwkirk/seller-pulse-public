import { useState, useRef, useEffect, useCallback } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUOTA = 1250000;
const fmt = (n) => "$" + Math.round(n / 1000) + "K";

const INITIAL_DEALS = [
  { id: "OPP-100023", account: "Accenture",          seller: "Liam O'Brien",   value: 85000,  category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100031", account: "Deloitte",            seller: "Liam O'Brien",   value: 120000, category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100045", account: "PricewaterhouseCoopers", seller: "Liam O'Brien", value: 65000, category: "Upside",  quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100058", account: "KPMG",               seller: "Liam O'Brien",   value: 200000, category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100067", account: "Unilever",            seller: "Priya Sharma",   value: 95000,  category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100072", account: "Procter & Gamble",    seller: "Priya Sharma",   value: 140000, category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100089", account: "Nestlé",              seller: "Priya Sharma",   value: 75000,  category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100094", account: "Barclays",            seller: "Tom Ashworth",   value: 110000, category: "Commit",   quarter: "Q2", sophieOverride: "Upside", jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100103", account: "HSBC",                seller: "Tom Ashworth",   value: 180000, category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100117", account: "NatWest",             seller: "Tom Ashworth",   value: 60000,  category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100126", account: "Amazon Web Services", seller: "Chloe Bennett",  value: 220000, category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100134", account: "Microsoft",           seller: "Chloe Bennett",  value: 90000,  category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100148", account: "Google",              seller: "Chloe Bennett",  value: 160000, category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100155", account: "Vodafone",            seller: "Dev Patel",      value: 75000,  category: "Commit",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100163", account: "BT Group",            seller: "Dev Patel",      value: 130000, category: "Upside",   quarter: "Q2", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100177", account: "O2 (Telefónica)",     seller: "Dev Patel",      value: 55000,  category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
  { id: "OPP-100182", account: "Sky",                 seller: "Dev Patel",      value: 185000, category: "Pipeline", quarter: "Q3", sophieOverride: null,     jamesOverride: null, jamesReason: null, risk: null },
];

const SELLERS = ["Liam O'Brien", "Priya Sharma", "Tom Ashworth", "Chloe Bennett", "Dev Patel"];

const PROMPTS = [
  "Where are we really on Q2?",
  "Which deals should I be worried about?",
  "Draft me a narrative for Isabelle",
  "What's Tom's pipeline telling us?",
  "Flag anything that's drifting",
];

// ─── AI System Prompt ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Pipeline, the AI forecast intelligence for James Calloway, RVP at a global people consulting firm.
James manages five sellers through Sophie Hartley (RSM).

SELLERS (Q2 quotas):
- Liam O'Brien: $300K
- Priya Sharma: $250K
- Tom Ashworth: $225K
- Chloe Bennett: $275K
- Dev Patel: $200K
TEAM Q2 QUOTA: $1,250,000
HIERARCHY: James Calloway (RVP) → Isabelle Renard (SVP) → Marcus Hale (CRO)

PIPELINE — 17 DEALS:
OPP-100023 | Accenture           | Liam O'Brien  | $85K  | Commit   | Q2
OPP-100031 | Deloitte            | Liam O'Brien  | $120K | Commit   | Q2
OPP-100045 | PricewaterhouseCoopers | Liam O'Brien | $65K | Upside  | Q2 [no activity 3 weeks]
OPP-100058 | KPMG                | Liam O'Brien  | $200K | Pipeline | Q3
OPP-100067 | Unilever            | Priya Sharma  | $95K  | Commit   | Q2
OPP-100072 | Procter & Gamble    | Priya Sharma  | $140K | Upside   | Q2
OPP-100089 | Nestlé              | Priya Sharma  | $75K  | Pipeline | Q3
OPP-100094 | Barclays            | Tom Ashworth  | $110K | Sophie overrode Commit → Upside | Q2 [Tom has not corrected]
OPP-100103 | HSBC                | Tom Ashworth  | $180K | Upside   | Q2 [no next step logged 14 days]
OPP-100117 | NatWest             | Tom Ashworth  | $60K  | Pipeline | Q3
OPP-100126 | Amazon Web Services | Chloe Bennett | $220K | Commit   | Q2
OPP-100134 | Microsoft           | Chloe Bennett | $90K  | Upside   | Q2
OPP-100148 | Google              | Chloe Bennett | $160K | Pipeline | Q3
OPP-100155 | Vodafone            | Dev Patel     | $75K  | Commit   | Q2
OPP-100163 | BT Group            | Dev Patel     | $130K | Upside   | Q2
OPP-100177 | O2 (Telefónica)     | Dev Patel     | $55K  | Pipeline | Q3
OPP-100182 | Sky                 | Dev Patel     | $185K | Pipeline | Q3 [no champion identified]

KEY INTELLIGENCE:
- Q2 Commit (raw): $705K. Sophie's Barclays override drops effective commit to $595K until Tom corrects.
- HSBC ($180K) is the largest single upside deal — stale, no next step in 14 days.
- Sky ($185K) is high-value but Q3 with no champion — risk of slipping to Q4.
- PwC ($65K) — 3 weeks no activity, close date unchanged.
- Chloe Bennett is the standout performer — AWS commit solid, clean pipeline discipline.
- Tom Ashworth has not corrected Barclays after Sophie's override — accountability gap.

YOUR ROLE: Speak directly to James in plain language. Be specific — name deals, sellers, numbers.
Be honest about risk. Never soften uncomfortable truths. You are a trusted thinking partner, not a reporting tool.

ALWAYS respond with ONLY valid JSON — no markdown, no preamble, no trailing text:
{
  "reply": "your response to James (use \\n for line breaks)",
  "actions": {
    "overrides": [{ "dealId": "OPP-XXXXXX", "newCategory": "Commit|Upside|Pipeline|Risk", "reason": "one line reason" }],
    "flags": [{ "dealId": "OPP-XXXXXX", "level": "high|medium", "reason": "one line reason" }],
    "narrative": null
  },
  "highlights": ["OPP-XXXXXX"]
}`;

// ─── Opening message ──────────────────────────────────────────────────────────

const OPENING = {
  reply: `Good morning, James.\n\nYour Q2 commit stands at $705K against a $1.25M team quota — 56% of target with 5 weeks remaining.\n\nTwo things need your attention today:\n\nSophie has moved Barclays ($110K) from Commit to Upside. Tom hasn't corrected his submission. That gap is live in your forecast right now.\n\nHSBC ($180K) is your biggest upside deal and has had no next step logged in 14 days.\n\nWhat do you want to look at first?`,
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
    Commit:   { bg: "#0e2214", color: "#4ec99a", border: "transparent" },
    Upside:   { bg: "#0e1a30", color: "#5a8dee", border: "transparent" },
    Pipeline: { bg: "#181820", color: "#505070", border: "transparent" },
    Risk:     { bg: "#2a0e0e", color: "#e85555", border: "transparent" },
  };

  const s = isJ
    ? { bg: "#1a1230", color: "#9d8fee", border: "#3a2f90" }
    : isS
    ? { bg: "#0a2018", color: "#4ec99a", border: "#1a5a44" }
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

  const sendMessage = async (text) => {
    if (!text?.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setHighlights([]);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.role === "assistant" ? JSON.stringify(m.content) : m.content,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const raw = (data.content || []).map(i => i.text || "").join("");

      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {
        parsed = { reply: raw, actions: { overrides: [], flags: [], narrative: null }, highlights: [] };
      }

      if (parsed.highlights?.length) setHighlights(parsed.highlights);

      const { updatedDeals, updatedFlags } = applyActions(parsed.actions, deals, flags);
      setDeals(updatedDeals);
      setFlags(updatedFlags);
      setMessages(prev => [...prev, { role: "assistant", content: parsed }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: { reply: "Connection issue — please try again.", actions: { overrides: [], flags: [], narrative: null }, highlights: [] },
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0a0a0f; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a40; border-radius: 2px; }
        @keyframes sp-pulse { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .sp-dot-1 { animation: sp-pulse 1.2s ease-in-out 0.0s infinite; }
        .sp-dot-2 { animation: sp-pulse 1.2s ease-in-out 0.2s infinite; }
        .sp-dot-3 { animation: sp-pulse 1.2s ease-in-out 0.4s infinite; }
        .sp-prompt:hover { border-color: #4a3aaa !important; color: #9d8fee !important; }
        .sp-send:hover { background: #2a1e6e !important; }
        .sp-input:focus { border-color: #4a3aaa !important; outline: none; }
        .sp-deal { transition: background 0.3s ease, border-color 0.3s ease; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e0e0ec", fontFamily: "'DM Mono', 'Courier New', monospace", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <div style={{ borderBottom: "1px solid #1a1a28", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#080810", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1240", border: "1px solid #4a3aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#9d8fee", flexShrink: 0 }}>JC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif", color: "#e0e0ec" }}>James Calloway</div>
              <div style={{ fontSize: 9, color: "#404060", letterSpacing: "0.08em", marginTop: 2 }}>RVP · MAKE THE NEWS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Q2 COMMIT", value: fmt(commit), color: "#9d8fee" },
              { label: "Q2 UPSIDE", value: fmt(upside), color: "#5a8dee" },
              { label: "QUOTA", value: fmt(QUOTA), color: "#404060" },
              { label: "COVERAGE", value: `${coverage}%`, color: coverage >= 100 ? "#4ec99a" : "#e8884a" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "#404060", letterSpacing: "0.08em" }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* ── Chat Panel ── */}
          <div style={{ width: "44%", borderRight: "1px solid #1a1a28", display: "flex", flexDirection: "column", minHeight: 0 }}>

            {/* Chat header */}
            <div style={{ padding: "10px 18px", borderBottom: "1px solid #1a1a28", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#9d8fee" }} />
              <span style={{ fontSize: 10, color: "#9d8fee", letterSpacing: "0.08em" }}>PIPELINE — AI FORECAST INTELLIGENCE</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  {msg.role === "user" ? (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-block", background: "#14141e", border: "1px solid #222234", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#a0a0c0", maxWidth: "82%", textAlign: "left", lineHeight: 1.65 }}>
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#100e26", border: "1px solid #342a88", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9d8fee", flexShrink: 0, marginTop: 2 }}>P</div>
                      <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 8, padding: "10px 13px", fontSize: 12, color: "#a0a0c0", lineHeight: 1.75, maxWidth: "87%" }}>
                        <div style={{ whiteSpace: "pre-line" }}>{msg.content.reply}</div>

                        {/* Override receipts */}
                        {msg.content.actions?.overrides?.length > 0 && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #1a1a2a" }}>
                            {msg.content.actions.overrides.map((ov, j) => (
                              <div key={j} style={{ fontSize: 10, color: "#9d8fee", marginBottom: 3 }}>
                                ↗ {ov.dealId} → <strong>{ov.newCategory}</strong> — {ov.reason}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Narrative */}
                        {msg.content.actions?.narrative && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #1a1a2a", fontStyle: "italic", color: "#8888aa", fontSize: 11, lineHeight: 1.85 }}>
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
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#100e26", border: "1px solid #342a88", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9d8fee", flexShrink: 0 }}>P</div>
                  <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 8, padding: "12px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                    {[1, 2, 3].map(n => (
                      <div key={n} className={`sp-dot-${n}`} style={{ width: 5, height: 5, borderRadius: "50%", background: "#9d8fee" }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested prompts */}
            <div style={{ padding: "8px 18px", borderTop: "1px solid #1a1a28", display: "flex", flexWrap: "wrap", gap: 5, flexShrink: 0 }}>
              {PROMPTS.map((p, i) => (
                <button key={i} className="sp-prompt" onClick={() => sendMessage(p)} style={{ background: "transparent", border: "1px solid #1e1e36", borderRadius: 20, padding: "3px 10px", fontSize: 10, color: "#50507a", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "10px 18px", borderTop: "1px solid #1a1a28", display: "flex", gap: 8, flexShrink: 0 }}>
              <input
                className="sp-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask Pipeline anything..."
                style={{ flex: 1, background: "#0d0d18", border: "1px solid #1e1e30", borderRadius: 7, padding: "9px 12px", fontSize: 12, color: "#e0e0ec", fontFamily: "inherit", transition: "border-color 0.15s" }}
              />
              <button className="sp-send" onClick={() => sendMessage(input)} style={{ background: "#18104a", border: "1px solid #4a3aaa", borderRadius: 7, padding: "9px 16px", color: "#9d8fee", cursor: "pointer", fontSize: 11, fontFamily: "inherit", transition: "background 0.15s" }}>
                Send
              </button>
            </div>
          </div>

          {/* ── Deal Board ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
            <div style={{ fontSize: 9, color: "#404060", letterSpacing: "0.08em", marginBottom: 16 }}>DEAL BOARD — 17 OPPORTUNITIES</div>

            {SELLERS.map(seller => {
              const sellerDeals = deals.filter(d => d.seller === seller);
              const total = sellerDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={seller} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#58587a", marginBottom: 7, display: "flex", justifyContent: "space-between" }}>
                    <span>{seller}</span>
                    <span style={{ color: "#404060", fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
                  </div>
                  {sellerDeals.map(deal => {
                    const isHl = highlights.includes(deal.id);
                    const flag = flags[deal.id];
                    return (
                      <div
                        key={deal.id}
                        className="sp-deal"
                        style={{
                          background: isHl ? "#120e28" : "#0d0d16",
                          border: `1px solid ${isHl ? "#4a3aaa" : flag === "high" ? "#4a1818" : "#161622"}`,
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
                          <div style={{ fontSize: 11, color: isHl ? "#c8b4ff" : "#9090b0" }}>{deal.account}</div>
                          <div style={{ fontSize: 9, color: "#2a2a44", marginTop: 1 }}>{deal.id}</div>
                        </div>
                        <div style={{ fontSize: 11, color: "#606080", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(deal.value)}</div>
                        <div style={{ textAlign: "center" }}>
                          <CategoryPill deal={deal} />
                        </div>
                        <div style={{ fontSize: 9, color: "#303048", textAlign: "right" }}>
                          {deal.quarter}
                          {flag && <span style={{ marginLeft: 4, color: flag === "high" ? "#cc4444" : "#cc8844" }}>⚑</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Legend */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #141420", display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Seller", color: "#505070", bg: "#181820" },
                { label: "Sophie override", color: "#4ec99a", bg: "#0a2018", border: "#1a5a44" },
                { label: "James override", color: "#9d8fee", bg: "#1a1230", border: "#3a2f90" },
              ].map(({ label, color, bg, border }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", background: bg, color, border: `1px solid ${border || "transparent"}`, borderRadius: 4, padding: "1px 8px", fontSize: 9 }}>eg</span>
                  <span style={{ fontSize: 10, color: "#404060" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
