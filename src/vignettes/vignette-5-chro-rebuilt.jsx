import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const BOARDROOM = [
  {
    id: "ramp",
    label: "PREDICTABLE REVENUE GROWTH",
    metric: "£127k",
    sub: "revenue gap per seller per week over ramp",
    color: "#f87171",
    accent: "#7f1d1d",
    thesis: "Ramp time is the most undervalued revenue lever in this business. Every day over target is a number I can calculate. I own ramp. I own the cost of getting it wrong.",
    proof: [
      { label: "Current avg ramp", value: "94 days", target: "60 days", delta: "+34 days", bad: true },
      { label: "Sellers over ramp", value: "3 of 11", target: "0", delta: "£432k gap", bad: true },
      { label: "Top quartile ramp", value: "51 days", target: "60 days", delta: "9 days ahead", bad: false },
    ]
  },
  {
    id: "productivity",
    label: "PRODUCTIVITY",
    metric: "43%",
    sub: "of selling time lost to admin, fragmented systems & shadow tools",
    color: "#f59e0b",
    accent: "#78350f",
    thesis: "If a seller spends less than half their week actually selling, that is not a technology problem. It is a productivity drain I can quantify, own, and fix. Time selling versus time not selling. That is my metric now.",
    proof: [
      { label: "Time selling", value: "57%", target: "75%", delta: "-18pts", bad: true },
      { label: "CRM admin time", value: "22%", target: "10%", delta: "+12pts wasted", bad: true },
      { label: "Shadow AI usage", value: "7 of 11", target: "Sanctioned", delta: "Unsanctioned", bad: true },
    ]
  },
  {
    id: "innovation",
    label: "INNOVATION",
    metric: "68%",
    sub: "of sellers trained for licence — not consumption selling",
    color: "#a78bfa",
    accent: "#3b0764",
    thesis: "The shift to consumption requires a fundamentally different selling motion. Discovery, value realisation, expansion. Most of this team was hired and trained for licence. The skills gap is real. I am closing it before the CFO notices the contraction.",
    proof: [
      { label: "Consumption-ready sellers", value: "4 of 11", target: "11 of 11", delta: "7 to develop", bad: true },
      { label: "Expansion skill rating", value: "2.1 / 5", target: "4.0 / 5", delta: "Critical gap", bad: true },
      { label: "Training pipeline", value: "Q2 start", target: "Q1 start", delta: "1 qtr behind", bad: true },
    ]
  },
];

const DAYTODAY = [
  {
    id: "timetohire",
    label: "TIME TO HIRE",
    icon: "⏱",
    color: "#34d399",
    problem: "Every week a territory runs without a seller is pipeline that never gets built. We track days to fill. We should be tracking revenue gap per open head.",
    win: "Reframe open headcount as a revenue number. £127k per week per open seller role. That conversation changes how fast decisions get made.",
    metric: "£127k", metricSub: "per open head per week"
  },
  {
    id: "mobility",
    label: "PEOPLE MOBILITY",
    icon: "⇄",
    color: "#60a5fa",
    problem: "The best answer to a skills gap is often already in the building. We run mobility as an HR programme. It should be a commercial accelerator.",
    win: "The seller who can't close new logo might be exceptional at expansion. The SDR who understands consumption might be ready for a full cycle role six months ahead of schedule.",
    metric: "6 months", metricSub: "earlier to productivity via internal mobility"
  },
  {
    id: "skillsgap",
    label: "CLOSING SKILLS GAPS",
    icon: "△",
    color: "#e879f9",
    problem: "The consumption selling gap is the one the CFO and CRO both feel but neither owns. Discovery skills. Commercial storytelling. Value realisation conversations. Nobody is training for the motion we're actually running.",
    win: "I own this. Not as a training programme — as a revenue intervention. Every seller who can't run a value realisation conversation is a contraction risk the CFO hasn't priced yet.",
    metric: "1 in 3", metricSub: "deals lost at value realisation stage"
  },
  {
    id: "shadowai",
    label: "SHADOW AI",
    icon: "◈",
    color: "#f59e0b",
    problem: "Seven of eleven sellers are already using AI tools the business hasn't sanctioned. Inconsistent. Uncoached. Outside the data governance framework. This is happening with or without us.",
    win: "Bring it into the light. Not as a compliance exercise — as a productivity play. Sanctioned, coached, integrated. That is the innovation story I take to the board.",
    metric: "7 of 11", metricSub: "sellers using unsanctioned AI today"
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function BoardroomCard({ item, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: active ? `${item.color}0c` : "#0a0a14",
      border: `1px solid ${active ? item.color + "44" : "#1a1a2e"}`,
      borderRadius: 12, padding: "16px 18px",
      cursor: "pointer", transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.15em",
          color: item.color, fontWeight: 600
        }}>{item.label}</div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 24, fontWeight: 800, color: item.color,
            fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", lineHeight: 1
          }}>{item.metric}</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.6, marginBottom: active ? 14 : 0 }}>
        {item.sub}
      </div>

      {active && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={{
            fontSize: 12.5, color: "#94a3b8", lineHeight: 1.75,
            borderLeft: `2px solid ${item.color}44`,
            paddingLeft: 14, marginBottom: 14, fontStyle: "italic"
          }}>{item.thesis}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {item.proof.map((p, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                background: "#06060e", borderRadius: 6,
                padding: "7px 10px",
                border: `1px solid ${p.bad ? "#1f0a0a" : "#0a1f0a"}`
              }}>
                <div style={{ fontSize: 10, color: "#4b5563" }}>{p.label}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{p.value}</div>
                  <div style={{
                    fontSize: 10, fontWeight: 600,
                    color: p.bad ? "#f87171" : "#34d399",
                    background: p.bad ? "#1c0a0a" : "#0a1c0a",
                    padding: "2px 7px", borderRadius: 4
                  }}>{p.delta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DayToDayCard({ item, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: active ? `${item.color}0a` : "#0a0a14",
      border: `1px solid ${active ? item.color + "33" : "#1a1a2e"}`,
      borderRadius: 12, padding: "14px 16px",
      cursor: "pointer", transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: active ? 12 : 0 }}>
        <div style={{
          fontSize: 18, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#06060e", borderRadius: 8,
          border: `1px solid ${active ? item.color + "44" : "#1a1a2e"}`
        }}>{item.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: item.color, letterSpacing: "0.15em", marginBottom: 2 }}>
            {item.label}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: item.color, fontFamily: "'Syne', sans-serif" }}>
            {item.metric}
          </div>
        </div>
        {!active && (
          <div style={{ fontSize: 10, color: "#374151" }}>{item.metricSub}</div>
        )}
      </div>

      {active && (
        <div style={{ animation: "fadeUp 0.4s ease", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            fontSize: 11, color: "#6b7280", lineHeight: 1.7,
            background: "#06060e", borderRadius: 8, padding: "10px 12px",
            border: "1px solid #1a1a2e"
          }}>
            <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em", marginBottom: 4 }}>THE PROBLEM</div>
            {item.problem}
          </div>
          <div style={{
            fontSize: 11.5, color: "#e2e8f0", lineHeight: 1.75,
            background: `${item.color}08`, borderRadius: 8, padding: "10px 12px",
            border: `1px solid ${item.color}22`
          }}>
            <div style={{ fontSize: 8, color: item.color, letterSpacing: "0.12em", marginBottom: 4 }}>THE WIN</div>
            {item.win}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CHRORebuilt() {
  const [mode, setMode] = useState("boardroom");
  const [activeCard, setActiveCard] = useState(0);

  const toggle = (id) => setActiveCard(prev => prev === id ? null : id);

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
        padding: "18px 24px",
        borderBottom: "1px solid #111124",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "#1a0a2e", border: "2px solid #7c3aed",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#d8b4fe",
            boxShadow: "0 0 20px #7c3aed33"
          }}>CH</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", letterSpacing: "0.08em" }}>
              THE CHRO
            </div>
            <div style={{ fontSize: 9, color: "#7c3aed", letterSpacing: "0.15em", marginTop: 1 }}>
              PEOPLE STRATEGY · REVENUE TABLE
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: "flex", gap: 0,
          background: "#0a0a14", border: "1px solid #1a1a2e",
          borderRadius: 8, overflow: "hidden"
        }}>
          {[
            { key: "boardroom", label: "BOARDROOM" },
            { key: "daytoday", label: "DAY TO DAY" }
          ].map(m => (
            <button key={m.key} onClick={() => { setMode(m.key); setActiveCard(0); }} style={{
              padding: "8px 14px",
              background: mode === m.key ? "#1a0a2e" : "transparent",
              border: "none",
              color: mode === m.key ? "#d8b4fe" : "#374151",
              fontSize: 9, letterSpacing: "0.12em",
              cursor: "pointer", transition: "all 0.2s",
              borderRight: m.key === "boardroom" ? "1px solid #1a1a2e" : "none"
            }}>{m.label}</button>
          ))}
        </div>
      </div>

      {/* Subheader */}
      <div style={{
        padding: "14px 24px",
        borderBottom: "1px solid #0d0d1a",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.6, maxWidth: 500 }}>
          {mode === "boardroom"
            ? "How the people strategy shows up in predictable revenue growth, productivity and innovation."
            : "Fragmented systems. Poor data. Shadow AI. Where are the wins hiding?"}
        </div>
        <div style={{
          fontSize: 9, color: "#7c3aed", letterSpacing: "0.15em",
          whiteSpace: "nowrap", marginLeft: 16
        }}>
          {mode === "boardroom" ? "TAP TO EXPAND THESIS" : "TAP TO FIND THE WIN"}
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "20px 24px",
        display: "flex", flexDirection: "column", gap: 12,
        maxWidth: 720, width: "100%", margin: "0 auto"
      }}>

        {mode === "boardroom" && BOARDROOM.map((item, i) => (
          <BoardroomCard
            key={item.id}
            item={item}
            active={activeCard === i}
            onClick={() => toggle(i)}
          />
        ))}

        {mode === "daytoday" && DAYTODAY.map((item, i) => (
          <DayToDayCard
            key={item.id}
            item={item}
            active={activeCard === i}
            onClick={() => toggle(i)}
          />
        ))}

        {/* Footer thesis */}
        <div style={{
          marginTop: 12,
          padding: "18px 20px",
          background: "#0a0408",
          border: "1px solid #3b0764",
          borderRadius: 12
        }}>
          <div style={{
            fontSize: 9, color: "#7c3aed",
            letterSpacing: "0.15em", marginBottom: 10
          }}>THE BOARDROOM MOMENT</div>
          <div style={{
            fontSize: 13.5, color: "#e9d5ff",
            lineHeight: 1.85, fontStyle: "italic"
          }}>
            "Here is the direct line between our people strategy and our revenue number. Not a correlation. A mechanism. Ramp time, selling time, skills currency, mobility velocity. Every one of these is a number. Every number has an owner."
          </div>
          <div style={{
            fontSize: 15, fontWeight: 700, color: "#f1f5f9",
            marginTop: 10, fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.01em"
          }}>That owner is me.</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Syne:wght@600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1a0a2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}
