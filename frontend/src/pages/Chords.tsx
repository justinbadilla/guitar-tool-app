import Fretboard from '../components/Fretboard'
import ChordNameDisplay from '../components/ChordNameDisplay';
import { useFretboardState } from '../hooks/useFretboardState';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import { STANDARD_TUNING } from '../music/notes';
import PresetChordList from '../components/PresetChordList'
import { saveChord } from "../api/savedChords";
import SavedChordList from '../components/SavedChordList';
import { useState } from 'react';
import TuningSelector from '../components/TuningSelector';
import { useEffect } from 'react';
import { fetchSavedChords } from '../api/savedChords';
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