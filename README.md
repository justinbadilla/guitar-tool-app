<img width="800" height="450" alt="homepage" src="https://github.com/user-attachments/assets/2d60fb7d-c511-455a-87b5-070113122e50" />

## Guitar and Songwriting App

A full-stack web application for guitarists to explore chords, experiment with tunings, and organize complete songs — all in one interactive workspace.

**[Live Demo](https://guitar-tool-app.vercel.app/)** · Built with React, TypeScript, Spring Boot, and PostgreSQL

---

## Overview

This project combines an interactive guitar fretboard with a full-featured songwriting workspace. Users can click frets to build chords, receive real-time chord and interval detection, save their favorite voicings to a personal library, and organize complete songs section-by-section. Song sections support draggable chord progressions, lyrics, and pedal presets, making it easy to experiment with and arrange ideas.

An AI assistant, powered by Google Gemini, provides real-time music theory explanations based on what you're playing, helping users understand the chords, intervals, and harmonic relationships behind the chords.

The entire application was built from the ground up, including authentication, database architecture, drag-and-drop interactions, and deployment. The project is designed to demonstrate practical full-stack engineering across both the user experience and underlying infrastructure.

## Features

### Interactive Fretboard
- Click frets on a live, styled fretboard to build chord shapes
- Real-time chord name detection, interval analysis, and root-note highlighting
- Support for standard and fully custom tunings
- A filterable personal chord library (by root note, quality, and tuning), backed by a real database
- AI-powered chord assistant: auto-generated explanations, alternate names, related keys, and suggested next chords, plus a Q&A panel

<img width="800" height="450" alt="interactive fretboard" src="https://github.com/user-attachments/assets/acab4801-a547-4446-8ce1-2a34cc673efd" />


### Songwriting Workspace
- Organize songs into sections (verse, chorus, bridge, etc.)
- Each section holds any mix of chord progressions, lyrics, and pedal chains
- Drag-and-drop reordering at every level — sections, items within a section, chords within a progression, and pedal-order
- Pull chords directly from your saved library or build them on the spot
- Multiple projects per user, saved to a real backend

<img width="800" height="450" alt="Songwriting" src="https://github.com/user-attachments/assets/b2d34b95-ea08-4e7c-96ab-7101bd254d50" />


### Pedal Preset Builder
- A custom-built visual editor for designing guitar pedal presets
- Choose a pedal shape, place knobs on a snapping grid, and set each knob's value with a drag-to-rotate interaction
- Rendered pedals attach to a song section's pedal chain, in order

<img width="800" height="450" alt="Pedal Builder" src="https://github.com/user-attachments/assets/4d05441b-5d4b-4a6c-8b03-08295fe2cfd6" />


### Accounts & Persistence
- Full registration/login system with hashed passwords and JWT-based authentication
- Per-user data isolation — saved chords and song projects belong to their creator
- Public browsing where it makes sense (presets, chord shapes) without requiring an account

## Tech Stack

**Frontend**
- React + TypeScript, built with Vite
- React Router for navigation
- `@dnd-kit` for drag-and-drop
- Tonal.js for music theory calculations
- Hand-coded inline SVG for the fretboard and pedal diagrams (no image assets)

**Backend**
- Spring Boot (Java 17)
- Spring Security with JWT authentication and BCrypt password hashing
- Spring Data JPA / Hibernate
- PostgreSQL

**AI Integration**
- Google Gemini API, called server-side to keep the API key private

**Infrastructure**
- Frontend deployed on Vercel
- Backend deployed on Render (Docker)
- Database hosted on Neon (serverless Postgres)

<img width="432" height="576" alt="HTTP + JWT" src="https://github.com/user-attachments/assets/1c62a67a-8ec3-4e9e-804a-86371f269b3c" />

## Architecture Notes

A few decisions worth calling out for anyone reading the code:

- **Nested data stored as JSON columns.** Chord configurations and song structures are stored as JSON in PostgreSQL rather than being split across multiple relational tables. Since the application always reads and writes these structures as a whole and never needs to query individual nested fields, this approach keeps the database simpler without sacrificing functionality.
- **Stateless, single-shot AI chat.** The chord assistant's Q&A doesn't retain conversation history. Each question is answered fresh, using only the current chord context. This keeps both the prompt and the UI simpler, and was a deliberate scope decision, not a limitation.
- **Locally-generated IDs for unsaved data.** Chords added to a song's chord progression get their own `crypto.randomUUID()`, separate from any database ID, since a single saved chord can appear in a progression multiple times and each placement needs its own stable identity for React and drag-and-drop to track correctly.

## API Overview

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Authenticate and receive a JWT | No |
| GET | `/api/chords` | Retrieve the current user's saved chords | No (public browsing) |
| POST | `/api/chords` | Save a chord to the user's library | Yes |
| DELETE | `/api/chords/{id}` | Delete a saved chord | Yes |
| GET | `/api/projects` | Retrieve the current user's song projects | Yes |
| POST | `/api/projects` | Create or update a song project | Yes |
| DELETE | `/api/projects/{id}` | Delete a song project | Yes |
| POST | `/api/chord-overview` | Get an AI-generated overview of a chord | Yes |
| POST | `/api/chord-chat` | Ask a one-off question about a chord | Yes |

All protected endpoints expect a `Authorization: Bearer <token>` header, using the JWT returned from `/api/auth/login`.

### Authentication

Users register and log in through the Spring Boot API. On successful login,
the server verifies the submitted password against a BCrypt hash — raw
passwords are never stored — and issues a signed JWT containing the
username and an expiration time.

The frontend stores this token in `localStorage` and attaches it as an
`Authorization: Bearer <token>` header on every request to a protected
endpoint. A custom `JwtAuthFilter` runs on each incoming request, validates
the token's signature, and — if valid — marks the request as authenticated
before it reaches any controller. Spring Security's own configuration then
decides, endpoint by endpoint, whether that authentication is actually
required: some routes (like browsing preset chords) stay public, while
anything that saves, deletes, or reads user-owned data requires a valid
token.

Ownership is enforced at the data layer as well — a user can only fetch,
update, or delete chords and song projects tied to their own account,
verified against the record's owner on every request.

## Running Locally

### Prerequisites
- Node.js 18+
- Java 17
- PostgreSQL (or a free Neon database)
- A Google Gemini API key

### Backend
```bash
cd backend
# Set required environment variables (see below), then:
./gradlew bootRun
```

Required environment variables:
```env
DB_URL=jdbc:postgresql://localhost:5432/guitar_app
DB_USERNAME=postgres
DB_PASSWORD=your_password
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-3.1-flash-lite
CORS_ALLOWED_ORIGIN=http://localhost:5173
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/`:


## What's Next

- Full EQ-slider knob type for the pedal builder
- Expanded chord-key filtering with proper enharmonic (sharp/flat) handling - right now, only displays sharp notes
- Guitar Tool Page: tuner, quizzes, practices/exercises.

## Why I Built This
I built this app to solve a problem I kept running into while writing music. I would discover interesting chord shapes or stumble across a progression I liked, but had nowhere to efficiently save them, making it easy to forget how I played them later.

I also wanted a more structured songwriting workflow — somewhere I could save chord ideas, experiment with them, organize lyrics and progressions into song sections, and develop an idea into a complete song.

## Challenges & Learning

This project exposed me to several technologies, so a
few specific problems were worth mentioning:

**Learning TypeScript and modern CSS from a different background.** Coming
from Java/C++/Python, TypeScript's type system and React's component model
were new, as were CSS layout techniques like Flexbox and Grid. Working
through this project meant re-learning a lot of front-end fundamentals
alongside the language itself.

**Standing up a Spring Boot backend from scratch.** I had little prior
backend experience, so building the REST API, JPA/Hibernate data layer, and
eventually a full JWT authentication system meant learning Spring's
conventions — annotation-driven configuration, and
Spring Security's filter chain.

**Docker and containerized deployment.** Setting up a local PostgreSQL
instance in Docker, and later writing a Dockerfile for deployment, was new
territory. Debugging a build that fails inside a container is a different
skill from debugging code running directly on your machine, and this project
was where I first developed it.

**Wiring up an external library's real-world API.** Tonal.js handles a lot
of music theory correctly, but using it well meant understanding its actual
data shapes and behavior in detail — reading its outputs carefully rather
than assuming they'd match my own mental model of the theory.

**Music theory edge cases that don't have a clean algorithmic answer.**
Two problems stood out as genuinely hard, not just unfamiliar:
- **Determining a chord's root from an arbitrary fretted shape.** The
  lowest sounding note isn't always the root, so root detection needed a
  deliberate fallback strategy rather than a single simple rule.
- **Chord naming ambiguity.** The same set of notes can have multiple
  valid names (e.g. C6 and Am7 are identical note sets), and the "correct"
  name often depends on musical context — the surrounding key, the intended
  function of the chord — that isn't recoverable from the notes alone. I
  scoped this deliberately: the app shows one reasonable name by default,
  with fuller context-aware naming logged as a future improvement rather
  than solved incompletely now.

**CSS sizing bugs that turned into real architecture decisions.** A
recurring issue was `transform: scale()` not affecting an element's actual
layout size — shrinking a chord diagram visually still left its full-size
box reserved, which broke padding and alignment around it. Chasing this
down led to reworking how the fretboard's dimensions are calculated, using
CSS custom properties (`--cell-width`/`--cell-height`) so every fretboard
instance — full-size, chord-library preview, or embedded in a song
section — derives its size from one consistent, scalable source instead of
hardcoded pixel values.

## Author

Justin Badilla — [GitHub](https://github.com/justinbadilla) · [LinkedIn](https://www.linkedin.com/in/justin-badilla-ab2504427/)
