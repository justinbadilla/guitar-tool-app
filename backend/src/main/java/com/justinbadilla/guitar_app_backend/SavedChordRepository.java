package com.justinbadilla.guitar_app_backend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedChordRepository extends JpaRepository<SavedChord, Long> {
}