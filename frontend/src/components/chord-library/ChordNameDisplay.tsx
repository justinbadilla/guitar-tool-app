import "./ChordNameDisplay.css";

interface ChordNameDisplayProps {
    chordName: string;
}

/**
 * ChordNameDisplay
 * 
 * displays chord name grabbed from parameters
 * For pages to show interactive fretboard chord name
 * Called from individual pages
 */
function ChordNameDisplay({ chordName }: ChordNameDisplayProps) {
    return (
        <div className="chord-name-display">
            {chordName}
        </div>
    );
}

export default ChordNameDisplay;