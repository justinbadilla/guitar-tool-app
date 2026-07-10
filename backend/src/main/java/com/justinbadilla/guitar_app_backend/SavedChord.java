package com.justinbadilla.guitar_app_backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * SavedChord
 *
 * A single saved chord shape, belonging to the user who saved it.
 * positionsJson and tuningJson are stored as raw JSON text (instead of relational model)
 *
 * The frontend does JSON.stringify() to a StringState[]
 * and tuning string[] before sending, and JSON.parse()-es them back
 * after fetching. This entity just stores/returns whatever text it's given.
 */
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

    //Many chords to one user... 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getters and setters
    public User getUser(){
        return user;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTuningJson() { 
        return tuningJson; 
    }

    public void setUser(User user) {
        this.user = user;
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
