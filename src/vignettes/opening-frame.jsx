import { useState, useEffect, useRef } from "react";

const LINES = [
  { text: "It's a discipline gap.", size: 32, weight: 700, color: "#f1f5f9", delay: 0, family: "syne" },
  { text: "Clean pipeline.", size: 24, weight: 600, color: "#a78bfa", delay:  1013, family: "syne" },
  { text: "Personal accountability.", size: 24, weight: 600, color: "#a78bfa", delay:  1772, family: "syne" },
  { text: "A coaching culture that actually scales.", size: 24, weight: 600, color: "#a78bfa", delay:  2530, family: "syne" },
  { text: "We've closed that gap before.", size: 20, weight: 400, color: "#94a3b8", delay:  3796, family: "mono" },
  { text: "A dozen times.", size: 20, weight: 400, color: "#94a3b8", delay:  4554, family: "mono" },
  { text: "Different names. Same playbook.", size: 20, weight: 600, color: "#f1f5f9", delay:  5566, family: "mono" },
];

export default function OpeningFrame() {
  const [visible, setVisible] = useState([]);
  const [showTagline, setShowTagline] = useState(false);
  const [started, setStarted] = useState(false);
  const timers = useRef([]);

  const start = () => {
    if (started) return;
    setStarted(true);

    timers.current = LINES.map((l, i) =>
      setTimeout(() => setVisible(v => [...v, i]), l.delay + 300)
    );

    timers.current.push(
      setTimeout(() => setShowTagline(true),  8147)
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setVisible([]);
    setShowTagline(false);
    setStarted(false);
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04040a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Mono', monospace",
      padding: "40px 24px",
      position: "relative"
    }}>

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        pointerEvents: "none"
      }} />

      {/* Device */}
      <div style={{
        width: "100%", maxWidth: 400,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}>

        {/* Pre-start */}
        {!started && (
          <div style={{
            textAlign: "center", marginBottom: 60,
            animation: "fadeUp 0.8s ease"
          }}>
            <div style={{
              fontSize: 9, letterSpacing: "0.3em",
              color: "#4b5563", marginBottom: 32,
              fontFamily: "'DM Mono', monospace"
            }}>SELLER PULSE · THE OPENING</div>
            <button onClick={start} style={{
              background: "transparent",
              border: "1px solid #a78bfa",
              borderRadius: 40, padding: "12px 32px",
              color: "#c4b5fd", fontSize: 10,
              letterSpacing: "0.2em", cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.3s",
              boxShadow: "0 0 20px #a78bfa22"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#a78bfa18";
                e.currentTarget.style.boxShadow = "0 0 30px #a78bfa44";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "0 0 20px #a78bfa22";
              }}
            >▶ BEGIN</button>
          </div>
        )}

        {/* Lines */}
        <div style={{
          width: "100%",
          display: "flex", flexDirection: "column",
          gap: 6, marginBottom: 48,
          minHeight: started ? "auto" : 0
        }}>
          {LINES.map((l, i) => (
            <div key={i} style={{
              fontSize: l.size,
              fontWeight: l.weight,
              color: l.color,
              lineHeight: 1.3,
              letterSpacing: l.family === "syne" ? "-0.02em" : "0.02em",
              fontFamily: l.family === "syne" ? "'Syne', sans-serif" : "'DM Mono', monospace",
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? "translateX(0)" : "translateX(-16px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              textShadow: i === 0 ? "0 0 40px #a78bfa22" : "none"
            }}>
              {/* Accent dot for middle three */}
              {i >= 1 && i <= 3 && (
                <span style={{
                  display: "inline-block",
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#6d28d9",
                  marginRight: 12, marginBottom: 2,
                  boxShadow: "0 0 8px #6d28d9",
                  verticalAlign: "middle"
                }} />
              )}
              {l.text}
            </div>
          ))}
        </div>

        {/* Tagline */}
        {showTagline && (
          <div style={{
            marginTop: 36, textAlign: "center",
            animation: "fadeUp 0.8s ease"
          }}>
            <div style={{
              fontSize: 9, color: "#4b5563",
              letterSpacing: "0.25em",
              fontFamily: "'DM Mono', monospace",
              lineHeight: 2
            }}>
              SELLER PULSE<br />
              <span style={{ color: "#1e1e2e" }}>THE STORY STARTS HERE</span>
            </div>

            <button onClick={reset} style={{
              marginTop: 20,
              background: "transparent",
              border: "1px solid #1e1e2e",
              borderRadius: 40, padding: "8px 24px",
              color: "#4b5563", fontSize: 9,
              letterSpacing: "0.15em", cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#6b7280";
                e.currentTarget.style.color = "#6b7280";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#1e1e2e";
                e.currentTarget.style.color = "#4b5563";
              }}
            >↺ AGAIN</button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Syne:wght@600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandWidth {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
