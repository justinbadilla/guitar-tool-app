package com.justinbadilla.guitar_app_backend;

/**
 * LoginResponse
 *
 * The JSON shape returned by /api/auth on success: just the
 * issued JWT. Kept as its own small class (rather than returning the
 * raw token string, or reusing User) so the response is a structured
 * JSON object like { "token": "..." } — easier for the frontend to
 * parse and extend later (e.g. adding a username or expiry field)
 * without changing the response's overall shape.
 */
public class LoginResponse {
    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }

    //Springs JSON calls this
    public String getToken() {
        return token;
    }
}