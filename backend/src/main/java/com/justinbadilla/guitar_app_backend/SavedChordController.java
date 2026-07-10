package com.justinbadilla.guitar_app_backend;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.Optional;


/**
 * SavedChordController
 *
 * Handles fetching and saving the current user's saved chords.
 * GET is public but still scoped per-user. Logged-out requests get an empty list back. 
 * POST requires a valid JWT (from SecurityConfig's authenticated() rule)
 * and always attaches the requester as the chord's owner.
 */
@RestController
@RequestMapping("/api/chords")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedChordController {

    private final SavedChordRepository repository;
    private final UserRepository userRepository;

    public SavedChordController(SavedChordRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    /**
     * Returns current user's saved chords.
     * Logged-out requests get empty list since browsing without an account is allowed.
     */
    @GetMapping
    public List<SavedChord> getAllChords() {
        Optional<User> currentUser = getCurrentUser();

        if (currentUser.isEmpty()) {
            return List.of(); // logged-out users see an empty list
        }

        return repository.findByUser(currentUser.get());
    }

    /**
     * Saves a new chord, attached to user making request. 
     * orElseThrow() is a defensive fallback
     * (Spring Security blocks unauthenticated POSTs before this code runs) 
     */
    @PostMapping
    public SavedChord saveChord(@RequestBody SavedChord chord) {
        User user = getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Must be logged in to save a chord"));

        chord.setUser(user);
        return repository.save(chord);
    }

    /**
     * Reads current authenticated user (if any) out of Spring
     * Security's context (same context JwtAuthFilter writes into after validating a request's token)
     *
     * Spring Security represents "not logged in" with a special anonymous Authentication object rather than null.
     * Both conditions have to be checked: absent auth object AND the specific anonymousUser placeholder,
     * that Spring substitutes in when no real token was provided.
     */
    private Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }

        String username = auth.getName();
        return userRepository.findByUsername(username);
    }
}