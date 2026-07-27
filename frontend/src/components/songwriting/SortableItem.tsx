import "./SortableItem.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
}

/**
 * SortableItem
 *
 * Drag-to-reorder wrapper for any section item (chords,lyrics, pedal). Renders a drag handle beside content.
 * Passed as children (no knowledge of what TYPE of item it's wrapping), to make it reusable across all item types
 */
function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="sortable-item-wrapper">
            <button className="drag-handle" {...attributes} {...listeners}>
                <GripVertical size={16} />
            </button>
            <div className="sortable-item-content">
                {children}
            </div>
        </div>
    );
}

export default SortableItem;