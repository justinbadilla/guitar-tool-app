import Fretboard from '../components/Fretboard'
import ChordNameDisplay from '../components/ChordNameDisplay';
import { useFretboardState } from '../hooks/useFretboardState';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import { STANDARD_TUNING } from '../music/notes';
import ChordDiagram from '../components/ChordDiagram';
import { CHORD_PRESETS } from '../music/chordPresets';
import PresetChordList from '../components/PresetChordList';

function Chords() {
    const { stringStates, handleFretClick, handleToggle, fretMarkers, loadPositions } = useFretboardState(6);

    const notes = getNotesFromStringStates(stringStates, STANDARD_TUNING);
    const chordName = detectChordName(notes);
    const rootNote = getRootNote(stringStates, STANDARD_TUNING, chordName);

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
            <PresetChordList onSelectChord={loadPositions} />
        </div>
    );
}

export default Chords;