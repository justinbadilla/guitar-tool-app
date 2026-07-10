package com.justinbadilla.guitar_app_backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


/**
 * User
 *
 * A registered account. passwordHash stores a one-way BCrypt hash. AuthController.register() is the only place
 * a raw password exists before being hashed and discarded (no way to recover original password from this hash). 
 * Login works by re-hashing an attempt and comparing (never decodes)
 *
 * @Table (name = "app_user") is needed: "user" is a reserved word (has special meaning in own system tables/queries) 
 * Hibernate's default table-naming (User -> "user") caused real runtime errors ("column does not exist")
 */
@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}