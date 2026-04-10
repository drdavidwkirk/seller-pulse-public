import { useState, useEffect, useRef } from "react";

// ─── SEQUENCE ─────────────────────────────────────────────────────────────────
const SEQUENCE = [
  // ACT 1 — THE PROVOCATION
  { type: "line", text: "You bought a SaaS business.", size: 32, color: "#f1f5f9", weight: 700, bg: "#07070f", hold: 2530 },
  { type: "line", text: "You're selling a consumption story.", size: 28, color: "#94a3b8", weight: 400, bg: "#07070f", hold: 2530 },
  { type: "line", text: "And your CRO is still forecasting\nlike it's 2019.", size: 26, color: "#f87171", weight: 600, bg: "#07070f", hold: 3220 },
  { type: "pause", bg: "#07070f", hold: 920 },
  { type: "line", text: "The PE firm has a meeting\nin ninety days.", size: 24, color: "#94a3b8", weight: 400, bg: "#07070f", hold: 2760 },
  { type: "line", text: "How confident are you\nin that number?", size: 30, color: "#f1f5f9", weight: 700, bg: "#07070f", hold: 3450 },
  { type: "pause", bg: "#07070f", hold: 690 },

  // ACT 2 — THE PLAYERS ASSEMBLE
  {
    type: "player",
    avatar: "MH", name: "MARCUS HALE", role: "CRO",
    line: "I don't report the news.\nI make it.",
    avatarBg: "#1e1b4b", avatarBorder: "#6d28d9", avatarColor: "#c4b5fd",
    accent: "#a78bfa", bg: "#07070f", hold: 3450
  },
  {
    type: "player",
    avatar: "FI", name: "FIONA", role: "CFO · GROWTH PARTNER",
    line: "Show me a number\nI can defend.",
    avatarBg: "#0a1628", avatarBorder: "#1d4ed8", avatarColor: "#93c5fd",
    accent: "#60a5fa", bg: "#07070f", hold: 3450
  },
  {
    type: "player",
    avatar: "JC", name: "JAMES CALLOWAY", role: "RVP",
    line: "I need to know\nbefore week nine.",
    avatarBg: "#0f1a10", avatarBorder: "#15803d", avatarColor: "#86efac",
    accent: "#34d399", bg: "#07070f", hold: 3220
  },
  {
    type: "player",
    avatar: "SH", name: "SOPHIE HARTLEY", role: "RSM",
    line: "I was already\nin the deal.",
    avatarBg: "#1c1200", avatarBorder: "#92400e", avatarColor: "#fcd34d",
    accent: "#f59e0b", bg: "#07070f", hold: 3220
  },
  {
    type: "player",
    avatar: "LO", name: "LIAM O'BRIEN", role: "SELLER",
    line: "I knew.\nI just hadn't said it yet.",
    avatarBg: "#0f1f0f", avatarBorder: "#166534", avatarColor: "#86efac",
    accent: "#34d399", bg: "#07070f", hold: 3220
  },

  // ACT 3 — THE FOUR PRINCIPLES
  { type: "tenet", number: "01", text: "Make the news.", sub: "Don't report it.", accent: "#a78bfa", hold: 2530 },
  { type: "tenet", number: "02", text: "Pipeline health\nis everything.", sub: "All else follows.", accent: "#34d399", hold: 2530 },
  { type: "tenet", number: "03", text: "Coaching is why\nteams win.", sub: null, accent: "#f59e0b", hold: 2530 },
  { type: "tenet", number: "04", text: "Revenue\ncures all ills.", sub: null, accent: "#60a5fa", hold: 4140 },
  { type: "pause", bg: "#07070f", hold: 1150 },

  // ACT 4 — THE CLOSE
  { type: "close", hold: 9000 },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useReveal(active, delay = 100) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return visible;
}

// ─── FRAMES ───────────────────────────────────────────────────────────────────
function LineFrame({ step, active }) {
  const visible = useReveal(active, 80);
  if (step.type === "pause") return <div style={{ flex: 1, background: step.bg }} />;

  return (
    <div style={{
      flex: 1, background: step.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 44px", textAlign: "center"
    }}>
      <div style={{
        fontSize: step.size,
        fontWeight: step.weight,
        color: step.color,
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
        whiteSpace: "pre-line",
        fontFamily: "'Syne', sans-serif",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        textShadow: step.color === "#f87171" ? "0 0 40px #f8717144" : "none"
      }}>{step.text}</div>
    </div>
  );
}

function PlayerFrame({ step, active }) {
  const p1 = useReveal(active, 100);
  const p2 = useReveal(active, 500);
  const p3 = useReveal(active, 1000);

  return (
    <div style={{
      flex: 1, background: step.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 44px", textAlign: "center", gap: 20
    }}>
      {/* Avatar */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: step.avatarBg,
        border: `2px solid ${step.avatarBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 700, color: step.avatarColor,
        fontFamily: "'DM Mono', monospace",
        boxShadow: `0 0 30px ${step.avatarBorder}55`,
        opacity: p1 ? 1 : 0,
        transform: p1 ? "scale(1)" : "scale(0.8)",
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>{step.avatar}</div>

      {/* Name / role */}
      <div style={{
        opacity: p2 ? 1 : 0,
        transform: p2 ? "translateY(0)" : "translateY(8px)",
        transition: "all 0.5s ease"
      }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#f1f5f9",
          letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace",
          marginBottom: 4
        }}>{step.name}</div>
        <div style={{
          fontSize: 9, color: step.accent,
          letterSpacing: "0.2em", fontFamily: "'DM Mono', monospace"
        }}>{step.role}</div>
      </div>

      {/* Line */}
      <div style={{
        opacity: p3 ? 1 : 0,
        transform: p3 ? "translateY(0)" : "translateY(8px)",
        transition: "all 0.6s ease",
        borderTop: `1px solid ${step.accent}33`,
        paddingTop: 20, width: "100%"
      }}>
        <div style={{
          fontSize: 20, fontWeight: 600, color: "#f1f5f9",
          lineHeight: 1.4, whiteSpace: "pre-line",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "-0.01em"
        }}>{step.line}</div>
      </div>
    </div>
  );
}

function TenetFrame({ step, active }) {
  const visible = useReveal(active, 150);

  return (
    <div style={{
      flex: 1,
      background: "#07070f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 44px", textAlign: "center",
      position: "relative", overflow: "hidden"
    }}>
      {/* Ghost number */}
      <div style={{
        position: "absolute",
        fontSize: 180, fontWeight: 800,
        color: `${step.accent}07`,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Syne', sans-serif",
        userSelect: "none", pointerEvents: "none",
        letterSpacing: "-0.05em"
      }}>{step.number}</div>

      <div style={{
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.25em",
          color: step.accent, marginBottom: 16,
          fontFamily: "'DM Mono', monospace"
        }}>PRINCIPLE {step.number}</div>

        <div style={{
          fontSize: 34, fontWeight: 800,
          color: "#f8fafc", lineHeight: 1.15,
          whiteSpace: "pre-line",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "-0.02em",
          marginBottom: step.sub ? 10 : 0
        }}>{step.text}</div>

        {step.sub && (
          <div style={{
            fontSize: 20, color: step.accent,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 400
          }}>{step.sub}</div>
        )}

        <div style={{
          width: 32, height: 2,
          background: step.accent,
          margin: "20px auto 0",
          boxShadow: `0 0 10px ${step.accent}`
        }} />
      </div>
    </div>
  );
}

function CloseFrame({ active }) {
  const l1 = useReveal(active, 200);
  const l2 = useReveal(active, 800);
  const l3 = useReveal(active, 1600);
  const l4 = useReveal(active, 2400);

  return (
    <div style={{
      flex: 1, background: "#07070f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 44px", textAlign: "center", gap: 0
    }}>
      {/* Four tenets stacked */}
      {[
        { text: "Make the news.", color: "#a78bfa", show: l1, size: 22 },
        { text: "Own the pipeline.", color: "#34d399", show: l2, size: 22 },
        { text: "Coach the team.", color: "#f59e0b", show: l3, size: 22 },
        { text: "Close the gap.", color: "#60a5fa", show: l4, size: 22 },
      ].map((l, i) => (
        <div key={i} style={{
          fontSize: l.size, fontWeight: 700, color: l.color,
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "-0.01em",
          lineHeight: 1.8,
          opacity: l.show ? 1 : 0,
          transform: l.show ? "translateX(0)" : "translateX(-16px)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>{l.text}</div>
      ))}

      {/* Divider */}
      {l4 && (
        <div style={{
          width: 40, height: 1,
          background: "#6b7280",
          margin: "24px auto",
          animation: "fadeIn 0.8s ease"
        }} />
      )}

      {/* Tagline */}
      {l4 && (
        <div style={{
          fontSize: 11, color: "#4b5563",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.12em", lineHeight: 1.8,
          animation: "fadeIn 1s ease 0.3s both"
        }}>
          Revenue cures all ills.<br />
          <span style={{ color: "#6b7280" }}>But only if you build the culture to earn it.</span>
        </div>
      )}

      {/* David Kirk */}
      {l4 && (
        <div style={{
          marginTop: 28,
          display: "flex", alignItems: "center",
          gap: 10, animation: "fadeIn 1s ease 0.8s both"
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #1e1b4b, #4c1d95)",
            border: "1.5px solid #6d28d9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#c4b5fd",
            fontFamily: "'DM Mono', monospace"
          }}>DK</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, color: "#f1f5f9", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>
              DAVID KIRK
            </div>
            <div style={{ fontSize: 9, color: "#6b7280", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace" }}>
              COMMERCIAL EFFECTIVENESS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS DOTS ────────────────────────────────────────────────────────────
function Dots({ total, current }) {
  const accent = current < 7 ? "#f87171" : current < 12 ? "#a78bfa" : current < 16 ? "#f59e0b" : "#60a5fa";
  return (
    <div style={{ display: "flex", gap: 3, padding: "10px 16px 0", justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 18 : 4, height: 4, borderRadius: 2,
          background: i <= current ? accent : "#1e1e2e",
          transition: "all 0.3s ease"
        }} />
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MoviePreview() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const timer = useRef(null);

  const advance = (idx) => {
    if (idx >= SEQUENCE.length) {
      setPlaying(false);
      setEnded(true);
      return;
    }
    setStep(idx);
    timer.current = setTimeout(() => advance(idx + 1), SEQUENCE[idx].hold);
  };

  const start = () => {
    if (playing) return;
    setPlaying(true);
    setEnded(false);
    advance(0);
  };

  const reset = () => {
    clearTimeout(timer.current);
    setStep(-1);
    setPlaying(false);
    setEnded(false);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const current = step >= 0 ? SEQUENCE[step] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030308",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'DM Mono', monospace"
    }}>
      {/* Device */}
      <div style={{
        width: "100%", maxWidth: 390,
        background: "#07070f",
        border: "1px solid #12121f",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 40px 100px #000000aa, 0 0 0 1px #ffffff08",
        display: "flex", flexDirection: "column",
        minHeight: 700
      }}>
        {/* Progress */}
        {playing && <Dots total={SEQUENCE.length} current={step} />}

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Start screen */}
          {step === -1 && !ended && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "48px 40px", textAlign: "center", gap: 0
            }}>
              {/* Film mark */}
              <div style={{
                fontSize: 9, letterSpacing: "0.3em", color: "#4b5563",
                marginBottom: 40, fontFamily: "'DM Mono', monospace"
              }}>● ● ●</div>

              <div style={{
                fontSize: 11, letterSpacing: "0.25em",
                color: "#6b7280", marginBottom: 20,
                fontFamily: "'DM Mono', monospace"
              }}>SELLER PULSE</div>

              <div style={{
                fontSize: 38, fontWeight: 800,
                color: "#f8fafc", lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontFamily: "'Syne', sans-serif",
                marginBottom: 8
              }}>The movie<br />starts here.</div>

              <div style={{
                fontSize: 13, color: "#6b7280",
                lineHeight: 1.8, marginBottom: 48,
                maxWidth: 260
              }}>
                Four principles.<br />
                Six players.<br />
                One pipeline.<br />
                One exit.
              </div>

              <button onClick={start} style={{
                background: "transparent",
                border: "1px solid #f87171",
                borderRadius: 40, padding: "13px 36px",
                color: "#f87171", fontSize: 11,
                letterSpacing: "0.2em", cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.25s",
                boxShadow: "0 0 20px #f8717122"
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#f8717112";
                  e.currentTarget.style.boxShadow = "0 0 30px #f8717144";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "0 0 20px #f8717122";
                }}
              >▶ PLAY</button>
            </div>
          )}

          {/* Active step */}
          {playing && current && (
            <>
              {(current.type === "line" || current.type === "pause") && (
                <LineFrame step={current} active={playing} key={step} />
              )}
              {current.type === "player" && (
                <PlayerFrame step={current} active={playing} key={step} />
              )}
              {current.type === "tenet" && (
                <TenetFrame step={current} active={playing} key={step} />
              )}
              {current.type === "close" && (
                <CloseFrame active={playing} key={step} />
              )}
            </>
          )}

          {/* End screen */}
          {ended && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "48px 40px", textAlign: "center", gap: 20
            }}>
              <div style={{
                fontSize: 9, letterSpacing: "0.25em",
                color: "#6b7280", fontFamily: "'DM Mono', monospace"
              }}>THE STORY CONTINUES</div>

              <div style={{
                fontSize: 22, fontWeight: 700, color: "#f1f5f9",
                lineHeight: 1.4, fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.01em"
              }}>Watch what happens<br />when a team stops<br />reporting the news.</div>

              <div style={{
                width: 32, height: 1,
                background: "#a78bfa",
                boxShadow: "0 0 10px #a78bfa"
              }} />

              <div style={{
                fontSize: 10, color: "#6b7280",
                letterSpacing: "0.12em", lineHeight: 2,
                fontFamily: "'DM Mono', monospace"
              }}>
                DAVID KIRK<br />
                <span style={{ color: "#4b5563" }}>COMMERCIAL EFFECTIVENESS</span>
              </div>

              <button onClick={reset} style={{
                marginTop: 16,
                background: "transparent",
                border: "1px solid #4b5563",
                borderRadius: 40, padding: "10px 28px",
                color: "#6b7280", fontSize: 10,
                letterSpacing: "0.15em", cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#6b7280"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#4b5563"}
              >↺ WATCH AGAIN</button>
            </div>
          )}
        </div>
      </div>

      <div style={{
        marginTop: 16, fontSize: 9, color: "#12121f",
        letterSpacing: "0.2em", textAlign: "center",
        fontFamily: "'DM Mono', monospace"
      }}>
        LINKEDIN · INSTAGRAM · SELLER PULSE
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
