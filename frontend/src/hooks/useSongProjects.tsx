import { useEffect, useState } from "react";
import { deleteSongProject, fetchSongProjects, saveSongProject } from "../api/songProjects";
import type { SongProject } from "../components/songwriting/type";

/**
 * useSongProjects
 *
 * Manages the list of song projects and which one is currently active.
 * Handles creating new projects, switching between them (with an
 * unsaved-changes guard), and updating the active project's data.
 */
export function useSongProjects() {

    // state
    const [projects, setProjects] = useState<SongProject[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Fetch the user's saved projects once. If not logged in, the backend returns an empty list.
    // Splash screen handles the "no projects" case
    useEffect(() => {
        fetchSongProjects().then((fetched) => setProjects(fetched));
    }, []);
    
    // derived
    const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;


    //** HELPERS */

    // Core updater for the active project. All editing functions go through this to ensure hasUnsavedChanges is accurate
    function updateActiveProject(updater: (prev: SongProject) => SongProject) {
        if (!activeProjectId) return;
        setProjects((prev) => prev.map((p) =>
            p.id === activeProjectId ? updater(p) : p
        ));
        setHasUnsavedChanges(true);
    }

    //** Actions */

    //Creates a new project from modal input, adds to list, and opens it as the actice project
    function createNewProject(
        title: string,
        key: string | null,
        bpm: string | null
    ): SongProject {
        const newProject: SongProject = {
            id: crypto.randomUUID(),
            title,
            key,
            bpm,
            sections: [],
        };
        setProjects((prev) => [...prev, newProject]);
        setActiveProjectId(newProject.id);
        setHasUnsavedChanges(false);
        return newProject;
    }

    // Switches the active project, with and unsaved-changes guard (Phase 4 will fetch full project data)
    function handleSelectProject(projectId: string): SongProject | null {
        if (projectId === activeProjectId) return activeProject;

        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                "You have unsaved changes. Switch projects anyway? Your changes will be lost."
            );
            if (!confirmed) return null;
        }

        const project = projects.find((p) => p.id === projectId);
        if (!project) return null;

        setActiveProjectId(projectId);
        setHasUnsavedChanges(false);
        return project;
    }

    /**
     * Persists the active project to the backend. Replaces the local (possibly UUID) project
     * with the backend's saved version, which has a real database id 
     * (important so future saves update the same row instead of creating duplicates)
     */
    async function saveActiveProject(): Promise<void> {
        if (!activeProject) return;

        const saved = await saveSongProject(activeProject);

        setProjects((prev) => prev.map((p) =>
            p.id === activeProject.id ? saved : p
        ));
        setActiveProjectId(saved.id);
        setHasUnsavedChanges(false);
    }

    async function deleteProject(id: string): Promise<void> {
        const numericId = Number(id);
        if (isNaN(numericId)) {
            // locally-created project never saved to the backend — just remove it locally
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } else {
            await deleteSongProject(numericId);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        }

        if (activeProjectId === id) {
            setActiveProjectId(null);
        }
    }

    return {
        projects,
        activeProject,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        updateActiveProject,
        createNewProject,
        handleSelectProject,
        saveActiveProject,
        deleteProject,
    };
}