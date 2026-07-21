import "./SectionEditor.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import type { Section } from "./type";

interface SectionEditorProps {
    section: Section;
    onUpdateName: (name: string) => void;
    onRemoveSection: () => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: string) => void;
    onUpdateLyrics: (itemId: string, text: string) => void;
    onOpenChordPicker: (itemId: string) => void;
    onRemoveChord: (itemId: string, chordIndex: number) => void;
}

/**
 * SectionEditor
 *
 * Renders one song section: editable name, dynamic list of
 * user-added item boxes (chords, pedal, lyrics), and a "+" button
 * to add more. 
 * Presentational only - state changes are reported upward
 */
function SectionEditor({
    section,
    onUpdateName,
    onRemoveSection,
    onAddItem,
    onRemoveItem,
    onUpdateLyrics,
    onOpenChordPicker,
    onRemoveChord,
}: SectionEditorProps) {

    function handleRemoveSection() {
        const confirmed = window.confirm(
            `Delete section "${section.name}"? This will remove everything inside it and cannot be undone.`
        );
        if (confirmed) {
            onRemoveSection();
        }
    }

    return (
        <div className="section-box">
            <div className="section-header">
                <input
                    type="text"
                    value={section.name}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="section-name-input"
                />
                <button className="remove-button" onClick={handleRemoveSection}>x</button>
            </div>

            {section.items.map((item) => {
                if (item.type === "chords") {
                    return (
                        <div key={item.id} className="chord-progression-box">
                            <div className="section-item-header">
                                <span>Chord Progression</span>
                                <button className="remove-button" onClick={() => onRemoveItem(item.id)}>x</button>
                            </div>

                            {item.chords.map((chord, index) => (
                                <div key={chord.id ?? index} className="chord-progression-item">
                                    <ChordDiagram
                                        positions={chord.positions}
                                        name={chord.name}
                                        tuning={chord.tuning}
                                    />
                                    <button className="remove-button" onClick={() => onRemoveChord(item.id, index)}>x</button>
                                </div>
                            ))}

                            <button className="add-button" onClick={() => onOpenChordPicker(item.id)}>+ Add Chord</button>
                        </div>
                    );
                }

                if (item.type === "pedal") {
                    return (
                        <div key={item.id} className="pedal-preset-box">
                            <div className="section-item-header">
                                <span>Pedal Preset</span>
                                <button className="remove-button" onClick={() => onRemoveItem(item.id)}>x</button>
                            </div>
                            Pedal Presets (placeholder)
                        </div>
                    );
                }

                if (item.type === "lyrics") {
                    return (
                        <div key={item.id} className="lyrics-box">
                            <div className="section-item-header">
                                <span>Lyrics</span>
                                <button className="remove-button" onClick={() => onRemoveItem(item.id)}>x</button>
                            </div>
                            <textarea
                                value={item.text}
                                onChange={(e) => onUpdateLyrics(item.id, e.target.value)}
                                placeholder="Write your lyrics here..."
                            />
                        </div>
                    );
                }

                return null;
            })}

            <button className="add-button" onClick={onAddItem}>+ Add</button>
        </div>
    );
}

export default SectionEditor;