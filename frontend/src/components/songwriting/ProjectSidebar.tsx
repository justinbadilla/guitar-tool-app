import "./ProjectSidebar.css";
import type { SongProject } from "./type";

interface ProjectSidebarProps {
    className?: string;

    projects: SongProject[];
    activeProjectId: string | null;
    onSelectProject: (id: string) => void;
    onNewProject: () => void;
    onDeleteProject: (id: string) => void;
}

/**
 * ProjectSidebar
 * 
 * Left-column panel showing all existing song projects and a button
 * to create a new one. Only visual, doesn't own any project
 * data itself, receives list and reports selections upward
 */
function ProjectSidebar({ className = "", projects, activeProjectId, onSelectProject, onNewProject, onDeleteProject }: ProjectSidebarProps) {
    return (
        <div className={`project-sidebar ${className}`}>
            <div className="project-sidebar-header">
                <h3>My Projects</h3>
                <button className="btn btn-small btn-secondary" onClick={onNewProject}>+</button>
            </div>

            <div className="project-sidebar-list">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className={`project-sidebar-item ${project.id === activeProjectId ? "active" : ""}`}
                        onClick={() => onSelectProject(project.id)}
                    >
                        <span className="project-sidebar-title">{project.title}</span>
                        <button
                            className="remove-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                const confirmed = window.confirm(`Delete "${project.title}"? This cannot be undone.`);
                                if (confirmed) {
                                    onDeleteProject(project.id);
                                }
                            }}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectSidebar;