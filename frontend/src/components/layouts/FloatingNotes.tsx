// components/layout/FloatingNotes.tsx
import "./FloatingNotes.css";

const NOTE_SYMBOLS = ["♪", "♫", "♩", "♬"];
const NOTE_COUNT = 20;

interface FloatingNote {
    id: number;
    symbol: string;
    left: number;
    bottom: number;
    delay: number;
    duration: number;
}

// Generated once per component mount, not on every render
const notes: FloatingNote[] = Array.from({ length: NOTE_COUNT }, (_, i) => ({
    id: i,
    symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
    left: Math.random() * 120,
    bottom: Math.random() * 60,
    delay: Math.random() * 6,
    duration: 5 + Math.random() * 3,
}));

function FloatingNotes() {
    return (
        <div className="floating-notes-container">
            {notes.map((note) => (
                <span
                    key={note.id}
                    className="floating-note"
                    style={{
                        left: `${note.left}%`,
                        bottom: `${note.bottom}%`,
                        animationDelay: `${note.delay}s`,
                        animationDuration: `${note.duration}s`,
                    }}
                >
                    {note.symbol}
                </span>
            ))}
        </div>
    );
}

export default FloatingNotes;