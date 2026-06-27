import Fretboard from '../components/fretboard/Fretboard'
import TuningSelector from '../components/tuning/TuningSelector';
import SavedChordList from '../components/chord-library/SavedChordList';
import PresetChordList from '../components/chord-library/PresetChordList'
import ChordNameDisplay from '../components/chord-library/ChordNameDisplay';
import { useState } from 'react';
import { useEffect } from 'react';
import { saveChord } from "../api/savedChords";
import { STANDARD_TUNING } from '../music/notes';
import { fetchSavedChords } from '../api/savedChords';
import { useFretboardState } from '../hooks/useFretboardState';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import type { SavedChord } from '../api/savedChords';

function Chords() {

    const [savedChords, setSavedChords] = useState<SavedChord[]>([]);

    useEffect(() => {
        fetchSavedChords().then((chords) => setSavedChords(chords));
    }, []);

    const { stringStates, handleFretClick, handleToggle, fretMarkers, loadPositions, clearFretboard } = useFretboardState(6);

    const [activeTuning, setActiveTuning] = useState<string[]>(STANDARD_TUNING);

    const notes = getNotesFromStringStates(stringStates, activeTuning);
    const chordName = detectChordName(notes);
    const rootNote = getRootNote(stringStates, activeTuning, chordName);


    async function handleSaveClick() {
        const saved = await saveChord(chordName, stringStates, activeTuning);
        setSavedChords((prev) => [...prev, {
            id: saved.id,
            name: saved.name,
            positions: JSON.parse(saved.positionsJson),
            tuning: JSON.parse(saved.tuningJson),
        }]);
    }
    return (
        <div>
            <ChordNameDisplay chordName={chordName} />
            <Fretboard
                stringStates={stringStates}
                handleFretClick={handleFretClick}
                handleToggle={handleToggle}
                fretMarkers={fretMarkers}
                rootNote={rootNote}
                tuning={activeTuning}
            />
            <TuningSelector
                activeTuning={activeTuning}
                onSelectTuning={setActiveTuning}
            />
            <button onClick={handleSaveClick}>Save Chord</button>
            <button onClick={clearFretboard}>Clear</button>

            <PresetChordList onSelectChord={loadPositions} />
            <SavedChordList savedChords={savedChords} onSelectChord={loadPositions} />
        </div>
    );
}

export default Chords;