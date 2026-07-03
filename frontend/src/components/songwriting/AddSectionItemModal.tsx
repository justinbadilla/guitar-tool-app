import type { SectionItemType } from "./type";

interface AddSectionItemModalProps {
    onAdd: (type: SectionItemType) => void;
    onClose: () => void;
}

/**
 * AddSectionItemModal
 * 
 * Centered modal offering three choices for what kind of box to add
 * to a section (chord progression, pedal preset, or lyrics)
 * Presentational only
 * just reports the user's choice upward with onAdd, then the parent handles creating the item.
 */
function AddSectionItemModal({ onAdd, onClose }: AddSectionItemModalProps) {
    return (
        <div className="add-section-item-modal">
            <h3>Add to Section</h3>

            <div className="add-section-item-options">
                <button onClick={() => onAdd("chords")}>
                    Chord Progression
                </button>
                <button onClick={() => onAdd("pedal")}>
                    Pedal Preset
                </button>
                <button onClick={() => onAdd("lyrics")}>
                    Lyrics
                </button>
            </div>

            <button className="add-section-item-cancel" onClick={onClose}>
                Cancel
            </button>
        </div>
    );
}

export default AddSectionItemModal;