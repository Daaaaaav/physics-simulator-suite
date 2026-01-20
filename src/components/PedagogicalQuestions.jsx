import { useState } from "react";

export default function PedagogicalQuestions({
  title = "Reflect & Explore",
  questions = [],
  onResetSignal = 0,   // change this to reset answers
}) {
  // Track answers
  const [answers, setAnswers] = useState({});

  // Reset when parent changes reset signal
  const handleReset = () => {
    setAnswers({});
  };

  // Update answer
  const setAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="graph-stack"> 
      <div className="graph-panel">
        <h4>{title}</h4>

        <div className="question-list">
          {questions.map((q, i) => (
            <div key={q.id || i} className="question-item">
              <p className="question-text">
                {i + 1}. {q.text}
              </p>

              {/* Multiple Choice */}
              {q.type === "mcq" && (
                <div className="mcq-options">
                  {q.options.map(opt => (
                    <label key={opt} className="mcq-label">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswer(q.id, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Short Answer / Reflection */}
              {q.type === "text" && (
                <textarea
                  placeholder="Type your reasoning here..."
                  value={answers[q.id] || ""}
                  onChange={e => setAnswer(q.id, e.target.value)}
                  className="reflection-box"
                />
              )}

              {/* Self-check hint (optional) */}
              {q.hint && answers[q.id] && (
                <p className="hint">
                  💡 Hint: {q.hint}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
