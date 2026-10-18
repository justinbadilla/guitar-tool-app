package com.justinbadilla.guitar_app_backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * UserRepository
 *
 * Handles all database operations for User
 *
 * findByUsername() returns Optional<User> rather than List<User>, since a username is unique
 * (enforced by User's @Column(unique = true)) — there's either exactly one matching user or none
 * Optional forces callers (AuthController, both saved-item controllers' getCurrentUser())
 * to handle the "no such user" case rather than risking a null reference.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}