import { useState, useEffect, useRef } from "react";

// ─── TIMING CONFIG ────────────────────────────────────────────────────────────
// Change these values to adjust all transition speeds at deployment
const TIMING = {
  messageDelay: {
    CFO: 1000,      // Pause before CFO speaks
    MARCUS: 1400,   // Pause before Marcus responds
    SYSTEM: 600,    // Pause before system surfaces data
  },
  typingSpeed: 16,  // ms per character (lower = faster)
  dealFlashDuration: 2400, // How long a deal highlights when referenced
  scrollDelay: 120, // ms before auto-scroll after new message
};

// ─── DEALS ───────────────────────────────────────────────────────────────────
const INITIAL_DEALS = [
  { id: "OPP-001", name: "Meridian Group",    value: 340000, category: "COMMIT",   stage: "Negotiation", weeks: 6,  risk: true  },
  { id: "OPP-002", name: "Ashton & Co",       value: 180000, category: "COMMIT",   stage: "Proposal",    weeks: 2,  risk: false },
  { id: "OPP-003", name: "Vertex Systems",    value: 220000, category: "COMMIT",   stage: "Evaluation",  weeks: 3,  risk: false },
  { id: "OPP-004", name: "Crestline UK",      value: 95000,  category: "UPSIDE",   stage: "Discovery",   weeks: 1,  risk: false },
  { id: "OPP-005", name: "Parkfield Group",   value: 410000, category: "UPSIDE",   stage: "Qualify",     weeks: 4,  risk: true  },
  { id: "OPP-006", name: "Thorngate Ltd",     value: 155000, category: "PIPELINE", stage: "Discovery",   weeks: 2,  risk: false },
];

const TARGET_MONTH   = 740000;
const PE_RUNRATE     = 4200000;
const HEADCOUNT_COST = 127000;

// ─── SCRIPT ──────────────────────────────────────────────────────────────────
// Each message can optionally trigger a deal move or a deal highlight
const SCRIPT = [
  {
    from: "CFO",
    text: "Marcus. What have you got for me this month.",
  },
  {
    from: "MARCUS",
    text: "We're looking at £740k Commit. Meridian, Ashton, and Vertex are the three anchors. Coverage is solid.",
  },
  {
    from: "CFO",
    text: "Meridian. You've had that in Commit for six weeks. Walk me through it.",
    highlight: "OPP-001"
  },
  {
    from: "MARCUS",
    text: "Final negotiations. Legal on both sides are aligned. Waiting on their CFO to countersign.",
  },
  {
    from: "CFO",
    text: "Their CFO. When did you last speak to him directly.",
    highlight: "OPP-001"
  },
  {
    from: "MARCUS",
    text: "... Procurement have been our primary contact for the last three weeks.",
  },
  {
    from: "CFO",
    text: "So you haven't spoken to the economic buyer in three weeks and it's in Commit. That's not a Commit, Marcus. That's hope.",
    highlight: "OPP-001",
    moveDeal: { id: "OPP-001", to: "UPSIDE" }
  },
  {
    from: "SYSTEM",
    text: "Meridian Group moved COMMIT → UPSIDE. Monthly Commit revised to £400k.",
    isAlert: true
  },
  {
    from: "CFO",
    text: "I need you to hear something. I've approved three senior hires this quarter based on your pipeline projection. That's £127k of committed headcount costs landing whether these deals close or not. I backed your plan. Now I need the plan to be real.",
    context: true
  },
  {
    from: "MARCUS",
    text: "Understood. Parkfield is sitting in Upside but I think it's moveable. I have a call with their CEO on Thursday.",
    highlight: "OPP-005"
  },
  {
    from: "CFO",
    text: "Parkfield is £410k and it's been in Upside for four weeks. What's the actual blocker.",
    highlight: "OPP-005"
  },
  {
    from: "MARCUS",
    text: "Budget approval at board level. Their CEO is supportive but needs sign-off. Thursday's call is to get a committed timeline.",
  },
  {
    from: "CFO",
    text: "If you get a committed timeline on Thursday, move it to Commit. Not before. I also need you to know — the PE firm review is in 47 days. We're running at £380k short on the exit run rate target. Every deal that slips costs us more than the deal. It costs us the story.",
    context: true
  },
  {
    from: "MARCUS",
    text: "I hear you. With Meridian in Upside we're at £400k Commit. If Parkfield converts Thursday that takes us to £810k. That's above target.",
  },
  {
    from: "CFO",
    text: "So what's your number. Your real number. The one you'd bet your job on.",
  },
  {
    from: "MARCUS",
    text: "£400k certain. £810k if Parkfield lands. I'll know by Thursday.",
  },
  {
    from: "CFO",
    text: "Thursday then. And Marcus — get back in front of Meridian's CFO today. Not procurement. The CFO. That deal is not dead. But it will be if we wait another week.",
    highlight: "OPP-001"
  },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CAT_CONFIG = {
  COMMIT:   { color: "#22c55e", bg: "#0f2010", border: "#14532d" },
  UPSIDE:   { color: "#f59e0b", bg: "#1c1200", border: "#78350f" },
  PIPELINE: { color: "#60a5fa", bg: "#0a1628", border: "#1e3a5f" },
};

const AVATAR = {
  CFO:    { bg: "#0a1628", border: "#1d4ed8", color: "#93c5fd", label: "CFO" },
  MARCUS: { bg: "#1e1b4b", border: "#6d28d9", color: "#c4b5fd", label: "MH" },
  SYSTEM: { bg: "#0a0a14", border: "#374151", color: "#6b7280", label: "S" },
};

const fmt = v => `£${(v / 1000).toFixed(0)}k`;

// ─── ACTIVE MESSAGE ───────────────────────────────────────────────────────────
function ActiveMessage({ msg, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef();

  useEffect(() => {
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setDisplayed(msg.text.slice(0, i));
      if (i >= msg.text.length) { clearInterval(ref.current); setDone(true); }
    }, TIMING.typingSpeed);
    return () => clearInterval(ref.current);
  }, []);

  useEffect(() => { if (done) onDone(); }, [done]);

  return <Bubble msg={msg} displayText={displayed} isTyping={!done} />;
}

// ─── BUBBLE ───────────────────────────────────────────────────────────────────
function Bubble({ msg, displayText, isTyping }) {
  const isCFO = msg.from === "CFO";
  const isSystem = msg.from === "SYSTEM";
  const av = AVATAR[msg.from] || AVATAR.SYSTEM;
  const text = displayText !== undefined ? displayText : msg.text;

  if (isSystem) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px",
        background: "#0a0a14",
        border: "1px solid #1e3a5f",
        borderRadius: 8,
        animation: "fadeUp 0.3s ease"
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#60a5fa",
          boxShadow: "0 0 6px #60a5fa",
          flexShrink: 0
        }} />
        <div style={{
          fontSize: 11, color: "#60a5fa",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.06em"
        }}>{text}
          {isTyping && text.length < msg.text.length && (
            <span style={{
              display: "inline-block", width: 2, height: 10,
              background: "#60a5fa", marginLeft: 2,
              animation: "blink 0.7s infinite"
            }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", gap: 8,
      flexDirection: isCFO ? "row" : "row-reverse",
      alignItems: "flex-start",
      animation: "fadeUp 0.3s ease"
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: av.bg, border: `1.5px solid ${av.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 8, fontWeight: 700, color: av.color,
        fontFamily: "'DM Mono', monospace"
      }}>{av.label}</div>

      <div style={{
        maxWidth: "80%",
        background: isCFO
          ? (msg.context ? "#0d1a10" : "#080d18")
          : "#0d0d1f",
        border: `1px solid ${isCFO
          ? (msg.context ? "#14532d" : "#1e3a5f")
          : "#1e1b4b"}`,
        borderRadius: isCFO ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
        padding: "10px 13px",
        fontSize: 12.5, lineHeight: 1.75,
        color: isCFO
          ? (msg.context ? "#86efac" : "#e2e8f0")
          : "#c4b5fd",
        fontFamily: "'DM Mono', monospace"
      }}>
        <div style={{
          fontSize: 8, letterSpacing: "0.12em",
          color: isCFO
            ? (msg.context ? "#16a34a" : "#1d4ed8")
            : "#4c1d95",
          marginBottom: 4
        }}>
          {msg.from}{msg.context ? " · COMMERCIAL CONTEXT" : ""}
        </div>
        {text}
        {isTyping && text.length < msg.text.length && (
          <span style={{
            display: "inline-block", width: 2, height: 11,
            background: isCFO ? "#60a5fa" : "#6d28d9",
            marginLeft: 2, animation: "blink 0.7s infinite"
          }} />
        )}
      </div>
    </div>
  );
}

// ─── DEAL CARD ────────────────────────────────────────────────────────────────
function DealCard({ deal, flash, moved }) {
  const cfg = CAT_CONFIG[deal.category];
  return (
    <div style={{
      background: flash ? `${cfg.bg}ee` : cfg.bg,
      border: `1px solid ${flash ? cfg.color : cfg.border}`,
      borderRadius: 6, padding: "8px 11px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.5s ease",
      boxShadow: flash ? `0 0 14px ${cfg.color}44` : "none",
      position: "relative", overflow: "hidden"
    }}>
      {moved && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 2, background: cfg.color,
          boxShadow: `0 0 8px ${cfg.color}`,
          animation: "slideIn 0.4s ease"
        }} />
      )}
      <div>
        <div style={{ fontSize: 11.5, color: "#f1f5f9", fontWeight: 500 }}>{deal.name}</div>
        <div style={{ fontSize: 9, color: "#4b5563", marginTop: 1 }}>{deal.stage} · {deal.weeks}w</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, color: cfg.color, fontWeight: 700 }}>{fmt(deal.value)}</div>
        <div style={{ fontSize: 8, color: cfg.color, letterSpacing: "0.08em", marginTop: 1 }}>
          {deal.category}
        </div>
      </div>
    </div>
  );
}

// ─── DEAL BOARD ───────────────────────────────────────────────────────────────
function DealBoard({ deals, flashId, movedId }) {
  const commit  = deals.filter(d => d.category === "COMMIT");
  const upside  = deals.filter(d => d.category === "UPSIDE");
  const pipe    = deals.filter(d => d.category === "PIPELINE");

  const commitVal = commit.reduce((s, d) => s + d.value, 0);
  const upsideVal = upside.reduce((s, d) => s + d.value, 0);
  const shortfall = TARGET_MONTH - commitVal;

  return (
    <div style={{
      background: "#080812",
      borderLeft: "1px solid #111124",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden"
    }}>
      {/* Board header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #111124" }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.18em",
          color: "#374151", marginBottom: 12
        }}>LIVE PIPELINE · THIS MONTH</div>

        {/* Numbers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            { label: "COMMIT", val: fmt(commitVal), color: "#22c55e" },
            { label: "TARGET", val: fmt(TARGET_MONTH), color: "#60a5fa" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#0d0d18", border: "1px solid #1a1a2e",
              borderRadius: 7, padding: "8px 10px"
            }}>
              <div style={{ fontSize: 7, color: "#374151", letterSpacing: "0.12em" }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Shortfall */}
        <div style={{
          background: shortfall > 0 ? "#1c0a0a" : "#0a1c0a",
          border: `1px solid ${shortfall > 0 ? "#7f1d1d" : "#14532d"}`,
          borderRadius: 7, padding: "7px 10px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            fontSize: 8, color: shortfall > 0 ? "#f87171" : "#34d399",
            letterSpacing: "0.1em"
          }}>
            {shortfall > 0 ? "SHORTFALL" : "ABOVE TARGET"}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: shortfall > 0 ? "#f87171" : "#34d399"
          }}>
            {shortfall > 0 ? `-${fmt(shortfall)}` : `+${fmt(Math.abs(shortfall))}`}
          </div>
        </div>

        {/* PE context */}
        <div style={{
          marginTop: 8, padding: "7px 10px",
          background: "#0a0a0a",
          border: "1px solid #111124",
          borderRadius: 7,
          fontSize: 9, color: "#374151", lineHeight: 1.6
        }}>
          <span style={{ color: "#1d4ed8" }}>PE REVIEW</span> · 47 days ·{" "}
          <span style={{ color: "#f87171" }}>£380k short on exit run rate</span>
        </div>
      </div>

      {/* Deals */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "12px 14px",
        display: "flex", flexDirection: "column", gap: 14
      }}>
        {[
          { label: "COMMIT", color: "#22c55e", deals: commit },
          { label: "UPSIDE", color: "#f59e0b", deals: upside },
          { label: "PIPELINE", color: "#60a5fa", deals: pipe },
        ].map(({ label, color, deals: section }) => (
          <div key={label}>
            <div style={{
              fontSize: 8, letterSpacing: "0.15em", color,
              marginBottom: 6, display: "flex", alignItems: "center", gap: 5
            }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: color }} />
              {label} · {fmt(section.reduce((s, d) => s + d.value, 0))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {section.length === 0
                ? <div style={{ fontSize: 10, color: "#1f2937", padding: "4px 0" }}>—</div>
                : section.map(d => (
                  <DealCard
                    key={d.id} deal={d}
                    flash={d.id === flashId}
                    moved={d.id === movedId}
                  />
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CFOConversation() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [messages, setMessages] = useState([]);
  const [activeMsg, setActiveMsg] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const [movedId, setMovedId] = useState(null);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, TIMING.scrollDelay);
  }, [messages, activeMsg]);

  const flash = (id) => {
    setFlashId(id);
    setTimeout(() => setFlashId(null), TIMING.dealFlashDuration);
  };

  const moveDeal = (id, to) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, category: to } : d));
    setMovedId(id);
    setTimeout(() => setMovedId(null), 2000);
  };

  const playNext = (idx) => {
    if (idx >= SCRIPT.length) {
      setActiveMsg(null);
      setPlaying(false);
      setDone(true);
      return;
    }

    const msg = SCRIPT[idx];
    const delay = TIMING.messageDelay[msg.from] || 800;

    timerRef.current = setTimeout(() => {
      if (msg.highlight) flash(msg.highlight);
      setActiveMsg({ ...msg, idx });
    }, delay);
  };

  const handleMsgDone = () => {
    const idx = activeMsg.idx;
    const msg = SCRIPT[idx];

    setMessages(prev => [...prev, msg]);
    setActiveMsg(null);

    if (msg.moveDeal) {
      setTimeout(() => moveDeal(msg.moveDeal.id, msg.moveDeal.to), 300);
    }

    timerRef.current = setTimeout(() => playNext(idx + 1), 350);
  };

  const start = () => {
    if (playing || done) return;
    setPlaying(true);
    playNext(0);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setDeals(INITIAL_DEALS);
    setMessages([]); setActiveMsg(null);
    setPlaying(false); setDone(false);
    setFlashId(null); setMovedId(null);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

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
        padding: "14px 22px",
        borderBottom: "1px solid #111124",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[
            { label: "CF", name: "CFO", sub: "GROWTH PARTNER", bg: "#0a1628", border: "#1d4ed8", color: "#93c5fd" },
            { label: "MH", name: "MARCUS HALE", sub: "CRO", bg: "#1e1b4b", border: "#6d28d9", color: "#c4b5fd" },
          ].map(p => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: p.bg, border: `1.5px solid ${p.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: p.color
              }}>{p.label}</div>
              <div>
                <div style={{ fontSize: 11, color: "#f1f5f9", letterSpacing: "0.06em" }}>{p.name}</div>
                <div style={{ fontSize: 8, color: p.border, letterSpacing: "0.12em" }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={done ? reset : start}
          disabled={playing}
          style={{
            background: "transparent",
            border: `1px solid ${done ? "#1d4ed8" : playing ? "#1f2937" : "#1d4ed8"}`,
            borderRadius: 8, padding: "8px 18px",
            color: done ? "#93c5fd" : playing ? "#374151" : "#93c5fd",
            fontSize: 10, letterSpacing: "0.12em",
            cursor: playing ? "not-allowed" : "pointer",
            transition: "all 0.2s"
          }}
        >
          {playing ? "IN SESSION..." : done ? "↺ RESET" : "▶ BEGIN SESSION"}
        </button>
      </div>

      {/* Split body */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        overflow: "hidden",
        minHeight: "calc(100vh - 62px)"
      }}>
        {/* Left — conversation */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Pre-play */}
          {!playing && !done && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "32px 28px", textAlign: "center", gap: 14
            }}>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, maxWidth: 300 }}>
                The CFO doesn't look at charts.<br />
                <span style={{ color: "#4b5563" }}>He asks questions that make<br />people defend their numbers.</span>
              </div>
              <div style={{
                marginTop: 8, padding: "12px 18px",
                background: "#080d18", border: "1px solid #1e3a5f",
                borderRadius: 10, fontSize: 12,
                color: "#93c5fd", lineHeight: 1.7,
                fontStyle: "italic", maxWidth: 280
              }}>
                "What have you got for me this month."
              </div>
              <div style={{ fontSize: 9, color: "#1f2937", letterSpacing: "0.15em", marginTop: 8 }}>
                PRESS BEGIN SESSION
              </div>
            </div>
          )}

          {/* Messages */}
          {(playing || done) && (
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "18px 18px 12px",
              display: "flex", flexDirection: "column", gap: 12
            }}>
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} />
              ))}
              {activeMsg && (
                <ActiveMessage msg={activeMsg} onDone={handleMsgDone} />
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Closing line */}
          {done && (
            <div style={{
              padding: "14px 20px",
              borderTop: "1px solid #111124",
              background: "#07070f",
              fontSize: 11, color: "#4b5563",
              lineHeight: 1.8, animation: "fadeUp 0.6s ease"
            }}>
              Commit is a contract.<br />
              <span style={{ color: "#6b7280" }}>The CFO holds everyone to it — including himself.</span>
            </div>
          )}
        </div>

        {/* Right — deal board */}
        <DealBoard deals={deals} flashId={flashId} movedId={movedId} />
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
        @keyframes slideIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e1e35; border-radius: 2px; }
      `}</style>
    </div>
  );
}
