import type { StringState } from "../hooks/useFretboardState";

export async function saveChord(name: string, positions: StringState[]) {
    const response = await fetch("http://localhost:8080/api/chords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            positionsJson: JSON.stringify(positions),
        }),
    });

    const savedChord = await response.json();
    return savedChord;
}

export async function fetchSavedChords() {
    const response = await fetch("http://localhost:8080/api/chords");
    const chords = await response.json();

    return chords.map((chord: { id: number; name: string; positionsJson: string }) => ({
        id: chord.id,
        name: chord.name,
        positions: JSON.parse(chord.positionsJson),
    }));
}