package com.justinbadilla.guitar_app_backend.chord;

import com.justinbadilla.guitar_app_backend.auth.CurrentUser;
import com.justinbadilla.guitar_app_backend.auth.User;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * SavedChordController
 *
 * Handles fetching and saving the current user's saved chords.
 * GET is public but still scoped per-user. Logged-out requests get an empty
 * list back.
 * POST requires a valid JWT (from SecurityConfig's authenticated() rule)
 * and always attaches the requester as the chord's owner.
 */
@RestController
@RequestMapping("/api/chords")
public class SavedChordController {

    private final SavedChordRepository repository;
    private final CurrentUser currentUser;

    public SavedChordController(SavedChordRepository repository, CurrentUser currentUser) {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    /**
     * Returns current user's saved chords.
     * Logged-out requests get empty list since browsing without an account is
     * allowed.
     */
    @GetMapping
    public List<SavedChord> getAllChords() {
        Optional<User> user = currentUser.find();

        if (user.isEmpty()) {
            return List.of(); // logged-out users see an empty list
        }

        return repository.findByUser(user.get());
    }

    /**
     * Saves a new chord, attached to user making request.
     * orElseThrow() is a defensive fallback
     * (Spring Security blocks unauthenticated POSTs before this code runs)
     */
    @PostMapping
    public SavedChord saveChord(@RequestBody SavedChord chord) {
        User user = currentUser.find()
                .orElseThrow(() -> new RuntimeException("Must be logged in to save a chord"));

        chord.setUser(user);
        return repository.save(chord);
    }

    /**
     * Deletes a saved chord, attached to user making request.
     * 
     */
    @DeleteMapping("/{id}")
    public void deleteChord(@PathVariable Long id) {
        User user = currentUser.find()
                .orElseThrow(() -> new RuntimeException("Must be logged in to delete a chord"));

        SavedChord chord = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chord not found"));

        if (!chord.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this chord");
        }

        repository.deleteById(id);
    }
}