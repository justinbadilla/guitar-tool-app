package com.justinbadilla.guitar_app_backend;

import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController
 *
 * Handles registration and login. Registration hashes the password
 * (never stored in plain text) and rejects duplicate usernames. Login
 * verifies credentials and issues a signed JWT that the
 * frontend attaches to subsequent requests to prove who's making them.
 *
 * Both endpoints are public (see SecurityConfig's "/api/auth/**" rule) —
 * you can't require a token to log in, since you don't have one yet.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Registers new user. Rejects request with 409 if username
     * is already taken. Otherwise, hashes password and saves user.
     */
    @PostMapping("/register")
    // ResponseEntity <?> used because the response body differs by outcome 
    // can be a plain success/error string here, but a structured object in login() below 
    // The <?> lets either struct or data be returned from methods with this return type.
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(409).body("Username already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    /**
     * Logs a user in. Verifies the username exists and the password
     * matches its stored hash, then issues a signed JWT on success.
     *
     * Both failure cases (unknown username, wrong password) return the
     * same generic 401 message deliberately (returning different
     * messages would let an attacker discover which usernames are
     * registered just by trying to log in with them.)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userOptional.get();

        // matches() re-hashes the raw password and compares — the stored
        // hash itself is never decoded, since that's not possible by design
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}