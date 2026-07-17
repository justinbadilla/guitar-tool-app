import "./CustomTuningModal.css";
import { useState } from "react";
import { isValidNoteName } from "../../music/notes";

interface CustomTuningModalProps {
    onSave: (notes: string[]) => void;
    onClose: () => void;
}

/**
 * CustomTuningModal
 * 
 * This handles the user's input of the custom tuning feature.
 * User is able to input the note they want per string.
 * This function is called in TuningSelector.tsx
 */
function CustomTuningModal({ onSave, onClose }: CustomTuningModalProps) {
    const [inputs, setInputs] = useState<string[]>(["", "", "", "", "", ""]); //one empty string for 6 guitar strings
    const [error, setError] = useState<string>(""); //sets errors for user's inputs

    //Handles user's inputs for tuning using setInputs (useState) setter
    //index = string; value = note (by user)
    function handleInputChange(index: number, value: string) {
        const updated = [...inputs];
        updated[index] = value;
        setInputs(updated);
    }

    //Handling save button when clicked and handles possible errors.
    function handleSave() {
        const trimmed = inputs.map((n) => n.trim().toUpperCase()); //make user's string match to capital for array

        //Error: cant leave a note empty
        if (trimmed.some((n) => n === "")) {
            setError("All 6 strings must have a note.");
            return;
        }

        const invalidNote = trimmed.find((n) => !isValidNoteName(n)); //checks to see if the note is valid using Tonal API

        //if invalid, set error
        if (invalidNote) {
            setError(`"${invalidNote}" is not a valid note name.`);
            return;
        }

        onSave(trimmed); //input strings to array and set to capital when saved
    }

    return (
        <>
            <div className="custom-tuning-backdrop" onClick={onClose} />
            <div className="custom-tuning-modal">
                <h3>Add Custom Tuning</h3>

                <div className="custom-tuning-inputs">
                    {inputs.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={`String ${index + 1}`}
                        />
                    ))}
                </div>

                {error && <p className="custom-tuning-error">{error}</p>}

                <div className="custom-tuning-actions">
                    <button className="custom-tuning-cancel" onClick={onClose}>Cancel</button>
                    <button className="custom-tuning-save" onClick={handleSave}>Save Tuning</button>
                </div>
            </div>
        </>
    );
}

export default CustomTuningModal;