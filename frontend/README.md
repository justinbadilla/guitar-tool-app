# Frontend — Guitar Songwriting App

React + TypeScript frontend for an interactive guitar chord tool and songwriting workspace. Built with Vite, deployed on Vercel.

## Tech Stack

- **React 18 + TypeScript**
- **Vite** — build tool and dev server
- **React Router** — client-side routing
- **@dnd-kit** — drag-and-drop (sections, chord progressions, pedal chains)
- **Tonal.js** — music theory calculations (note/interval/chord detection)
- **lucide-react** — icon system

## Project Structure
src/
├── api/ # All backend communication, grouped by resource
│ ├── auth.ts # Register, login, JWT storage
│ ├── savedChords.ts # CRUD for the user's saved chord library
│ ├── songProjects.ts # CRUD for song projects
│ ├── chordAssistant.ts # Gemini-powered chord overview + Q&A
│ └── config.ts # Shared API base URL (environment-driven)
│
├── components/
│ ├── auth/ # Login/register modal
│ ├── chord-library/ # Preset + saved chord lists, filters, chord picker
│ ├── fretboard/ # The interactive fretboard + read-only chord diagrams
│ ├── layout/ # Header, footer, floating background animation
│ ├── pedals/ # Read-only pedal diagram renderer
│ ├── songwriting/ # Section editor, sortable wrappers, project sidebar, type.ts
│ └── tuning/ # Tuning selector + custom tuning modal
│
├── hooks/
│ ├── useFretboardState.ts # Owns fretboard interaction state, reused
│ │ anywhere a live fretboard is needed
│ └── useSongProjects.ts # Owns the project list, active project,
│ and unsaved-changes tracking
│
├── music/
│ ├── notes.ts # Chromatic scale, tunings, note-name validation
│ ├── chords.ts # Note/interval/chord-name derivation from a fretboard
│ └── chordFilters.ts # Filtering logic for the saved chord library
│
├── pages/
│ ├── Home.tsx
│ ├── Chords.tsx # The chord analyzer page
│ └── Songwriting.tsx # The song project editor page
# (SongProject, Section, SectionItem, PedalPreset)

## Architectural Notes

**State ownership follows a consistent pattern.** Pages own state and pass
data + callbacks down as props; components report actions upward rather
than managing their own copies of shared state. Two custom hooks
(`useFretboardState`, `useSongProjects`) centralize the two pieces of state
reused across multiple pages, so the fretboard and project-management logic
exist in exactly one place each.

**The fretboard is a single, reusable component in three different
contexts.** The same `Fretboard` component renders the main interactive
tool, read-only chord-library previews (via `ChordDiagram`), and chords
embedded inside a song's chord progression — each context sets different
CSS custom properties (`--cell-width`, `--cell-height`) to control scale,
rather than maintaining separate implementations.

**Drag-and-drop is generic, not duplicated per list.** One `SortableItem`
wrapper (built on `@dnd-kit`) handles reordering for song sections, items
within a section, and chords within a progression — each is its own
independent sortable context, but all three share the same underlying
component.

**IDs distinguish persisted vs. local-only data.** A `SavedChord`'s `id`
is `number | string` by design: a real database ID for chords saved to the
backend, or a locally generated UUID for chords that only exist inside a
song project (built on the fly, or placed into a progression more than
once). This distinction mattered directly — an early bug where two
instances of the same saved chord shared an ID, breaking delete/reorder
behavior, was fixed by always generating a fresh UUID when a chord is
added to a progression.

## Environment Variables

Create a `.env` file in this directory:
VITE_API_URL=http://localhost:8080


Points the frontend at a running backend instance. In production, this is
set in Vercel's dashboard to the deployed Render backend URL instead.

## Running Locally

```bash
npm install
npm run dev
```

Requires the backend running separately (see `/backend/README.md`) for any
feature that touches saved data, accounts, or the AI assistant — the app
itself will load and the fretboard's chord detection works without it,
since that logic is entirely client-side.

## Build

```bash
npm run build
```

Outputs static files to `dist/`, deployed via Vercel with a rewrite rule
(`vercel.json`) so client-side routes resolve correctly on page refresh.
