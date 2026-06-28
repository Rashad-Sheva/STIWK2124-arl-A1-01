package arl.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security — Basic Auth + CORS configuration.
 *
 * IMPORTANT: http.cors() MUST be called here so Spring Security's
 * filter chain handles CORS BEFORE making any auth decisions.
 * Without this, @CrossOrigin on the controller is ignored and
 * all browser requests fail (CORS headers never reach the browser).
 *
 * Policy:
 *  - GET /api/books/**  →  public (no auth needed)
 *  - POST / PUT / DELETE  →  require Basic Auth
 *  - OPTIONS (preflight) →  always allowed (handled by CORS filter)
 *  - CSRF disabled (stateless REST API)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // MUST be first — CORS filter runs before auth filter
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .csrf(AbstractHttpConfigurer::disable)

            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Allow CORS preflight for all endpoints
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public read access
                .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                // Write operations require Basic Auth
                .requestMatchers(HttpMethod.POST,   "/api/books/**").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/api/books/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/books/**").authenticated()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    /**
     * CORS configuration source — explicitly allows Angular dev server.
     * This runs as a Spring Security filter (before controllers),
     * ensuring CORS headers are always present in responses.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow Angular dev server
        config.setAllowedOrigins(List.of("http://localhost:4200"));

        // Allow all standard HTTP methods including OPTIONS (preflight)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers (including Authorization for Basic Auth)
        config.setAllowedHeaders(List.of("*"));

        // Allow Authorization header to be sent
        config.setAllowCredentials(true);

        // Cache preflight for 1 hour (reduces OPTIONS requests)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
