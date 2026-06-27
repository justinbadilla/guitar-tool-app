import { useState } from "react";
import { isValidNoteName } from "../../music/notes";

interface CustomTuningModalProps {
    onSave: (notes: string[]) => void;
    onClose: () => void;
}

function CustomTuningModal({ onSave, onClose }: CustomTuningModalProps) {
    const [inputs, setInputs] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState<string>("");

    function handleInputChange(index: number, value: string) {
        const updated = [...inputs];
        updated[index] = value;
        setInputs(updated);
    }

    function handleSave() {
        const trimmed = inputs.map((n) => n.trim().toUpperCase());

        if (trimmed.some((n) => n === "")) {
            setError("All 6 strings must have a note.");
            return;
        }

        const invalidNote = trimmed.find((n) => !isValidNoteName(n));
        if (invalidNote) {
            setError(`"${invalidNote}" is not a valid note name.`);
            return;
        }

        onSave(trimmed);
    }

    return (
        <div className="custom-tuning-modal">
            <h3>Add Custom Tuning</h3>

            {inputs.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`String ${index + 1}`}
                />
            ))}

            {error && <p className="custom-tuning-error">{error}</p>}

            <button onClick={handleSave}>Save Tuning</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

export default CustomTuningModal;