/**
 * Chords
 * Chord page that renders interactive fretboard with a save chord and alternate tuning feature.
 */

import Fretboard from '../components/fretboard/Fretboard'
import TuningSelector from '../components/tuning/TuningSelector';
import SavedChordList from '../components/chord-library/SavedChordList';
import ChordFilterBar from '../components/chord-library/ChordFilterBar';
import PresetChordList from '../components/chord-library/PresetChordList'
import ChordNameDisplay from '../components/chord-library/ChordNameDisplay';
import { useState } from 'react';
import { useEffect } from 'react';
import { saveChord } from "../api/savedChords";
import { STANDARD_TUNING } from '../music/notes';
import { fetchSavedChords } from '../api/savedChords';
import { useFretboardState } from '../hooks/useFretboardState';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import { chordMatchesFilters, type ChordFilters } from '../music/chordFilters';
import type { SavedChord } from '../api/savedChords';
import type { StringState } from '../hooks/useFretboardState';

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


    //Filters use state
    const [filters, setFilters] = useState<ChordFilters>({
        tuning: null,
        quality: null,
        rootNote: null,
    });

    //Checks available tunings for filters
    const availableTunings = Array.from(
        new Set(savedChords.map((c) => JSON.stringify(c.tuning)))
    ).map((t) => JSON.parse(t));

    const filteredSavedChords = savedChords.filter((chord) => chordMatchesFilters(chord, filters));

    //loading tunings bug
    function loadChord(positions: StringState[], tuning: string[]) {
        setActiveTuning(tuning);
        loadPositions(positions);
    }

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

            <PresetChordList onSelectChord={loadChord} />

            <ChordFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                availableTunings={availableTunings}
            />
            
            <SavedChordList savedChords={filteredSavedChords} onSelectChord={loadChord} />
        </div>
    );
}

export default Chords;