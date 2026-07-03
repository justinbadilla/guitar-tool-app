import { useState } from "react";

interface NewProjectModalProps {
    onConfirm: (title: string, key: string | null, bpm: string | null) => void;
    onClose: () => void;
}

/**
 * NewProjectModal
 * 
 * Creating a new song project in Songwriting.tsx
 * Asks for title, key, and bpm of song project
 */
function NewProjectModal({ onConfirm, onClose }: NewProjectModalProps) {
    const [title, setTitle] = useState("");
    const [key, setKey] = useState("");
    const [bpm, setBpm] = useState("");

    function handleConfirm() {
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") return;

        onConfirm(
            trimmedTitle,
            key.trim() === "" ? null : key.trim(),
            bpm.trim() === "" ? null : bpm.trim()
        );
    }

    return (
        <div className="new-project-modal">
            <h3>New Project</h3>

            <div className="new-project-field">
                <label>Title *</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); }}
                    placeholder="Song title"
                    autoFocus
                />
            </div>

            <div className="new-project-field">
                <label>Key</label>
                <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="e.g. C"
                />
            </div>

            <div className="new-project-field">
                <label>BPM</label>
                <input
                    type="text"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    placeholder="e.g. 120"
                />
            </div>

            <div className="new-project-modal-actions">
                <button onClick={handleConfirm}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default NewProjectModal;