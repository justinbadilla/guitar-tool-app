package com.justinbadilla.guitar_app_backend.auth;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * CurrentUser
 *
 * Resolves the authenticated user for the request being handled. Shared by every
 * controller that needs to know "who is asking" (saved chords, song projects) so that
 * logic lives in one place.
 *
 * Reads the Authentication that JwtAuthFilter wrote into Spring Security's context
 * after validating the request's token, then loads the matching User row.
 *
 * Spring Security represents "not logged in" with a special anonymous Authentication
 * object rather than null. Both conditions have to be checked: an absent auth object AND the
 * "anonymousUser" placeholder Spring substitutes in when no real token was provided.
 */
@Component
public class CurrentUser {

    private final UserRepository userRepository;

    public CurrentUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * @return the logged-in user, or empty if the request is anonymous
     *         (or the token's username no longer exists)
     */
    public Optional<User> find() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }

        return userRepository.findByUsername(auth.getName());
    }
}
