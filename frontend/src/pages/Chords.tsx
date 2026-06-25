import Fretboard from '../components/Fretboard'
import ChordNameDisplay from '../components/ChordNameDisplay';
import { useFretboardState } from '../hooks/useFretboardState';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import { STANDARD_TUNING } from '../music/notes';

function Chords() {
    const { stringStates, handleFretClick, handleToggle, fretMarkers } = useFretboardState(6);

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
        </div>
    );
}

export default Chords;