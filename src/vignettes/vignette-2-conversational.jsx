import { useState, useEffect, useRef } from "react";

// ─── SCRIPT ──────────────────────────────────────────────────────────────────
const SCRIPT = [
  { from: "PIPELINE", text: "Hey Liam. Let's run through your deals. Where are you feeling most confident this week?" },
  { from: "LIAM", text: "Meridian is solid. £340k, we're in final negotiations. That's a Commit for me." },
  { from: "PIPELINE", text: "Good. When did you last speak to James Walsh — the economic buyer?" },
  { from: "LIAM", text: "He's been hard to reach. I've been dealing mostly with the procurement team." },
  { from: "PIPELINE", text: "So the economic buyer has been dark for how long?" },
  { from: "LIAM", text: "... About three weeks. Maybe a bit longer." },
  { from: "PIPELINE", text: "I hear you. That doesn't make it a lost deal — but it does make it Upside, not Commit. You don't control the close date until you control the buyer. I'm moving Meridian." },
  { from: "LIAM", text: "Yeah. You're right. I've been avoiding that conversation." },
  { from: "PIPELINE", text: "That's the honest read. What's your plan to get back in front of Walsh this week?" },
  { from: "LIAM", text: "I'll reach out today. I think I need to go above procurement and ask for a direct call." },
  { from: "PIPELINE", text: "That's the right move. Log it as your next step and let's pick this up Thursday. You've got good pipeline, Liam. Own it." },
];

// ─── INITIAL DEALS ────────────────────────────────────────────────────────────
const INITIAL_DEALS = [
  { id: "OPP-001", name: "Meridian Group", value: 340000, category: "COMMIT", stage: "Negotiation", updated: false },
  { id: "OPP-002", name: "Ashton & Co", value: 180000, category: "COMMIT", stage: "Proposal", updated: false },
  { id: "OPP-003", name: "Vertex Systems", value: 220000, category: "UPSIDE", stage: "Evaluation", updated: false },
  { id: "OPP-004", name: "Crestline UK", value: 95000, category: "UPSIDE", stage: "Discovery", updated: false },
  { id: "OPP-005", name: "Parkfield Group", value: 410000, category: "PIPELINE", stage: "Qualify", updated: false },
  { id: "OPP-006", name: "Thorngate Ltd", value: 155000, category: "PIPELINE", stage: "Discovery", updated: false },
];

const CAT_CONFIG = {
  COMMIT:   { color: "#22c55e", bg: "#0f2010", border: "#14532d", label: "COMMIT" },
  UPSIDE:   { color: "#f59e0b", bg: "#1c1200", border: "#78350f", label: "UPSIDE" },
  PIPELINE: { color: "#60a5fa", bg: "#0a1628", border: "#1e3a5f", label: "PIPELINE" },
};

// Message triggers Meridian move after index 6 (PIPELINE's "I'm moving Meridian")
const MERIDIAN_MOVE_AFTER = 6;

const fmt = (v) => `£${(v / 1000).toFixed(0)}k`;

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function useTypewriter(text, speed, active) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (!active) return;
    setOut(""); setDone(false);
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(ref.current); setDone(true); }
    }, speed);
    return () => clearInterval(ref.current);
  }, [text, active]);
  return { out, done };
}

// ─── BUBBLE ───────────────────────────────────────────────────────────────────
function Bubble({ msg, isTyping, displayText }) {
  const isLiam = msg.from === "LIAM";
  return (
    <div style={{
      display: "flex", gap: 8,
      flexDirection: isLiam ? "row-reverse" : "row",
      alignItems: "flex-start",
      animation: "fadeUp 0.3s ease"
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: isLiam ? "#0f1f0f" : "#0d0d1f",
        border: `1.5px solid ${isLiam ? "#16a34a" : "#4c1d95"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, fontWeight: 700,
        color: isLiam ? "#86efac" : "#c4b5fd",
        letterSpacing: "0.05em"
      }}>{isLiam ? "LO" : "P"}</div>

      <div style={{
        maxWidth: "80%",
        background: isLiam ? "#0d1a0d" : "#0d0d1f",
        border: `1px solid ${isLiam ? "#14532d" : "#1e1b4b"}`,
        borderRadius: isLiam ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
        padding: "10px 14px",
        fontSize: 12.5, lineHeight: 1.75,
        color: isLiam ? "#bbf7d0" : "#e2e8f0"
      }}>
        <div style={{ fontSize: 8, letterSpacing: "0.12em", color: isLiam ? "#166534" : "#3730a3", marginBottom: 4 }}>
          {msg.from}
        </div>
        {isTyping ? displayText : msg.text}
        {isTyping && displayText.length < msg.text.length && (
          <span style={{
            display: "inline-block", width: 2, height: 12,
            background: isLiam ? "#16a34a" : "#6d28d9",
            marginLeft: 2, animation: "blink 0.7s infinite"
          }} />
        )}
      </div>
    </div>
  );
}

// ─── DEAL CARD ────────────────────────────────────────────────────────────────
function DealCard({ deal, flash }) {
  const cfg = CAT_CONFIG[deal.category];
  return (
    <div style={{
      background: flash ? `${cfg.bg}cc` : cfg.bg,
      border: `1px solid ${flash ? cfg.color : cfg.border}`,
      borderRadius: 6, padding: "8px 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.5s ease",
      boxShadow: flash ? `0 0 12px ${cfg.color}44` : "none",
      animation: flash ? "pulse 0.6s ease" : "none"
    }}>
      <div>
        <div style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 500 }}>{deal.name}</div>
        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>{deal.stage}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>{fmt(deal.value)}</div>
        <div style={{ fontSize: 8, color: cfg.color, letterSpacing: "0.1em", marginTop: 2 }}>{deal.category}</div>
      </div>
    </div>
  );
}

// ─── DEAL BOARD ───────────────────────────────────────────────────────────────
function DealBoard({ deals, flashId }) {
  const grouped = {
    COMMIT: deals.filter(d => d.category === "COMMIT"),
    UPSIDE: deals.filter(d => d.category === "UPSIDE"),
    PIPELINE: deals.filter(d => d.category === "PIPELINE"),
  };

  const total = deals.reduce((s, d) => s + d.value, 0);
  const commit = grouped.COMMIT.reduce((s, d) => s + d.value, 0);
  const upside = grouped.UPSIDE.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{
      background: "#080812",
      borderLeft: "1px solid #111124",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden"
    }}>
      {/* Board header */}
      <div style={{
        padding: "18px 20px 14px",
        borderBottom: "1px solid #111124"
      }}>
        <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#374151", marginBottom: 12 }}>
          LIAM O'BRIEN · LIVE PIPELINE
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "COMMIT", val: fmt(commit), color: "#22c55e" },
            { label: "UPSIDE", val: fmt(upside), color: "#f59e0b" },
            { label: "TOTAL", val: fmt(total), color: "#60a5fa" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em" }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: s.color, marginTop: 2 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {Object.entries(grouped).map(([cat, catDeals]) => {
          const cfg = CAT_CONFIG[cat];
          return (
            <div key={cat}>
              <div style={{
                fontSize: 8, letterSpacing: "0.15em", color: cfg.color,
                marginBottom: 8, display: "flex", alignItems: "center", gap: 6
              }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.color }} />
                {cfg.label} · {catDeals.length} deal{catDeals.length !== 1 ? "s" : ""}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {catDeals.length === 0 ? (
                  <div style={{ fontSize: 11, color: "#1f2937", padding: "8px 0" }}>—</div>
                ) : catDeals.map(d => (
                  <DealCard key={d.id} deal={d} flash={d.id === flashId} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ACTIVE MESSAGE ───────────────────────────────────────────────────────────
function ActiveMessage({ msg, onDone }) {
  const { out, done } = useTypewriter(msg.text, 18, true);
  useEffect(() => { if (done) onDone(); }, [done]);
  return <Bubble msg={msg} isTyping={!done} displayText={out} />;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ConversationalUpdate() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [messages, setMessages] = useState([]);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [activeMsg, setActiveMsg] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeMsg]);

  const playNext = (idx) => {
    if (idx >= SCRIPT.length) {
      setActiveMsg(null);
      setPlaying(false);
      setDone(true);
      return;
    }
    const msg = SCRIPT[idx];
    const delay = idx === 0 ? 400 : msg.from === "LIAM" ? 900 : 500;
    timerRef.current = setTimeout(() => {
      setActiveMsg({ ...msg, idx });
    }, delay);
  };

  const handleMsgDone = () => {
    const idx = activeMsg.idx;
    setMessages(prev => [...prev, SCRIPT[idx]]);
    setActiveMsg(null);

    // Move Meridian from COMMIT → UPSIDE after message index 6
    if (idx === MERIDIAN_MOVE_AFTER) {
      setTimeout(() => {
        setDeals(prev => prev.map(d =>
          d.id === "OPP-001" ? { ...d, category: "UPSIDE", updated: true } : d
        ));
        setFlashId("OPP-001");
        setTimeout(() => setFlashId(null), 2000);
      }, 400);
    }

    timerRef.current = setTimeout(() => playNext(idx + 1), 300);
  };

  const start = () => {
    if (playing || done) return;
    setPlaying(true);
    playNext(0);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setDeals(INITIAL_DEALS);
    setMessages([]);
    setActiveMsg(null);
    setScriptIdx(0);
    setPlaying(false);
    setDone(false);
    setFlashId(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#06060e",
      fontFamily: "'DM Mono', monospace",
      color: "#e2e8f0",
      display: "flex", flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #111124",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", letterSpacing: "0.08em" }}>
            PIPELINE
          </div>
          <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: "0.15em", marginTop: 2 }}>
            CONVERSATIONAL DEAL UPDATE · SELLER PULSE
          </div>
        </div>
        <button
          onClick={done ? reset : start}
          disabled={playing}
          style={{
            background: "transparent",
            border: `1px solid ${done ? "#0891b2" : playing ? "#1f2937" : "#6d28d9"}`,
            borderRadius: 8, padding: "8px 18px",
            color: done ? "#67e8f9" : playing ? "#374151" : "#c4b5fd",
            fontSize: 10, letterSpacing: "0.12em",
            cursor: playing ? "not-allowed" : "pointer",
            transition: "all 0.2s"
          }}
        >
          {playing ? "PLAYING..." : done ? "↺ RESET" : "▶ PLAY"}
        </button>
      </div>

      {/* Body — split */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
        minHeight: "calc(100vh - 60px)"
      }}>
        {/* Left — chat */}
        <div style={{
          display: "flex", flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Scene setter */}
          {messages.length === 0 && !activeMsg && (
            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column",
              gap: 12, padding: 32, textAlign: "center"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#0f1f0f", border: "1.5px solid #16a34a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#86efac"
              }}>LO</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, maxWidth: 300 }}>
                Liam O'Brien is about to update his pipeline.<br />
                <span style={{ color: "#4b5563" }}>No form. No CRM. Just a conversation.</span>
              </div>
              <div style={{ fontSize: 9, color: "#1f2937", letterSpacing: "0.15em", marginTop: 8 }}>
                PRESS PLAY TO BEGIN
              </div>
            </div>
          )}

          {/* Messages */}
          {(messages.length > 0 || activeMsg) && (
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "20px 20px 16px",
              display: "flex", flexDirection: "column", gap: 14
            }}>
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} isTyping={false} displayText={msg.text} />
              ))}
              {activeMsg && (
                <ActiveMessage msg={activeMsg} onDone={handleMsgDone} />
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Done footer */}
          {done && (
            <div style={{
              padding: "14px 20px",
              borderTop: "1px solid #111124",
              fontSize: 10, color: "#374151",
              letterSpacing: "0.1em", lineHeight: 1.8
            }}>
              Liam started with a Commit he couldn't defend.<br />
              <span style={{ color: "#4b5563" }}>He ended with a plan he owns.</span>
            </div>
          )}
        </div>

        {/* Right — deal board */}
        <DealBoard deals={deals} flashId={flashId} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e1e35; border-radius: 2px; }
      `}</style>
    </div>
  );
}
