import "./ChordNameDisplay.css";

interface ChordNameDisplayProps {
    chordName: string;
}

function ChordNameDisplay({ chordName }: ChordNameDisplayProps) {
    return (
        <div className="chord-name-display">
            {chordName}
        </div>
    );
}

export default ChordNameDisplay;