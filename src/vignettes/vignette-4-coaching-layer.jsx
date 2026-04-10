import { useState, useEffect, useRef } from "react";

// ─── DEAL SIGNAL DATA ───────────────────────────────────────────────────────
const DEAL = {
  name: "Meridian Group",
  value: "£340,000",
  stage: "Negotiation",
  category: "COMMIT",
  rep: "Liam O'Brien",
  rsm: "Sophie Hartley",
  signals: [
    { date: "14 Feb", event: "Moved to Commit", type: "positive" },
    { date: "28 Feb", event: "Close date slipped → 31 Mar", type: "warning" },
    { date: "12 Mar", event: "Champion (J. Walsh) last contacted", type: "warning" },
    { date: "24 Mar", event: "Close date slipped → 30 Apr", type: "danger" },
    { date: "01 Apr", event: "No activity logged — 20 days", type: "danger" },
  ]
};

// ─── CONVERSATION DATA ───────────────────────────────────────────────────────
const MARCUS_TO_SOPHIE = [
  { from: "MARCUS", text: "Sophie — Meridian has slipped twice. Champion's gone quiet. Liam hasn't logged activity in three weeks." },
  { from: "MARCUS", text: "I'm not asking what happened. I'm asking what happens next." },
  { from: "MARCUS", text: "This is a coaching moment, not a pipeline problem. Get in the deal with him." },
  { from: "SOPHIE", text: "On it. I'll speak to Liam today. I think he's protecting the number rather than working the deal." },
  { from: "MARCUS", text: "That's exactly the right read. Help him see the difference." },
];

const SOPHIE_TO_LIAM = [
  { from: "SOPHIE", text: "Liam — can we talk about Meridian? I want to understand where you are with it." },
  { from: "LIAM", text: "It's still in play. They're just moving slower than expected. I didn't want to move it out of Commit." },
  { from: "SOPHIE", text: "I hear that. But when did you last speak to James Walsh?" },
  { from: "LIAM", text: "... Three weeks ago. He's been hard to reach." },
  { from: "SOPHIE", text: "That's the deal, Liam. Not the timeline — the champion. What's your plan to get back in front of him this week?" },
  { from: "LIAM", text: "I'll reach out today. I think I've been avoiding the conversation if I'm honest." },
  { from: "SOPHIE", text: "That's the right instinct to name. Let's talk after you speak to him." },
];

// ─── TYPEWRITER HOOK ─────────────────────────────────────────────────────────
function useTypewriter(text, speed = 22, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active]);
  return { displayed, done };
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const AVATARS = {
  MARCUS: { initials: "MH", bg: "#1e1b4b", border: "#6d28d9", color: "#c4b5fd" },
  SOPHIE: { initials: "SH", bg: "#0f2027", border: "#0891b2", color: "#67e8f9" },
  LIAM:   { initials: "LO", bg: "#0f1f0f", border: "#16a34a", color: "#86efac" },
};

function Avatar({ name, size = 32 }) {
  const a = AVATARS[name] || AVATARS.MARCUS;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: a.bg, border: `1.5px solid ${a.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.28, fontWeight: 700, color: a.color,
      flexShrink: 0, letterSpacing: "0.05em"
    }}>{a.initials}</div>
  );
}

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────
function Bubble({ msg, isRight }) {
  return (
    <div style={{
      display: "flex", gap: 8,
      flexDirection: isRight ? "row-reverse" : "row",
      alignItems: "flex-start",
      animation: "fadeUp 0.35s ease"
    }}>
      <Avatar name={msg.from} size={28} />
      <div style={{
        maxWidth: "82%",
        background: isRight ? "#0f1a2e" : "#0d0d18",
        border: `1px solid ${isRight ? "#1e3a5f" : "#1e1e35"}`,
        borderRadius: isRight ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
        padding: "10px 13px",
        fontSize: 12.5,
        lineHeight: 1.7,
        color: isRight ? "#93c5fd" : "#e2e8f0",
      }}>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "#4b5563", display: "block", marginBottom: 4 }}>
          {msg.from}
        </span>
        {msg.text}
      </div>
    </div>
  );
}

// ─── SIGNAL TIMELINE ─────────────────────────────────────────────────────────
const sigColors = { positive: "#22c55e", warning: "#f59e0b", danger: "#ef4444" };

function SignalPanel({ visible }) {
  return (
    <div style={{
      background: "#0a0a10",
      border: "1px solid #1e1e2e",
      borderRadius: 12,
      padding: "22px 20px",
      height: "100%",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.6s ease",
    }}>
      <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#4b5563", marginBottom: 16 }}>DEAL SIGNAL</div>

      {/* Deal card */}
      <div style={{
        background: "#0d0d18", border: "1px solid #1e1e35",
        borderRadius: 8, padding: "14px 16px", marginBottom: 20
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{DEAL.name}</div>
        <div style={{ fontSize: 11, color: "#6d28d9", letterSpacing: "0.1em", marginBottom: 10 }}>{DEAL.value} · {DEAL.stage}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "#1e1b4b", color: "#a78bfa", letterSpacing: "0.1em" }}>
            {DEAL.category}
          </span>
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "#0f1f0f", color: "#86efac", letterSpacing: "0.1em" }}>
            {DEAL.rep}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 16 }}>
        <div style={{
          position: "absolute", left: 5, top: 6, bottom: 6,
          width: 1, background: "#1e1e2e"
        }} />
        {DEAL.signals.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            marginBottom: 14,
            animation: `fadeUp 0.4s ease ${i * 0.1}s both`
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: sigColors[s.type],
              flexShrink: 0, marginTop: 4,
              boxShadow: `0 0 6px ${sigColors[s.type]}66`
            }} />
            <div>
              <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: "0.1em", marginBottom: 2 }}>{s.date}</div>
              <div style={{ fontSize: 12, color: s.type === "danger" ? "#fca5a5" : s.type === "warning" ? "#fcd34d" : "#86efac" }}>
                {s.event}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System verdict */}
      <div style={{
        marginTop: 8,
        background: "#1c0a0a",
        border: "1px solid #7f1d1d",
        borderRadius: 8,
        padding: "10px 13px",
        fontSize: 11,
        color: "#fca5a5",
        lineHeight: 1.6
      }}>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "#ef4444", display: "block", marginBottom: 4 }}>
          SYSTEM · COACHING TRIGGER
        </span>
        2 slips detected. Champion dark 20 days. No activity logged. Escalating to RSM.
      </div>
    </div>
  );
}

// ─── CHAT PANEL ──────────────────────────────────────────────────────────────
function ChatPanel({ title, accent, messages, visibleCount, visible }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [visibleCount]);

  return (
    <div style={{
      background: "#0a0a10",
      border: `1px solid ${accent}22`,
      borderRadius: 12,
      display: "flex", flexDirection: "column",
      height: "100%",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.6s ease 0.2s",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${accent}22`,
        display: "flex", alignItems: "center", gap: 10
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <div style={{ fontSize: 9, letterSpacing: "0.18em", color: accent }}>{title}</div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 14
      }}>
        {messages.slice(0, visibleCount).map((msg, i) => {
          const senders = messages.map(m => m.from);
          const uniqueSenders = [...new Set(senders)];
          const isRight = msg.from === uniqueSenders[1];
          return <Bubble key={i} msg={msg} isRight={isRight} />;
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function CoachingLayer() {
  const [phase, setPhase] = useState(0);
  const [marcusCount, setMarcusCount] = useState(0);
  const [liamCount, setLiamCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const runSequence = () => {
    if (playing || done) return;
    setPlaying(true);
    setPhase(1);

    let mc = 0;
    let lc = 0;

    const addMarcus = () => {
      if (mc < MARCUS_TO_SOPHIE.length) {
        mc++;
        setMarcusCount(mc);
        timerRef.current = setTimeout(addMarcus, mc === MARCUS_TO_SOPHIE.length ? 800 : 1400);
      } else {
        setPhase(2);
        timerRef.current = setTimeout(addLiam, 794);
      }
    };

    const addLiam = () => {
      if (lc < SOPHIE_TO_LIAM.length) {
        lc++;
        setLiamCount(lc);
        timerRef.current = setTimeout(addLiam, lc === SOPHIE_TO_LIAM.length ? 0 : 1600);
      } else {
        setPlaying(false);
        setDone(true);
      }
    };

    timerRef.current = setTimeout(addMarcus, 1058);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setPhase(0); setMarcusCount(0); setLiamCount(0);
    setPlaying(false); setDone(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070710",
      fontFamily: "'DM Mono', monospace",
      display: "flex", flexDirection: "column",
      color: "#e2e8f0",
      padding: "28px 24px"
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", letterSpacing: "0.06em" }}>
            THE COACHING LAYER
          </div>
          <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.15em", marginTop: 3 }}>
            SELLER PULSE · SIGNAL → COACH → CONVERSATION
          </div>
        </div>

        <button
          onClick={done ? reset : runSequence}
          disabled={playing}
          style={{
            background: playing ? "transparent" : done ? "#0f2027" : "#1e1b4b",
            border: `1px solid ${playing ? "#2d2d4a" : done ? "#0891b2" : "#6d28d9"}`,
            borderRadius: 8, padding: "10px 20px",
            color: playing ? "#4b5563" : done ? "#67e8f9" : "#c4b5fd",
            fontSize: 11, letterSpacing: "0.1em",
            cursor: playing ? "not-allowed" : "pointer",
            transition: "all 0.2s"
          }}
        >
          {playing ? "PLAYING..." : done ? "↺ RESET" : "▶ PLAY SEQUENCE"}
        </button>
      </div>

      {/* Intro state */}
      {phase === 0 && (
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16, textAlign: "center"
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #1e1b4b, #4c1d95)",
            border: "2px solid #6d28d9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#c4b5fd"
          }}>MH</div>
          <div style={{ fontSize: 14, color: "#94a3b8", maxWidth: 380, lineHeight: 1.8 }}>
            A deal is slipping. The system has seen it.<br />
            Watch what happens next.
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "0.15em", marginTop: 8 }}>
            PRESS PLAY TO BEGIN
          </div>
        </div>
      )}

      {/* Three panel layout */}
      {phase > 0 && (
        <div style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr 1.1fr",
          gap: 16,
          minHeight: 520
        }}>
          <SignalPanel visible={phase >= 1} />
          <ChatPanel
            title="MARCUS → SOPHIE"
            accent="#6d28d9"
            messages={MARCUS_TO_SOPHIE}
            visibleCount={marcusCount}
            visible={phase >= 1}
          />
          <ChatPanel
            title="SOPHIE → LIAM"
            accent="#0891b2"
            messages={SOPHIE_TO_LIAM}
            visibleCount={liamCount}
            visible={phase >= 2}
          />
        </div>
      )}

      {/* Footer reveal */}
      {done && (
        <div style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 12,
          color: "#4b5563",
          letterSpacing: "0.1em",
          animation: "fadeUp 0.6s ease"
        }}>
          ONE SIGNAL. TWO CONVERSATIONS. THE CULTURE MARCUS BUILT.
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}
