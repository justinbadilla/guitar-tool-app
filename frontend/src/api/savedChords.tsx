import { getAuthHeader } from "./auth";
import type { StringState } from "../hooks/useFretboardState";

export interface SavedChord {
    id: number | string;  // number for real saved chords (DB id); string (UUID) for locally-built chords not yet saved
    // UUID is used when presetchords or chords from built chord from chordpickermodal (chrod prog)
    // UUID: gives a living id in the meantime, until it is saved into database (needed for live rendering) - for songwriting page
    name: string;
    positions: StringState[];
    tuning: string[];
}
//api function to send out a saved chord in the database (name, fretboard position, and tuning)
export async function saveChord(name: string, positions: StringState[], tuning: string[]) {
    const response = await fetch("http://localhost:8080/api/chords", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        },
        body: JSON.stringify({
            name: name,
            positionsJson: JSON.stringify(positions),
            tuningJson: JSON.stringify(tuning),
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to save chord. Are you logged in?");
    }

    const savedChord = await response.json();
    return savedChord;
}

//saves the chord to the database for user's saved chords in interactive fretboard and songwriting (chord proggression) page
export async function fetchSavedChords() {
    const response = await fetch("http://localhost:8080/api/chords", {
        headers: {
            ...getAuthHeader(),
        },
    });
    const chords = await response.json();

    return chords.map((chord: { id: number; name: string; positionsJson: string, tuningJson: string }) => ({
        id: chord.id,
        name: chord.name,
        positions: JSON.parse(chord.positionsJson),
        tuning: JSON.parse(chord.tuningJson),
    }));
}

//deletes the chord to the database for user's saved chords 
export async function deleteChord(id: number): Promise<void> {
    const response = await fetch(`http://localhost:8080/api/chords/${id}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeader(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete chord.");
    }
}