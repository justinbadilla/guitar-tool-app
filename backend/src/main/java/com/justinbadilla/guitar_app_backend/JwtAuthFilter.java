package com.justinbadilla.guitar_app_backend;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

/**
 * JwtAuthFilter
 *
 * Runs once for every incoming HTTP request, before it reaches any controller. 
 * Looks for a "Bearer <token>" Authorization header. If the token is there and valid, 
 * it marks the request as authenticated (as that token's username) through SecurityContextHolder.
 * 
 * This filter doesn't reject requests, it only annotates it with identity info when a valid token is found. 
 * SecurityConfig's authorizeHttpRequests, separately decides if a given endpoint requires that identity.
 * If token is not vaild, then request proceeds as anonymous, and SecurityConfig decides whether that's allowed.
 *
 * Wired into the security chain through SecurityConfig's addFilterBefore(),
 * so it runs ahead of Spring Security's own built-in auth filter.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Reads Authorization header, validates present token, and (if valid)
     * sets the current request's authenticated user before letting the request continue down the filter chain.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Standard convention: tokens are sent as "Authorization: Bearer <token>"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // strip the "Bearer " prefix (7 characters)

            if (jwtUtil.isTokenValid(token)) {
                String username = jwtUtil.extractUsername(token);

                // No roles/admins needed for this app, so we have emptyList()
                //the username is just downstream code needed to identify user
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null,
                        java.util.Collections.emptyList());

                // This is what makes the request "authenticated" for the rest of the pipeline.
                // Controllers read this back through SecurityContextHolder.getContext().getAuthentication().
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue the chain, regardless if a valid token was found.
        // Rejecting unauthenticated requests is SecurityConfig's job
        filterChain.doFilter(request, response);
    }
}