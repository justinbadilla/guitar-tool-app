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

    const [isOpen, setIsOpen] = useState(false); //boolean useState to determine if the drop down menu is open or not
    const [showCustomModal, setShowCustomModal] = useState(false); //boolean useState to enable the custom tuning modal

    //Passes the selection of the notes, then closes the menu by setting to false
    function handlePresetClick(notes: string[]) {
        onSelectTuning(notes);
        setIsOpen(false);
    }

    //function for the user's custom tuning (once "save" is clicekd)... passes notes, and then closes everthing
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
                            {tuning.name}
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