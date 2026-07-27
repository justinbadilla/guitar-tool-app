import "./ChordAssistantPanel.css";
import { useState, useEffect } from "react";
import { askChordQuestion, fetchChordOverview } from "../../api/chordAssistant";
import type { ChordOverview } from "../../api/chordAssistant";
import type { StringState } from "../../hooks/useFretboardState";

// ── Props ──────────────────────────────────────────────
interface ChordAssistantPanelProps {
    chordName: string;
    stringStates: StringState[];
    tuning: string[];
    onRequireAuth: () => void;
    isLoggedIn: boolean;
}

/**
 * ChordAssistantPanel
 *
 * AI overview of the currently fretted chord, auto-fetched with a debounce
 * (waits for user to stop changing frets before calling the backend)
 * Resets and re-fetches when chordName or tuning changes. New toggle feature to turn on or off
 * the feature. If switched on, checks login.
 */
function ChordAssistantPanel({ chordName, stringStates, tuning, onRequireAuth, isLoggedIn }: ChordAssistantPanelProps) {
    const [isEnabled, setIsEnabled] = useState(false);

    //chord overview
    const [overview, setOverview] = useState<ChordOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //chat responses
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [askedQuestion, setAskedQuestion] = useState<string | null>(null);
    const [answerLoading, setAnswerLoading] = useState(false);

    function handleToggle() {
        if (!isEnabled && !isLoggedIn) {
            onRequireAuth();
            return;
        }
        setIsEnabled((prev) => !prev);
    }

    useEffect(() => {
        if (!isEnabled) return;

        setOverview(null);
        setError(null);
        setAskedQuestion(null);
        setAnswer(null);
        setQuestion("");

        const timeoutId = setTimeout(() => {
            setLoading(true);
            fetchChordOverview(chordName, stringStates, tuning)
                .then((result) => {
                    setOverview(result);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError("Login for this feature");
                });
        }, 1500);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chordName, tuning, isEnabled]);

    function handleAskQuestion() {
        const trimmed = question.trim();
        if (trimmed === "") return;

        setAskedQuestion(trimmed);
        setAnswer(null);
        setAnswerLoading(true);
        setQuestion("");

        askChordQuestion(chordName, stringStates, tuning, trimmed)
            .then((result) => {
                setAnswer(result);
                setAnswerLoading(false);
            })
            .catch(() => {
                setAnswer("Sorry, something went wrong. Are you logged in?");
                setAnswerLoading(false);
            });
    }
    return (
        <div className="chord-assistant-panel">
            <div className="ai-toggle-row">
                <span>AI Chord Assistant</span>
                <button
                    className={`ai-toggle ${isEnabled ? "on" : ""}`}
                    onClick={handleToggle}
                >
                    <span className="ai-toggle-knob" />
                </button>
            </div>

            {isEnabled && (
                <>
                    <div className="ai-content">
                        {askedQuestion === null ? (
                            <>
                                {loading && <p className="ai-status">Thinking...</p>}
                                {error && <p className="ai-status ai-error">{error}</p>}

                                {overview && (
                                    <div className="ai-overview">
                                        <p>{overview.overview}</p>

                                        {overview.alternateNames.length > 0 && (
                                            <p><strong>Also known as:</strong> {overview.alternateNames.join(", ")}</p>
                                        )}

                                        {overview.keys.length > 0 && (
                                            <p><strong>Keys:</strong> {overview.keys.join(", ")}</p>
                                        )}

                                        {overview.nextChords.length > 0 && (
                                            <div>
                                                <strong>Try next:</strong>
                                                <ul>
                                                    {overview.nextChords.map((next, i) => (
                                                        <li key={i}>{next.chord} — {next.why}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="chord-qa-exchange">
                                <p className="chord-qa-question">Q: {askedQuestion}</p>
                                {answerLoading ? (
                                    <p className="ai-status">Thinking...</p>
                                ) : (
                                    <p className="chord-qa-answer">{answer}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="chord-qa-input-row">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAskQuestion(); }}
                            placeholder="Ask a question about this chord..."
                        />
                        <button className="btn btn-secondary btn-small" onClick={handleAskQuestion}>ask</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ChordAssistantPanel;