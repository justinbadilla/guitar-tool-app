<img width="800" height="450" alt="homepage" src="https://github.com/user-attachments/assets/2d60fb7d-c511-455a-87b5-070113122e50" />

## Guitar and Songwriting App

A full-stack web application for guitarists to explore chords, experiment with tunings, and organize complete songs — all in one interactive workspace.

**[Live Demo](https://guitar-tool-app.vercel.app/)** · Built with React, TypeScript, Spring Boot, and PostgreSQL

---

## Overview

This project combines an interactive guitar fretboard with a full-featured songwriting workspace. Users can click frets to build chords, receive real-time chord and interval detection, save their favorite voicings to a personal library, and organize complete songs section-by-section. Song sections support draggable chord progressions, lyrics, and pedal presets, making it easy to experiment with and arrange ideas.

An AI assistant, powered by Google Gemini, provides real-time music theory explanations based on what you're playing, helping users understand the chords, intervals, and harmonic relationships behind their ideas.

The entire application was built from the ground up, including authentication, database architecture, drag-and-drop interactions, and deployment. The project is designed to demonstrate practical full-stack engineering across both the user experience and underlying infrastructure.

## Features

### Interactive Fretboard
- Click frets on a live, styled fretboard to build any chord shape
- Real-time chord name detection, interval analysis, and root-note highlighting
- Support for standard and fully custom tunings
- A filterable personal chord library (by root note, quality, and tuning), backed by a real database
- AI-powered chord assistant: auto-generated explanations, alternate names, related keys, and suggested next chords, plus a lightweight Q&A panel

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

## Architecture Notes

A few decisions worth calling out for anyone reading the code:

- **Nested data stored as JSON columns.** Chord configurations and song structures are stored as JSON in PostgreSQL rather than being split across multiple relational tables. Since the application always reads and writes these structures as a whole and never needs to query individual nested fields, this approach keeps the database simpler without sacrificing functionality.
- **Stateless, single-shot AI chat.** The chord assistant's Q&A doesn't retain conversation history — each question is answered fresh, using only the current chord context. This keeps both the prompt and the UI simpler, and was a deliberate scope decision, not a limitation.
- **Locally-generated IDs for unsaved data.** Chords added to a song's chord progression get their own `crypto.randomUUID()`, separate from any database ID, since a single saved chord can appear in a progression multiple times and each placement needs its own stable identity for React and drag-and-drop to track correctly.

<img width="432" height="576" alt="HTTP + JWT" src="https://github.com/user-attachments/assets/1c62a67a-8ec3-4e9e-804a-86371f269b3c" />


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
DB_URL=jdbc:postgresql://localhost:5432/guitar_app
DB_USERNAME=postgres
DB_PASSWORD=your_password
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-3.1-flash-lite
CORS_ALLOWED_ORIGIN=http://localhost:5173

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/`:


## What's Next

- Full EQ-slider knob type for the pedal builder
- Expanded chord-key filtering with proper enharmonic (sharp/flat) handling
- Guitar Tool Page: tuner, quizzes, practices/exercises.

## Why I Built This
I built this app to solve a problem I kept running into while writing music. I would discover interesting chord shapes or stumble across a progression I liked, but had nowhere to efficiently save them, making it easy to forget how I played them later.

I also wanted a more structured songwriting workflow — somewhere I could save chord ideas, experiment with them, organize lyrics and progressions into song sections, and develop an idea into a complete song.

## Author

Justin Badilla — [GitHub](https://github.com/justinbadilla) · [LinkedIn](https://www.linkedin.com/in/justin-badilla-ab2504427/)
