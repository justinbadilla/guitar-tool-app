package com.justinbadilla.guitar_app_backend;

import jakarta.persistence.*;

/**
 * SongProjectEntity
 *
 * A song project belonging to the user who created it. sectionsJson
 * stores entire nested sections array (sections -> items -> chords/lyrics/pedals) as one JSON blob (not relational)
 *
 * Named "Entity" (not just SongProject) to differ it from the frontend's SongProject TypeScript type
 * The frontend does the JSON.stringify()/parse() translation between the two on save/fetch.
 *
 * songKey (not key) to avoid any ambiguity with Java's own use of common term "key" (e.g. Map keys)
 */
@Entity
@Table(name = "song_project")
public class SongProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String songKey;
    private String bpm;

    @Column(columnDefinition = "TEXT")
    private String sectionsJson;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSongKey() { return songKey; }
    public void setSongKey(String songKey) { this.songKey = songKey; }

    public String getBpm() { return bpm; }
    public void setBpm(String bpm) { this.bpm = bpm; }

    public String getSectionsJson() { return sectionsJson; }
    public void setSectionsJson(String sectionsJson) { this.sectionsJson = sectionsJson; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}