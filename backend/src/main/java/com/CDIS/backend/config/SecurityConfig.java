package com.CDIS.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.CDIS.backend.security.JwtAuthenticationFilter;

/**
 * Security configuration class that sets up HTTP security, authentication mechanisms,
 * and role-based access control (RBAC) across the API endpoints.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Disable CSRF since we are using stateless JWT authentication
                .csrf(csrf -> csrf.disable())
                // Ensure the session is stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    // Any authenticated user can purchase a vehicle and view their purchase history
                    .requestMatchers(HttpMethod.POST, "/api/vehicles/{id}/purchase").hasAnyRole("USER", "ADMIN")
                    .requestMatchers("/api/purchases/**").hasAnyRole("USER", "ADMIN")
                    // Only admins can create, update, delete vehicles or restock inventory
                    .requestMatchers(HttpMethod.POST, "/api/vehicles").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/vehicles/{id}/restock").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasRole("ADMIN")
                    .requestMatchers("/api/vehicles/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
