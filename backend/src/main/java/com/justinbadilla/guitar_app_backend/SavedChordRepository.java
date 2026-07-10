package com.justinbadilla.guitar_app_backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * SavedChordRepository
 *
 * Handles all database operations for SavedChord (no implementation needed)
 * Extending JpaRepository<SavedChord, Long> does save(), indAll(), findById(), deleteById(), etc. automatically.
 * findByUser() is Spring Data JPA's method-name-to-query feature "findBy" + a field name matching an entity
 */
public interface SavedChordRepository extends JpaRepository<SavedChord, Long> {
    List<SavedChord> findByUser(User user);
}