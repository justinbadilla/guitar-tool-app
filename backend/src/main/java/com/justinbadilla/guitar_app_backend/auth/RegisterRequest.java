package com.justinbadilla.guitar_app_backend;

/**
 * RegisterRequest
 *
 * The expected JSON shape for both register and 
 * login requests: { "username": "...", "password": "..." }.
 *
 * Jackson reads incoming JSON and calls the matching setXxx() method for each field it finds, 
 * using reflection the same way it calls getXxx() methods to build outgoing JSON.
 * Jackson calls setUsername() and setPassword() automatically whenever @RequestBody
 * RegisterRequest is used as a controller parameter.
 */
public class RegisterRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}