import type { SongProject } from "./type";

interface ProjectSidebarProps {
    projects: SongProject[];
    activeProjectId: string | null;
    onSelectProject: (id: string) => void;
    onNewProject: () => void;
}

/**
 * ProjectSidebar
 * 
 * Left-column panel showing all existing song projects and a button
 * to create a new one. Only visual, doesn't own any project
 * data itself, receives list and reports selections upward
 */
function ProjectSidebar({ projects, activeProjectId, onSelectProject, onNewProject }: ProjectSidebarProps) {
    return (
        <div className="project-sidebar">
            <div className="project-sidebar-header">
                <h3>My Projects</h3>
                <button onClick={onNewProject}>+</button>
            </div>

            <div className="project-sidebar-list">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className={`project-sidebar-item ${project.id === activeProjectId ? "active" : ""}`}
                        onClick={() => onSelectProject(project.id)}
                    >
                        {project.title}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectSidebar;