package com.devtask.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // step 1 — read the Authorization header
        final String authHeader = request.getHeader("Authorization");

        // step 2 — if no header or not Bearer, skip this filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // step 3 — extract pure token by removing "Bearer " (7 chars)
        final String token = authHeader.substring(7);

        // step 4 — extract email from token
        final String email = jwtService.extractEmail(token);

        // step 5 — if email found and user not already authenticated
        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // step 6 — load user from database
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // step 7 — validate the token against the user
            if (jwtService.isTokenValid(token, userDetails.getUsername())) {

                // step 8 — create authentication object
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // step 9 — attach request details to auth object
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // step 10 — tell Spring Security this user is authenticated
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // step 11 — pass request to next filter in chain
        filterChain.doFilter(request, response);
    }
}