import "./SectionEditor.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import type { Section } from "./type";
import SortableItem from "./SortableItem";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface SectionEditorProps {
    section: Section;
    onUpdateName: (name: string) => void;
    onRemoveSection: () => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: string) => void;
    onUpdateLyrics: (itemId: string, text: string) => void;
    onUpdateDescription: (itemId: string, description: string) => void;
    onOpenChordPicker: (itemId: string) => void;
    onRemoveChord: (itemId: string, chordIndex: number) => void;
    onReorderItems: (oldIndex: number, newIndex: number) => void;

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
    onUpdateDescription,
    onOpenChordPicker,
    onRemoveChord,
    onReorderItems,

}: SectionEditorProps) {

    function handleRemoveSection() {
        const confirmed = window.confirm(
            `Delete section "${section.name}"? This will remove everything inside it and cannot be undone.`
        );
        if (confirmed) {
            onRemoveSection();
        }
    }

    function handleItemDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = section.items.findIndex((item) => item.id === active.id);
        const newIndex = section.items.findIndex((item) => item.id === over.id);
        onReorderItems(oldIndex, newIndex);
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
                <button className="remove-button" onClick={handleRemoveSection}>×</button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
                <SortableContext items={section.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    {section.items.map((item) => {
                        if (item.type === "chords") {
                            return (
                                <SortableItem key={item.id} id={item.id}>
                                    <div className="chord-progression-box">
                                        <div className="chord-progression-header">
                                            <span>Chord Progression</span>
                                            <button className="remove-button" onClick={() => onRemoveItem(item.id)}>×</button>
                                        </div>

                                        <div className="chord-progression-description">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => onUpdateDescription(item.id, e.target.value)}
                                                placeholder="Add a note (e.g chords in key, strumming pattern, time signature...)"
                                            />
                                        </div>

                                        <div className="chord-progression-grid">
                                            {item.chords.map((chord, index) => (
                                                <div key={chord.id ?? index} className="chord-progression-item">
                                                    <ChordDiagram
                                                        positions={chord.positions}
                                                        name={chord.name}
                                                        tuning={chord.tuning}
                                                    />
                                                    <button className="remove-button" onClick={() => onRemoveChord(item.id, index)}>×</button>
                                                </div>
                                            ))}

                                            <button className="add-button" onClick={() => onOpenChordPicker(item.id)}>+ Chords</button>
                                        </div>
                                    </div>
                                </SortableItem>
                            );
                        }

                        if (item.type === "pedal") {
                            return (
                                <SortableItem key={item.id} id={item.id}>
                                    <div className="pedal-preset-box">
                                        <div className="section-item-header">
                                            <span>Pedal Preset</span>
                                            <button className="remove-button" onClick={() => onRemoveItem(item.id)}>×</button>
                                        </div>
                                        Pedal Presets (placeholder)
                                    </div>
                                </SortableItem>
                            );
                        }

                        if (item.type === "lyrics") {
                            return (
                                <SortableItem key={item.id} id={item.id}>
                                    <div className="lyrics-box">
                                        <div className="section-item-header">
                                            <span>Lyrics</span>
                                            <button className="remove-button" onClick={() => onRemoveItem(item.id)}>×</button>
                                        </div>
                                        <textarea
                                            value={item.text}
                                            onChange={(e) => {
                                                onUpdateLyrics(item.id, e.target.value);
                                                e.target.style.height = "auto";
                                                e.target.style.height = `${e.target.scrollHeight}px`;
                                            }}
                                            placeholder="Write your lyrics here..."
                                            rows={3}
                                        />
                                    </div>
                                </SortableItem>
                            );
                        }

                        return null;
                    })}
                </SortableContext>
            </DndContext>

            <button className="add-button" onClick={onAddItem}>+</button>
        </div>
    );
}

export default SectionEditor;