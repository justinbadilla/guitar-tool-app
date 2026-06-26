package com.justinbadilla.guitar_app_backend;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chords")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedChordController {

    private final SavedChordRepository repository;

    public SavedChordController(SavedChordRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SavedChord> getAllChords() {
        return repository.findAll();
    }

    @PostMapping
    public SavedChord saveChord(@RequestBody SavedChord chord) {
        return repository.save(chord);
    }
}