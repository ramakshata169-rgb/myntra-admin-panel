
package com.tka.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

  
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            
            .csrf(csrf -> csrf.disable())

            
            .cors(cors -> cors.configurationSource(request -> {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(
                    List.of("http://localhost:5173")
                );

                config.setAllowedMethods(
                    List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                    )
                );

                config.setAllowedHeaders(
                    List.of("*")
                );

                config.setAllowCredentials(true);

                return config;
            }))

           
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            
            .logout(logout -> logout
                .logoutUrl("/api/admin/logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .logoutSuccessHandler(
                    (request, response, authentication) -> {

                        response.setStatus(200);
                        response.setContentType("application/json");

                        response.getWriter().write(
                            "{\"message\":\"Logout successful\"}"
                        );
                    }
                )
            );

        return http.build();
    }
}




