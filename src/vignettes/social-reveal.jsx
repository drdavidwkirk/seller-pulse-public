import { useState, useEffect, useRef } from "react";

const FRAMES = [
  // ── OPENING ──────────────────────────────────────────────────────────────
  {
    id: "open",
    type: "opening",
    lines: [
      { text: "Most revenue leaders", size: 28, color: "#94a3b8", weight: 400, delay: 0 },
      { text: "are very good at", size: 28, color: "#94a3b8", weight: 400, delay: 345 },
      { text: "describing the problem.", size: 28, color: "#f1f5f9", weight: 600, delay: 690 },
      { text: "Fewer are willing", size: 22, color: "#6b7280", weight: 400, delay: 1380 },
      { text: "to own it.", size: 22, color: "#a78bfa", weight: 600, delay: 1725 },
    ],
    hold: 4600,
  },

  // ── TENET 1 ───────────────────────────────────────────────────────────────
  {
    id: "t1",
    type: "tenet",
    number: "01",
    tenet: "Make the news.",
    sub: "Don't report it.",
    accent: "#a78bfa",
    hold: 3450,
  },
  {
    id: "t1-mirror",
    type: "mirror",
    player: "MARCUS HALE · CRO",
    avatar: "MH",
    avatarBg: "#1e1b4b",
    avatarBorder: "#6d28d9",
    avatarColor: "#c4b5fd",
    accent: "#a78bfa",
    truth: "You're in the room.\nYou have the data.\nThe question is whether you're\ndescribing what happened —\nor deciding what happens next.",
    mirror: "When did you last\nmake the news?",
    hold: 5750,
  },

  // ── TENET 2 ───────────────────────────────────────────────────────────────
  {
    id: "t2",
    type: "tenet",
    number: "02",
    tenet: "Pipeline health",
    sub: "is everything. All else follows.",
    accent: "#34d399",
    hold: 3450,
  },
  {
    id: "t2-mirror",
    type: "mirror",
    player: "LIAM O'BRIEN · SELLER",
    avatar: "LO",
    avatarBg: "#0f1f0f",
    avatarBorder: "#16a34a",
    avatarColor: "#86efac",
    accent: "#34d399",
    truth: "He had a £340k deal in Commit.\nThe economic buyer had been\ndark for three weeks.\nHe knew.\nHe just hadn't said it yet.",
    mirror: "A bad quarter isn't a\nclosing problem.\nIt's a pipeline problem\nnobody named\nthree months ago.",
    hold: 6325,
  },

  // ── TENET 3 ───────────────────────────────────────────────────────────────
  {
    id: "t3",
    type: "tenet",
    number: "03",
    tenet: "Coaching is why",
    sub: "teams win.",
    accent: "#f59e0b",
    hold: 3450,
  },
  {
    id: "t3-mirror",
    type: "mirror",
    player: "SOPHIE HARTLEY · RSM",
    avatar: "SH",
    avatarBg: "#1c1200",
    avatarBorder: "#92400e",
    avatarColor: "#fcd34d",
    accent: "#f59e0b",
    truth: "She didn't wait for the\nproblem to reach her.\nShe was already in the deal.\nAsking the question\nLiam needed to hear.",
    mirror: "Talent gets you\ninto the game.\nCoaching wins it.",
    hold: 5750,
  },

  // ── TENET 4 ───────────────────────────────────────────────────────────────
  {
    id: "t4",
    type: "tenet",
    number: "04",
    tenet: "Revenue",
    sub: "cures all ills.",
    accent: "#60a5fa",
    hold: 4830,
  },
  {
    id: "t4-mirror",
    type: "mirror",
    player: "FIONA · CFO · GROWTH PARTNER",
    avatar: "CF",
    avatarBg: "#0a1628",
    avatarBorder: "#1d4ed8",
    avatarColor: "#93c5fd",
    accent: "#60a5fa",
    truth: "Your CRO just presented\nthe forecast.\nHow much of it do\nyou actually believe?",
    mirror: "The pipeline is not\na sales metric.\nIt is a business\nhealth metric.",
    hold: 5750,
  },

  // ── CHRO MIRROR ───────────────────────────────────────────────────────────
  {
    id: "chro-mirror",
    type: "mirror",
    player: "ANNA · CHRO · PEOPLE LEADER",
    avatar: "HR",
    avatarBg: "#1a0a2e",
    avatarBorder: "#7c3aed",
    avatarColor: "#d8b4fe",
    accent: "#e879f9",
    truth: "You invested in\nleadership development.\nYour best salespeople\nare still being managed\nby a quota and a dashboard.",
    mirror: "Coaching at scale\nisn't a programme.\nIt's a culture.\nSet by the leader.\nEvery week.",
    hold: 6325,
  },

  // ── CLOSE ─────────────────────────────────────────────────────────────────
  {
    id: "close",
    type: "close",
    lines: [
      { text: "The best organisations", size: 24, color: "#94a3b8", weight: 400, delay: 0 },
      { text: "aren't smarter.", size: 24, color: "#f1f5f9", weight: 600, delay: 460 },
      { text: "They're earlier.", size: 32, color: "#a78bfa", weight: 700, delay: 1035 },
      { text: "They see it coming.", size: 16, color: "#6b7280", weight: 400, delay: 1840 },
      { text: "And they do something about it", size: 16, color: "#6b7280", weight: 400, delay: 2300 },
      { text: "while there's still time.", size: 16, color: "#94a3b8", weight: 500, delay: 2760 },
    ],
    hold: 5750,
  },
];

// ─── OPENING / CLOSE FRAME ────────────────────────────────────────────────────
function TextFrame({ frame, progress }) {
  const [visible, setVisible] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    setVisible([]);
    timers.current.forEach(clearTimeout);
    timers.current = frame.lines.map((l, i) =>
      setTimeout(() => setVisible(v => [...v, i]), l.delay)
    );
    return () => timers.current.forEach(clearTimeout);
  }, [frame.id]);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 48px", textAlign: "center", gap: 8
    }}>
      {frame.lines.map((l, i) => (
        <div key={i} style={{
          fontSize: l.size, fontWeight: l.weight, color: l.color,
          lineHeight: 1.3, letterSpacing: "-0.01em",
          opacity: visible.includes(i) ? 1 : 0,
          transform: visible.includes(i) ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s ease",
          fontFamily: "'Syne', sans-serif",
        }}>{l.text}</div>
      ))}
    </div>
  );
}

// ─── TENET FRAME ─────────────────────────────────────────────────────────────
function TenetFrame({ frame }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 265);
    return () => clearTimeout(t);
  }, [frame.id]);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 48px", textAlign: "center", position: "relative"
    }}>
      {/* Big number */}
      <div style={{
        position: "absolute", fontSize: 160, fontWeight: 800,
        color: `${frame.accent}08`,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        letterSpacing: "-0.05em",
        fontFamily: "'Syne', sans-serif",
        userSelect: "none", pointerEvents: "none"
      }}>{frame.number}</div>

      <div style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.7s ease",
        position: "relative"
      }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.25em",
          color: frame.accent, marginBottom: 20,
          fontFamily: "'DM Mono', monospace"
        }}>PRINCIPLE {frame.number}</div>

        <div style={{
          fontSize: 38, fontWeight: 800, color: "#f8fafc",
          lineHeight: 1.1, letterSpacing: "-0.02em",
          fontFamily: "'Syne', sans-serif",
          marginBottom: 8
        }}>{frame.tenet}</div>

        <div style={{
          fontSize: 28, fontWeight: 400, color: frame.accent,
          lineHeight: 1.2, letterSpacing: "-0.01em",
          fontFamily: "'Syne', sans-serif",
        }}>{frame.sub}</div>

        {/* Accent line */}
        <div style={{
          width: 48, height: 2, background: frame.accent,
          margin: "24px auto 0",
          boxShadow: `0 0 12px ${frame.accent}`
        }} />
      </div>
    </div>
  );
}

// ─── MIRROR FRAME ─────────────────────────────────────────────────────────────
function MirrorFrame({ frame }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    setPhase(0);
    timers.current.forEach(clearTimeout);
    timers.current = [
      setTimeout(() => setPhase(1), 397),
      setTimeout(() => setPhase(2), 1852),
      setTimeout(() => setPhase(3), 3703),
    ];
    return () => timers.current.forEach(clearTimeout);
  }, [frame.id]);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "36px 40px", justifyContent: "center", gap: 28
    }}>
      {/* Player */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateX(0)" : "translateX(-12px)",
        transition: "all 0.6s ease"
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: frame.avatarBg,
          border: `2px solid ${frame.avatarBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: frame.avatarColor,
          boxShadow: `0 0 16px ${frame.avatarBorder}44`,
          fontFamily: "'DM Mono', monospace",
          flexShrink: 0
        }}>{frame.avatar}</div>
        <div>
          <div style={{
            fontSize: 9, letterSpacing: "0.2em",
            color: frame.accent,
            fontFamily: "'DM Mono', monospace"
          }}>{frame.player}</div>
        </div>
      </div>

      {/* Truth */}
      <div style={{
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.7s ease",
        borderLeft: `2px solid ${frame.accent}44`,
        paddingLeft: 20
      }}>
        <div style={{
          fontSize: 15, color: "#94a3b8", lineHeight: 1.85,
          whiteSpace: "pre-line",
          fontFamily: "'DM Mono', monospace"
        }}>{frame.truth}</div>
      </div>

      {/* Mirror — the uncomfortable truth aimed at viewer */}
      <div style={{
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.8s ease",
        background: `${frame.accent}0c`,
        border: `1px solid ${frame.accent}33`,
        borderRadius: 12,
        padding: "18px 20px"
      }}>
        <div style={{
          fontSize: 8, letterSpacing: "0.2em",
          color: frame.accent, marginBottom: 10,
          fontFamily: "'DM Mono', monospace"
        }}>THE MIRROR</div>
        <div style={{
          fontSize: 17, fontWeight: 600, color: "#f1f5f9",
          lineHeight: 1.6, whiteSpace: "pre-line",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "-0.01em"
        }}>{frame.mirror}</div>
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ total, current, accent }) {
  return (
    <div style={{
      display: "flex", gap: 3, padding: "12px 16px 0"
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 2, borderRadius: 1,
          background: i <= current ? accent : "#1e1e2e",
          transition: "background 0.3s ease"
        }} />
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SocialReveal() {
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const timerRef = useRef(null);
  const frame = FRAMES[frameIdx];

  // Get accent for progress bar
  const getAccent = () => {
    const f = FRAMES[frameIdx];
    if (f.accent) return f.accent;
    if (frameIdx === 0) return "#a78bfa";
    if (frameIdx === FRAMES.length - 1) return "#a78bfa";
    return "#a78bfa";
  };

  const advance = (idx) => {
    if (idx >= FRAMES.length) {
      setPlaying(false);
      setEnded(true);
      return;
    }
    setFrameIdx(idx);
    timerRef.current = setTimeout(() => advance(idx + 1), FRAMES[idx].hold);
  };

  const start = () => {
    if (playing) return;
    setPlaying(true);
    setEnded(false);
    setFrameIdx(0);
    timerRef.current = setTimeout(() => advance(1), FRAMES[0].hold);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setFrameIdx(0);
    setPlaying(false);
    setEnded(false);
  };

  const goTo = (i) => {
    if (!playing) return;
    clearTimeout(timerRef.current);
    setFrameIdx(i);
    timerRef.current = setTimeout(() => advance(i + 1), FRAMES[i].hold);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      fontFamily: "'DM Mono', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px"
    }}>
      {/* Device frame */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#0a0a14",
        border: "1px solid #1a1a2e",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 32px 80px #00000088",
        display: "flex",
        flexDirection: "column",
        minHeight: 680
      }}>
        {/* Progress */}
        <ProgressBar
          total={FRAMES.length}
          current={frameIdx}
          accent={getAccent()}
        />

        {/* Frame content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 580 }}>
          {!playing && !ended ? (
            // Start screen
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "40px 32px", textAlign: "center", gap: 16
            }}>
              <div style={{
                fontSize: 9, letterSpacing: "0.25em",
                color: "#6b7280",
                marginBottom: 8
              }}>SELLER PULSE · DAVID KIRK</div>
              <div style={{
                fontSize: 32, fontWeight: 800, color: "#f8fafc",
                lineHeight: 1.1, letterSpacing: "-0.02em",
                fontFamily: "'Syne', sans-serif"
              }}>Four things<br />I know<br />to be true.</div>
              <div style={{
                fontSize: 13, color: "#4b5563", lineHeight: 1.8,
                maxWidth: 280, marginTop: 8
              }}>About revenue. About pipeline.<br />About the leaders who own it.</div>
              <button onClick={start} style={{
                marginTop: 24,
                background: "transparent",
                border: "1px solid #a78bfa",
                borderRadius: 40, padding: "12px 32px",
                color: "#c4b5fd", fontSize: 11,
                letterSpacing: "0.15em", cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Mono', monospace"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#a78bfa18"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >▶ BEGIN</button>
            </div>
          ) : ended ? (
            // End screen
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "40px 32px", textAlign: "center", gap: 20
            }}>
              <div style={{
                fontSize: 26, fontWeight: 700, color: "#f1f5f9",
                lineHeight: 1.3, letterSpacing: "-0.02em",
                fontFamily: "'Syne', sans-serif"
              }}>Make the news.<br />Own the pipeline.<br />Coach the team.<br />Close the gap.</div>
              <div style={{
                width: 40, height: 1, background: "#a78bfa",
                boxShadow: "0 0 10px #a78bfa"
              }} />
              <div style={{
                fontSize: 11, color: "#4b5563", lineHeight: 1.8,
                letterSpacing: "0.05em"
              }}>Revenue cures all ills.<br />But only if you build the right culture<br />to earn it.</div>
              <button onClick={reset} style={{
                marginTop: 12,
                background: "transparent",
                border: "1px solid #6b7280",
                borderRadius: 40, padding: "10px 28px",
                color: "#6b7280", fontSize: 10,
                letterSpacing: "0.15em", cursor: "pointer",
                fontFamily: "'DM Mono', monospace"
              }}>↺ WATCH AGAIN</button>
            </div>
          ) : (
            // Active frames
            <>
              {frame.type === "opening" && <TextFrame frame={frame} />}
              {frame.type === "tenet" && <TenetFrame frame={frame} />}
              {frame.type === "mirror" && <MirrorFrame frame={frame} />}
              {frame.type === "close" && <TextFrame frame={frame} />}
            </>
          )}
        </div>

        {/* Nav dots */}
        {playing && (
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 6, padding: "12px 16px 20px"
          }}>
            {FRAMES.map((_, i) => (
              <div key={i} onClick={() => goTo(i)} style={{
                width: i === frameIdx ? 20 : 6,
                height: 6, borderRadius: 3,
                background: i === frameIdx ? getAccent() : "#1e1e2e",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Outside label */}
      <div style={{
        marginTop: 20, fontSize: 9, color: "#4b5563",
        letterSpacing: "0.18em", textAlign: "center"
      }}>
        LINKEDIN · INSTAGRAM · TAP TO ADVANCE
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
