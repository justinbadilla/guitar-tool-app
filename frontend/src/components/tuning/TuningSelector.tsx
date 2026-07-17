import "./TuningSelector.css";
import CustomTuningModal from "./CustomTuningModal";
import { useState } from "react";
import { PRESET_TUNINGS } from "../../music/notes";

interface TuningSelectorProps {
    activeTuning: string[];
    onSelectTuning: (notes: string[]) => void;
}

/**
 * TuningSelector
 * 
 * This file changes the tunings for the interactive fretboard
 * Used in pages for the interactive fretboard
 */

function TuningSelector({ activeTuning, onSelectTuning }: TuningSelectorProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    function handlePresetClick(notes: string[]) {
        onSelectTuning(notes);
        setIsOpen(false);
    }

    function handleCustomSave(notes: string[]) {
        onSelectTuning(notes);
        setShowCustomModal(false);
        setIsOpen(false);
    }

    return (
        <div className="tuning-selector">
            <button className="tuning-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className="tuning-selector-label">Tuning</span>

                <div className="tuning-value">
                    {activeTuning.join("-")}
                    <span>▾</span>
                </div>
            </button>

            {isOpen && (
                <div className="tuning-dropdown">
                    {PRESET_TUNINGS.map((tuning) => (
                        <button
                            key={tuning.name}
                            className="tuning-option"
                            onClick={() => handlePresetClick(tuning.notes)}
                        >
                            {tuning.name}
                        </button>
                    ))}

                    <div className="tuning-divider" />

                    <button
                        className="tuning-add-custom"
                        onClick={() => setShowCustomModal(true)}
                    >
                        + Add Custom Tuning
                    </button>
                </div>
            )}

            {showCustomModal && (
                <CustomTuningModal
                    onSave={handleCustomSave}
                    onClose={() => setShowCustomModal(false)}
                />
            )}
        </div>
    );
}

export default TuningSelector;