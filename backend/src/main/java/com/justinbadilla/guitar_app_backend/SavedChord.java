package com.justinbadilla.guitar_app_backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SavedChord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String positionsJson;

    @Column(columnDefinition = "TEXT")
    private String tuningJson;

    // getters and setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTuningJson() { 
        return tuningJson; 
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPositionsJson() {
        return positionsJson;
    }

    public void setPositionsJson(String positionsJson) {
        this.positionsJson = positionsJson;
    }

    public void setTuningJson(String tuningJson) {
        this.tuningJson = tuningJson; 
    }
}
