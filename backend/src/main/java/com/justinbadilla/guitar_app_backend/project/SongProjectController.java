package com.justinbadilla.guitar_app_backend.project;

import com.justinbadilla.guitar_app_backend.auth.CurrentUser;
import com.justinbadilla.guitar_app_backend.auth.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * SongProjectController
 *
 * Handles fetching and saving the current user's song projects BOTH endpoints
 * here require a valid JWT.
 *
 * saveProject() acts as an upsert (update record, otherwise create new if it
 * doesn't exist).
 * Single endpoint for both creating a new project and updating an existing one.
 * Which happens
 * depends entirely on whether the SongProjectEntity's id is null (insert -
 * Postgres assigns new id)
 * or matches an existing row (update - overwrite row)
 *
 * FUTURE UPDATE!!!! production version should check
 * existingProject.getUser().equals(currentUser) before allowing an
 * update through.
 */

@RestController
@RequestMapping("/api/projects")
public class SongProjectController {

    private final SongProjectRepository repository;
    private final CurrentUser currentUser;

    public SongProjectController(SongProjectRepository repository, CurrentUser currentUser) {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    /**
     * Returns only the current user's song projects. Logged-out requests get an
     * empty list rather than an error
     * But endpoint isn't reachable while logged out anyway, since it's not in
     * SecurityConfig's permitAll list.
     */
    @GetMapping
    public List<SongProjectEntity> getAllProjects() {
        Optional<User> user = currentUser.find();

        if (user.isEmpty()) {
            return List.of();
        }

        return repository.findByUser(user.get());
    }

    /**
     * Creates or updates a song project. Always attaches the requesting user as the
     * project's owner before saving.
     */
    @PostMapping
    public SongProjectEntity saveProject(@RequestBody SongProjectEntity project) {
        User user = currentUser.find()
                .orElseThrow(() -> new RuntimeException("Must be logged in to save a project"));

        project.setUser(user);
        return repository.save(project);
    }

    /**
     * Deletes a song project
     */
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        User user = currentUser.find()
                .orElseThrow(() -> new RuntimeException("Must be logged in to delete a project"));

        SongProjectEntity project = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this project");
        }

        repository.deleteById(id);
    }
}