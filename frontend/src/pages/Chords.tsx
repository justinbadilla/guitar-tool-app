import Fretboard from '../components/Fretboard'
import ChordNameDisplay from '../components/ChordNameDisplay';
import { useFretboardState } from '../hooks/useFretboardState';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import { STANDARD_TUNING } from '../music/notes';
import ChordDiagram from '../components/ChordDiagram';
import { CHORD_PRESETS } from '../music/chordPresets';
import PresetChordList from '../components/PresetChordList'
import { saveChord } from "../api/savedChords";
import SavedChordList from '../components/SavedChordList';

function Chords() {
    const { stringStates, handleFretClick, handleToggle, fretMarkers, loadPositions,  } = useFretboardState(6);

    const notes = getNotesFromStringStates(stringStates, STANDARD_TUNING);
    const chordName = detectChordName(notes);
    const rootNote = getRootNote(stringStates, STANDARD_TUNING, chordName);

    async function handleSaveClick(){
        await saveChord(chordName, stringStates);
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
            />
            <button onClick={handleSaveClick}>Save Chord</button>

            <PresetChordList onSelectChord={loadPositions} />
            <SavedChordList onSelectChord={loadPositions} />
        </div>
    );
}

export default Chords;