import "./SortableSection.css";
import SectionEditor from "./SectionEditor";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import type { Section } from "./type";

interface SortableSectionProps {
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
    onReorderChords: (itemId: string, oldIndex: number, newIndex: number) => void;
}

/**
 * SortableSection
 *
 * Thin wrapper around SectionEditor to add drag-to-reorder behavior using dnd-kit. 
 * SectionEditor has no knowledge of dragging (this component handles the sorting and
 * renders a drag handle, passing everything else through unchanged)
 */
function SortableSection(props: SortableSectionProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.section.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="sortable-section-wrapper">
            <button className="drag-handle" {...attributes} {...listeners}>
                <GripVertical size={18} />
            </button>
            <div className="sortable-section-content">
                <SectionEditor {...props} />
            </div>
        </div>
    );
}

export default SortableSection;