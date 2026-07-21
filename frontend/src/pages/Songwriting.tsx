
import "./Songwriting.css";
import ProjectSidebar from "../components/songwriting/ProjectSidebar";
import NewProjectModal from "../components/songwriting/NewProjectModal";
import AddSectionItemModal from "../components/songwriting/AddSectionItemModal";
import SectionEditor from "../components/songwriting/SectionEditor";
import ChordPickerModal from "../components/chord-library/ChordPickerModal";
import { useEffect, useState } from "react";
import { useSongProjects } from "../hooks/useSongProjects";
import { fetchSavedChords, type SavedChord } from "../api/savedChords";
import type { Section, SectionItem, SectionItemType } from "../components/songwriting/type";
import Header from "../components/layouts/Headers";
import { Link } from "react-router-dom";

interface SongwritingProps {
    onRequireAuth: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
}

/**
 * Songwriting
 *
 * Song project manager page. Left sidebar lists all projects;
 * main area shows either a "create new" splash (no project open)
 * or the full project editor (sections, chord progressions, lyrics).
 *
 * Owns UI-level state (which modal is open, input drafts, save message)
 * and delegates project/section data management to useSongProjects.
 */
function Songwriting({ onRequireAuth, isLoggedIn, onLogout }: SongwritingProps) {

    // custom hooks
    const {
        projects,
        activeProject,
        updateActiveProject,
        createNewProject,
        handleSelectProject,
        saveActiveProject,
        deleteProject,
    } = useSongProjects();

    // UI state
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [activeAddItemSection, setActiveAddItemSection] = useState<string | null>(null);
    const [activeChordPickerSection, setActiveChordPickerSection] = useState<{
        sectionId: string;
        itemId: string;
    } | null>(null);

    // Input draft states — local copies of the active project's
    // title/key/bpm that update on every keystroke, only committing
    // to real project state on blur or Enter.
    const [titleInput, setTitleInput] = useState<string>("");
    const [keyInput, setKeyInput] = useState<string>("");
    const [bpmInput, setBpmInput] = useState<string>("");
    const [saveMessage, setSaveMessage] = useState<string>("");

    // Saved chords for ChordPickerModal
    const [savedChords, setSavedChords] = useState<SavedChord[]>([]);
    useEffect(() => {
        fetchSavedChords().then((chords) => setSavedChords(chords));
    }, []);


    //** Project Level Handler */

    /**
     * Creates a new project w/ the hook, then syncs the local
     * input drafts to match the newly created project's values.
     */
    function handleCreateNewProject(
        title: string,
        key: string | null,
        bpm: string | null
    ) {
        const newProject = createNewProject(title, key, bpm);
        setTitleInput(newProject.title);
        setKeyInput(newProject.key ?? "");
        setBpmInput(newProject.bpm ?? "");
        setShowNewProjectModal(false);
    }

    /**
     * Switches to a different project with hook (with unsaved-
     * changes guard), then syncs the input drafts to the new project.
     */
    function handleSelectProjectAndUpdateInputs(projectId: string) {
        const project = handleSelectProject(projectId);
        if (!project) return;
        setTitleInput(project.title);
        setKeyInput(project.key ?? "");
        setBpmInput(project.bpm ?? "");
    }

    // Title / key / bpm save handlers

    function handleTitleSave() {
        const trimmed = titleInput.trim();
        if (trimmed === "" || trimmed === activeProject?.title) return;
        updateActiveProject((prev) => ({ ...prev, title: trimmed }));
    }

    function handleKeySave() {
        const trimmed = keyInput.trim();
        updateActiveProject((prev) => ({ ...prev, key: trimmed === "" ? null : trimmed }));
    }

    function handleBpmSave() {
        const trimmed = bpmInput.trim();
        updateActiveProject((prev) => ({ ...prev, bpm: trimmed === "" ? null : trimmed }));
    }

    async function handleSaveProject() {
        try {
            await saveActiveProject();
            setSaveMessage("Project saved!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch {
            onRequireAuth();
        }
    }
    function handleChordDeleted(id: number) {
        setSavedChords((prev) => prev.filter((chord) => chord.id !== id));
    }

    //** Section Handlers */

    function addSection() {
        const newSection: Section = {
            id: crypto.randomUUID(),
            name: "New Section",
            items: [],
        };
        updateActiveProject((prev) => ({
            ...prev,
            sections: [...prev.sections, newSection],
        }));
    }

    function updateSectionName(sectionId: string, newName: string) {
        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? { ...section, name: newName }
                    : section
            ),
        }));
    }

    function removeSection(sectionId: string) {
        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.filter((section) => section.id !== sectionId),
        }));
    }

    //** Section Item Handlers */

    function addItemToSection(sectionId: string, itemType: SectionItemType) {
        const newItem: SectionItem =
            itemType === "chords"
                ? { id: crypto.randomUUID(), type: "chords", chords: [], description: "" }
                : itemType === "pedal"
                    ? { id: crypto.randomUUID(), type: "pedal", presets: [] }
                    : { id: crypto.randomUUID(), type: "lyrics", text: "" };

        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? { ...section, items: [...section.items, newItem] }
                    : section
            ),
        }));
    }

    function removeItemFromSection(sectionId: string, itemId: string) {
        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
                    : section
            ),
        }));
    }

    function updateLyricsItem(sectionId: string, itemId: string, newText: string) {
        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map((item) =>
                            item.id === itemId && item.type === "lyrics"
                                ? { ...item, text: newText }
                                : item
                        ),
                    }
                    : section
            ),
        }));
    }

    function updateChordDescription(sectionId: string, itemId: string, description: string) {
        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map((item) =>
                            item.id === itemId && item.type === "chords"
                                ? { ...item, description }
                                : item
                        ),
                    }
                    : section
            ),
        }));
    }

    function addChordToItem(sectionId: string, itemId: string, chord: SavedChord) {
        const chordInstance: SavedChord = { ...chord, id: crypto.randomUUID() };

        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map((item) =>
                            item.id === itemId && item.type === "chords"
                                ? { ...item, chords: [...item.chords, chordInstance] }
                                : item
                        ),
                    }
                    : section
            ),
        }));
    }

    function removeChordFromItem(sectionId: string, itemId: string, chordIndex: number) {
        updateActiveProject((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map((item) =>
                            item.id === itemId && item.type === "chords"
                                ? { ...item, chords: item.chords.filter((_, i) => i !== chordIndex) }
                                : item
                        ),
                    }
                    : section
            ),
        }));
    }

    return (

        <div>
            <Header>
                <div className="header-nav-group">
                    <Link to="/" className="header-buttons">home</Link>
                    <Link to="/chords" className="header-buttons">interactive fretboard </Link>
                </div>
                {isLoggedIn ? (
                    <button className="header-buttons" onClick={onLogout}>log out</button>
                ) : (
                    <button className="header-buttons" onClick={onRequireAuth}>login</button>
                )}
            </Header>
            <div className="songwriting-page">

                <ProjectSidebar
                    projects={projects}
                    activeProjectId={activeProject?.id ?? null}
                    onSelectProject={handleSelectProjectAndUpdateInputs}
                    onNewProject={() => setShowNewProjectModal(true)}
                    onDeleteProject={deleteProject}
                />

                <div className="songwriting-main">
                    {activeProject === null ? (
                        <div className="songwriting-splash">
                            <button
                                className="new-project-splash-button"
                                onClick={() => setShowNewProjectModal(true)}
                            >
                                + Create New Project
                            </button>
                        </div>
                    ) : (
                        <div className="songwriting-editor">

                            <div className="project-header">
                                <input
                                    type="text"
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    onBlur={handleTitleSave}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleTitleSave(); }}
                                    className="project-title-input"
                                />

                                <div className="project-header-right">
                                    <div className="project-meta-field">
                                        <label>Key</label>
                                        <input
                                            type="text"
                                            value={keyInput}
                                            onChange={(e) => setKeyInput(e.target.value)}
                                            onBlur={handleKeySave}
                                            onKeyDown={(e) => { if (e.key === "Enter") handleKeySave(); }}
                                            className="project-meta-input"
                                            placeholder="N/A"
                                        />
                                    </div>

                                    <div className="project-meta-field">
                                        <label>BPM</label>
                                        <input
                                            type="text"
                                            value={bpmInput}
                                            onChange={(e) => setBpmInput(e.target.value)}
                                            onBlur={handleBpmSave}
                                            onKeyDown={(e) => { if (e.key === "Enter") handleBpmSave(); }}
                                            className="project-meta-input"
                                            placeholder="N/A"
                                        />
                                    </div>

                                    <div className="project-header-actions">
                                        <button onClick={handleSaveProject}>Save Project</button>
                                        {saveMessage && <span className="save-message">{saveMessage}</span>}
                                    </div>
                                </div>
                            </div>

                            {activeProject.sections.map((section) => (
                                <SectionEditor
                                    key={section.id}
                                    section={section}
                                    onUpdateName={(name) => updateSectionName(section.id, name)}
                                    onRemoveSection={() => removeSection(section.id)}
                                    onAddItem={() => setActiveAddItemSection(section.id)}
                                    onRemoveItem={(itemId) => removeItemFromSection(section.id, itemId)}
                                    onUpdateLyrics={(itemId, text) => updateLyricsItem(section.id, itemId, text)}
                                    onOpenChordPicker={(itemId) => setActiveChordPickerSection({ sectionId: section.id, itemId })}
                                    onRemoveChord={(itemId, chordIndex) => removeChordFromItem(section.id, itemId, chordIndex)}
                                    onUpdateDescription={(itemId, text) => updateChordDescription(section.id, itemId, text)}
                                />
                            ))}

                            <button className="add-button" onClick={addSection}>+ Add Section</button>
                        </div>
                    )}
                </div>

                {showNewProjectModal && (
                    <NewProjectModal
                        onConfirm={handleCreateNewProject}
                        onClose={() => setShowNewProjectModal(false)}
                    />
                )}

                {activeAddItemSection && (
                    <AddSectionItemModal
                        onAdd={(type) => {
                            addItemToSection(activeAddItemSection, type);
                            setActiveAddItemSection(null);
                        }}
                        onClose={() => setActiveAddItemSection(null)}
                    />
                )}

                {activeChordPickerSection && (
                    <ChordPickerModal
                        savedChords={savedChords}
                        onSelectChord={(chord) => {
                            addChordToItem(
                                activeChordPickerSection.sectionId,
                                activeChordPickerSection.itemId,
                                chord
                            );
                            setActiveChordPickerSection(null);
                        }}
                        onChordDeleted={handleChordDeleted}
                        onClose={() => setActiveChordPickerSection(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default Songwriting;