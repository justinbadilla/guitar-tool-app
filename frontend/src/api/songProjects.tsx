import { getAuthHeader } from "./auth";
import type { SongProject } from "../components/songwriting/type";

const PROJECTS_BASE_URL = "http://localhost:8080/api/projects";

/**
 * Fetches all song projects belonging to logged-in user.
 * Returns an empty array if not logged in (backend enforces this too).
 */
export async function fetchSongProjects(): Promise<SongProject[]> {
    const response = await fetch(PROJECTS_BASE_URL, {
        headers: { ...getAuthHeader() },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch song projects.");
    }

    const projects = await response.json();

    return projects.map((project: {
        id: number;
        title: string;
        songKey: string | null;
        bpm: string | null;
        sectionsJson: string;
    }) => ({
        id: project.id.toString(),
        title: project.title,
        key: project.songKey,
        bpm: project.bpm,
        sections: JSON.parse(project.sectionsJson),
    }));
}

/**
 * Saves a song project. Creates a new one if it has no real backend id yet, or updates the existing one 
 * (the backend's repository.save() handles this distinction automatically)
 */
export async function saveSongProject(project: SongProject): Promise<SongProject> {
    const isNewProject = isNaN(Number(project.id));

    const response = await fetch(PROJECTS_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        },
        body: JSON.stringify({
            id: isNewProject ? null : Number(project.id),
            title: project.title,
            songKey: project.key,
            bpm: project.bpm,
            sectionsJson: JSON.stringify(project.sections),
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to save project. Are you logged in?");
    }

    const saved = await response.json();

    return {
        id: saved.id.toString(),
        title: saved.title,
        key: saved.songKey,
        bpm: saved.bpm,
        sections: JSON.parse(saved.sectionsJson),
    };
}

/**
 * Deletes a song project
 */
export async function deleteSongProject(id: number): Promise<void> {
    const response = await fetch(`${PROJECTS_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeader(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete project.");
    }
}