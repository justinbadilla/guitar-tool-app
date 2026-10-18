package com.justinbadilla.guitar_app_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import java.util.List;

/**
 * SecurityConfig
 *
 * The app's central authorization policy: which endpoints are public, which
 * require a valid JWT,
 * and how CORS/CSRF/ sessions are handled. This allows who can access what.
 * (SavedChordController and SongProjectController rely on the rules declared
 * here)
 * Controllers per-user filtering logic assumes unauthenticated requests have
 * been identified as anonymous by this config
 * This means POST chords and both GET/POST APIs all require authentication,
 * since they aren't listed as public.
 * - /api/auth/** - fully public (can't require login to log in)
 * - GET /api/chords - public (browsing without an account is allowed)
 * - everything else - requires a valid JWT
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF protection - cookie/session-based concept (irrelevant for token-based
                // API)
                .csrf(csrf -> csrf.disable())

                // CORS must be configured, not just @CrossOrigin on controllers.
                // Once Security is active, it intercepts requests before they reach any
                // controller.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Every request must prove who it is through it's JWT. Rather than relying on a
                // session,
                // Spring remembers from an earlier request (No server-side sessions)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/chords").permitAll()
                        .anyRequest().authenticated())

                // Runs JWT-checking logic before Spring Security's built-in authentication
                // filter,
                // so a valid token is already recognized by the time Security's own checks
                // happen.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Defines which frontend origin, HTTP methods, and headers are allowed to make
     * cross-origin requests to backend.
     * Needed because the frontend and backend run on different ports.
     */
    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}