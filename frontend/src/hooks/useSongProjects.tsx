import { useState } from "react";
import type { SongProject } from "../components/songwriting/type";

// initial state
const initialProject: SongProject = {
    id: "1",
    title: "Untitled Song",
    key: null,
    bpm: null,
    sections: [],
};

/**
 * useSongProjects
 *
 * Manages the list of song projects and which one is currently active.
 * Handles creating new projects, switching between them (with an
 * unsaved-changes guard), and updating the active project's data.
 */
export function useSongProjects() {

    // state
    const [projects, setProjects] = useState<SongProject[]>([initialProject]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

    return {
        projects,
        activeProject,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        updateActiveProject,
        createNewProject,
        handleSelectProject,
    };
}