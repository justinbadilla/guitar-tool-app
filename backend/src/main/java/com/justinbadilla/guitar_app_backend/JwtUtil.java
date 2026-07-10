package com.justinbadilla.guitar_app_backend;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;


/**
 * JwtUtil
 *
 * Creates and validates JWTs (JSON Web Tokens) use to prove a request from a logged-in user. 
 * JWT is a signed string with three parts (header.payload.signature). 
 * The payload carries claims (e.g: token ownership, token expiration type, etc.)
 * the signature proves those claims haven't been tampered with, using a secret key only this server knows.
 *
 * The payload is NOT encrypted. Anyone can decode and read it (e.g. at jwt.io). 
 * Signature only proves integrity, not secrecy.
 *
 * IMPORTANT!!! -  secretKey is generated randomly every time app starts.
 * Every previously issued token becomes invalid whenever backend restarts.
 * For real deployment, remember to load a fixed secret from an environment variable instead, so
 * tokens survive restarts and stay valid across server instances.
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256); //fix later
    private final long expirationMs = 1000 * 60 * 60 * 24; // 24 hours

    /**
     * Creates new signed token for the given username, valid for 24 hours from now. 
     * This is what /api/auth returns to the frontend on successful login.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) // who this token represents
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey) // cryptographically signs the token using secretKey
                .compact(); // produces the final "header.payload.signature" string
    }

    /**
     * Parses token and returns the username embedded in it.
     * Only call this after isTokenValid() has confirmed the token is genuine. 
     * An invalid/tampered token would throw here instead of returning a safe fallback.
     */
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey) // recheck signature against server key
                .build()
                .parseSignedClaims(token) //throws
                .getPayload()
                .getSubject(); // reads back the username set by generateToken()
    }

    /**
     * Checks whether a token's signature is valid and it hasn't expired. 
     * Used by JwtAuthFilter before trusting any token found on an incoming request. 
     * Returns false for any parsing failure, so callers get a simple boolean check.
     */
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false; // covers expired tokens, tampered signatures, malformed strings, etc.
        }
    }
}