/**
 * ChordFilterBar
 * 
 * Renders three dropdown filters (root note, quality, tuning)
 * Only visuals — doesn't own or apply any filtering logic itself.
 * Reports user's selections through onFiltersChange. The actual filtering
 * (chordMatchesFilters) happens wherever the filtered list is used
 * Used for chord analyzer page and will be used in songwriting page.
 */

import type { ChordFilters } from "../../music/chordFilters";

interface ChordFilterBarProps {
    filters: ChordFilters; //current active filter values
    onFiltersChange: (filters: ChordFilters) => void; //called when filter changes
    availableTunings: string[][]; //tunings used in user's database
}

//Variables for filter options
const QUALITY_OPTIONS = ["Major", "Minor", "Diminished", "Augmented"];
const ROOT_NOTE_OPTIONS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


function ChordFilterBar({ filters, onFiltersChange, availableTunings }: ChordFilterBarProps) {

    //updates individual filter fields 
    function updateFilter<K extends keyof ChordFilters>(key: K, value: ChordFilters[K]) {
        onFiltersChange({ ...filters, [key]: value });
    }

    return (
        <div className="chord-filter-bar">
            <select
                value={filters.rootNote ?? ""}
                onChange={(e) => updateFilter("rootNote", e.target.value || null)}
            >
                <option value="">Any Root</option>
                {ROOT_NOTE_OPTIONS.map((note) => (
                    <option key={note} value={note}>{note}</option>
                ))}
            </select>

            <select
                value={filters.quality ?? ""}
                onChange={(e) => updateFilter("quality", e.target.value || null)}
            >
                <option value="">Any Quality</option>
                {QUALITY_OPTIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                ))}
            </select>

            <select
                value={filters.tuning ? JSON.stringify(filters.tuning) : ""}
                onChange={(e) => updateFilter("tuning", e.target.value ? JSON.parse(e.target.value) : null)}
            >
                <option value="">Any Tuning</option>
                {availableTunings.map((tuning) => (
                    <option key={JSON.stringify(tuning)} value={JSON.stringify(tuning)}>
                        {tuning.join("-")}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ChordFilterBar;