import type { StringState } from "../hooks/useFretboardState";

export interface SavedChord {
    id: number;
    name: string;
    positions: StringState[];
    tuning: string[];
}

export async function saveChord(name: string, positions: StringState[], tuning: string[]) {
    const response = await fetch("http://localhost:8080/api/chords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            positionsJson: JSON.stringify(positions),
            tuningJson: JSON.stringify(tuning),
        }),
    });

    const savedChord = await response.json();
    return savedChord;
}

export async function fetchSavedChords() {
    const response = await fetch("http://localhost:8080/api/chords");
    const chords = await response.json();

    return chords.map((chord: { id: number; name: string; positionsJson: string, tuningJson: string }) => ({
        id: chord.id,
        name: chord.name,
        positions: JSON.parse(chord.positionsJson),
        tuning: JSON.parse(chord.tuningJson),
    }));
}