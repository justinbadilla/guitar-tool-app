import { getAuthHeader } from "./auth";
import type { StringState } from "../hooks/useFretboardState";
import { API_BASE_URL } from "./config";

const CHORD_ASSISTANT_BASE_URL = `${API_BASE_URL}/api`;

export interface ChordOverview {
    overview: string;
    alternateNames: string[];
    keys: string[];
    nextChords: { chord: string; why: string }[];
}

/**
 * Fetches AI overview of the currently fretted chord: description, alternate names, diatonic keys,
 * and suggested next chords (requires login)
 */
export async function fetchChordOverview(
    chordName: string,
    positions: StringState[],
    tuning: string[]
): Promise<ChordOverview> {
    const response = await fetch(`${CHORD_ASSISTANT_BASE_URL}/chord-overview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        },
        body: JSON.stringify({
            chordName,
            positionsJson: JSON.stringify(positions),
            tuningJson: JSON.stringify(tuning),
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch chord overview.");
    }

    const raw = await response.text();
    return JSON.parse(raw);
}

/**
 * Asks a single question about the currently fretted chord. 
 * No conversation history is sent or expected
 */
export async function askChordQuestion(
    chordName: string,
    positions: StringState[],
    tuning: string[],
    question: string
): Promise<string> {
    const response = await fetch(`${CHORD_ASSISTANT_BASE_URL}/chord-chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        },
        body: JSON.stringify({
            chordName,
            positionsJson: JSON.stringify(positions),
            tuningJson: JSON.stringify(tuning),
            question,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to get an answer. Please try again.");
    }

    return response.text();
}