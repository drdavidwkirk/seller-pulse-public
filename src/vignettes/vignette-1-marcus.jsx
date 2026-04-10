import { useState, useEffect, useRef } from "react";

const TOPICS = [
  {
    id: 1,
    prompt: "How do you know if a pipeline is healthy?",
    tag: "PIPELINE",
    accent: "#60a5fa",
    response: `A healthy pipeline isn't a big pipeline.\n\nIt's an owned one. Every deal has someone who can tell you exactly where it is, what the next move is, and what happens if that move doesn't land. If the answer to any of those is vague — the pipeline isn't healthy, it's just full.\n\nI'd rather have six deals I believe in than twenty I'm hoping will close themselves.`
  },
  {
    id: 2,
    prompt: "What does Commit actually mean in your organisation?",
    tag: "FORECAST",
    accent: "#34d399",
    response: `It means certain.\n\nNot probable. Not confident. Certain.\n\nThe moment Commit becomes a range, the forecast becomes a guess. And a guess dressed up in a slide is still a guess.\n\nI hold that word to its meaning every single week. Because if I don't, everyone below me stops holding it too. Standards erode from the top. Always.`
  },
  {
    id: 3,
    prompt: "What do you expect from an RVP in a pipeline review?",
    tag: "LEADERSHIP",
    accent: "#f59e0b",
    response: `A point of view.\n\nNot a status update. Not a slide read back to me. A point of view — here's what I'm seeing, here's what I'm worried about, and here's what I've already done about it.\n\nIf you walk in and start narrating numbers, we have a problem. I can read. What I need from you is judgement. That's what I hired you for.`
  },
  {
    id: 4,
    prompt: "How do you think about a deal that keeps slipping?",
    tag: "ACCOUNTABILITY",
    accent: "#f87171",
    response: `One slip is business. Two slips is a pattern. Three slips is a decision someone hasn't made yet.\n\nMost of the time it's not a bad deal. It's a rep who's protecting a number instead of working a deal. They're carrying it because dropping it feels like failure.\n\nMy job — and their manager's job — is to help them see that the honest conversation is the braver one.`
  },
  {
    id: 5,
    prompt: "How do you build a coaching culture at scale?",
    tag: "COACHING",
    accent: "#e879f9",
    response: `You can't clone a great manager. But you can make the signal visible to everyone.\n\nCoaching doesn't fail because leaders don't care. It fails because they don't see the moment until it's too late. The deal has already slipped. The rep has already lost confidence. The quarter is already written.\n\nIf I can surface the signal at the right moment — not as a red flag, but as a question — then a decent manager becomes a great one. That's the culture I'm building.`
  },
  {
    id: 6,
    prompt: "What separates the best revenue organisations from the rest?",
    tag: "STANDARD",
    accent: "#a78bfa",
    response: `They don't wait to find out what happened.\n\nThey already know. Because they've built a culture where pipeline is owned, not reported. Where accountability is personal, not organisational. Where the coaching happens before the problem becomes a crisis.\n\nThe best organisations I've seen aren't smarter. They're earlier. They see it coming and they do something about it while there's still time to change the outcome.\n\nThat's the standard. Everything else is just reporting the news.`
  }
];

const TAG_COLORS = {
  PIPELINE: "#60a5fa",
  FORECAST: "#34d399",
  LEADERSHIP: "#f59e0b",
  ACCOUNTABILITY: "#f87171",
  COACHING: "#e879f9",
  STANDARD: "#a78bfa"
};

function TypingText({ text, active, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(ref.current);
        onDone?.();
      }
    }, 16);
    return () => clearInterval(ref.current);
  }, [active, text]);

  return (
    <span style={{ whiteSpace: "pre-line" }}>
      {displayed}
      {active && displayed.length < text.length && (
        <span style={{
          display: "inline-block", width: 2, height: 13,
          background: "#6d28d9", marginLeft: 2,
          animation: "blink 0.7s infinite"
        }} />
      )}
    </span>
  );
}

export default function MarcusVignette() {
  const [selected, setSelected] = useState(null);
  const [typing, setTyping] = useState(false);
  const [answered, setAnswered] = useState([]);
  const [showClose, setShowClose] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected, typing]);

  const handleSelect = (topic) => {
    if (typing || answered.includes(topic.id)) return;
    setSelected(topic);
    setTyping(true);
    setShowClose(false);
  };

  const handleDone = () => {
    setTyping(false);
    setAnswered(prev => [...prev, selected.id]);
    if (answered.length + 1 >= TOPICS.length) {
      setTimeout(() => setShowClose(true), 794);
    }
  };

  const remaining = TOPICS.filter(t => !answered.includes(t.id) && t.id !== selected?.id);
  const answeredTopics = TOPICS.filter(t => answered.includes(t.id));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#06060e",
      fontFamily: "'DM Mono', monospace",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* Header */}
      <div style={{
        padding: "24px 32px 20px",
        borderBottom: "1px solid #1e1e2e",
        display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
          border: "2px solid #6d28d9",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: "#c4b5fd",
          boxShadow: "0 0 20px #6d28d922"
        }}>MH</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", letterSpacing: "0.08em" }}>
            MARCUS HALE
          </div>
          <div style={{ fontSize: 10, color: "#6d28d9", letterSpacing: "0.18em", marginTop: 2 }}>
            CHIEF REVENUE OFFICER
          </div>
        </div>
        <div style={{
          marginLeft: "auto", fontSize: 9,
          color: "#4b5563", letterSpacing: "0.12em", textAlign: "right", lineHeight: 1.8
        }}>
          <div style={{ color: "#16a34a" }}>● LIVE</div>
          <div>SELLER PULSE</div>
        </div>
      </div>

      {/* Opening statement */}
      <div style={{
        padding: "28px 32px 0",
        maxWidth: 680
      }}>
        <div style={{
          fontSize: 13.5, lineHeight: 1.9, color: "#94a3b8",
          borderLeft: "2px solid #6d28d933",
          paddingLeft: 20,
          animation: "fadeUp 0.7s ease"
        }}>
          Most revenue leaders I meet are very good at describing the problem.<br />
          <span style={{ color: "#e2e8f0" }}>Fewer are willing to own it.</span>
        </div>
      </div>

      {/* Conversation area */}
      <div style={{
        flex: 1,
        padding: "24px 32px",
        display: "flex", flexDirection: "column", gap: 24,
        maxWidth: 720, width: "100%"
      }}>

        {/* Previous answers */}
        {answeredTopics.filter(topic => !selected || topic.id !== selected.id).map(topic => (
          <div key={topic.id} style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{
              fontSize: 11, color: "#6b7280", marginBottom: 10,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{ color: TAG_COLORS[topic.tag], fontSize: 9, letterSpacing: "0.12em" }}>
                {topic.tag}
              </span>
              <span>{topic.prompt}</span>
            </div>
            <div style={{
              background: "#0d0d18", border: "1px solid #1a1a30",
              borderRadius: "4px 14px 14px 14px",
              padding: "14px 18px",
              fontSize: 13, lineHeight: 1.8, color: "#94a3b8",
              whiteSpace: "pre-line"
            }}>{topic.response}</div>
          </div>
        ))}

        {/* Active answer */}
        {selected && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{
              fontSize: 11, color: "#6b7280", marginBottom: 10,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{ color: TAG_COLORS[selected.tag], fontSize: 9, letterSpacing: "0.12em" }}>
                {selected.tag}
              </span>
              <span>{selected.prompt}</span>
            </div>
            <div style={{
              background: "#0d0d18", border: "1px solid #1a1a30",
              borderRadius: "4px 14px 14px 14px",
              padding: "14px 18px",
              fontSize: 13, lineHeight: 1.8, color: "#e2e8f0"
            }}>
              <TypingText
                text={selected.response}
                active={typing}
                onDone={handleDone}
              />
            </div>
          </div>
        )}

        {/* Closing line */}
        {showClose && (
          <div style={{
            marginTop: 8, paddingTop: 24,
            borderTop: "1px solid #1e1e2e",
            fontSize: 13, color: "#4b5563",
            letterSpacing: "0.06em", lineHeight: 1.8,
            animation: "fadeUp 0.8s ease"
          }}>
            <span style={{ color: "#6d28d9" }}>—</span>{" "}
            The difference between a good revenue organisation and a great one<br />
            isn't the technology. It's the standard the leader sets. Every week. Without exception.
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Prompt selector */}
      {!showClose && (
        <div style={{
          borderTop: "1px solid #1e1e2e",
          background: "#080812",
          padding: "18px 32px"
        }}>
          {remaining.length > 0 && (
            <>
              <div style={{
                fontSize: 9, color: "#6b7280",
                letterSpacing: "0.18em", marginBottom: 12
              }}>ASK MARCUS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {remaining.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelect(topic)}
                    disabled={typing}
                    style={{
                      background: "transparent",
                      border: `1px solid ${topic.accent}28`,
                      borderRadius: 8,
                      padding: "8px 14px",
                      color: "#6b7280",
                      fontSize: 11.5,
                      cursor: typing ? "not-allowed" : "pointer",
                      opacity: typing ? 0.35 : 1,
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 8,
                      textAlign: "left"
                    }}
                    onMouseEnter={e => {
                      if (typing) return;
                      e.currentTarget.style.borderColor = `${topic.accent}55`;
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.background = `${topic.accent}08`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = `${topic.accent}28`;
                      e.currentTarget.style.color = "#6b7280";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{
                      fontSize: 8, letterSpacing: "0.12em",
                      color: topic.accent, fontWeight: 600, flexShrink: 0
                    }}>{topic.tag}</span>
                    {topic.prompt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e1e35; border-radius: 2px; }
      `}</style>
    </div>
  );
}
