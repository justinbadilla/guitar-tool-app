package com.justinbadilla.guitar_app_backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * SongProjectRepository
 *
 * Handles all database operations for SongProjectEntity (same pattern as SavedChordRepository)
 * findByUser() gets auto-implemented
 */
public interface SongProjectRepository extends JpaRepository<SongProjectEntity, Long> {
    List<SongProjectEntity> findByUser(User user);
}