import CustomTuningModal from "./CustomTuningModal";
import { useState } from "react";
import { PRESET_TUNINGS } from "../../music/notes";

interface TuningSelectorProps {
    activeTuning: string[];
    onSelectTuning: (notes: string[]) => void;
}

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
            <button onClick={() => setIsOpen(!isOpen)}>
                {activeTuning.join("-")}
            </button>

            {isOpen && (
                <div className="tuning-dropdown">
                    {PRESET_TUNINGS.map((tuning) => (
                        <button
                            key={tuning.name}
                            onClick={() => handlePresetClick(tuning.notes)}
                        >
                            {tuning.name} ({tuning.notes.join("-")})
                        </button>
                    ))}

                    <button onClick={() => setShowCustomModal(true)}>
                        Add Custom Tuning
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