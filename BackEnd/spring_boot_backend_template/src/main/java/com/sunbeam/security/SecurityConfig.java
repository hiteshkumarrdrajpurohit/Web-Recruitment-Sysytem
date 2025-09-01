package com.sunbeam.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
	
	@Autowired
	private JwtFilter jwtFilter;

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService) throws Exception {
		AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
		authManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
		return authManagerBuilder.build();
	}
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
		"http://localhost:5174",//te dev server
        "http://127.0.0.1:5173",    // Vite dev server alternative
        "http://3.111.47.177",      // if frontend served on port 80
        "http://3.111.47.177:8080"
    ));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	SecurityFilterChain authorizeRequests(HttpSecurity http) throws Exception {
		
		http.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.authorizeHttpRequests(requests -> requests
					// Public endpoints - no authentication required
					.requestMatchers("/swagger-ui/**", "/v**/api-docs/**", "/users/signin", "/users/signup", 
						"/vacancies", "/vacancies/**").permitAll()
					
					// USER role access - Job seekers and candidates
					.requestMatchers("/users/profile", "/users/update", "/dashboard/applicant/**", 
						"/applications/apply", "/applications/user/**", "/applications/my", 
						"/applications/check-applied/**").hasRole("USER")
					
					// HRMANAGER role access - HR and recruitment staff
					.requestMatchers("/vacancies/all", "/applications", "/applications/**", 
						"/interviews/**", "/hirings/**", "/dashboard/hr/**").hasRole("HRMANAGER")
					
					// Shared access between USER and HRMANAGER
					.requestMatchers("/users/candidates", "/interviews/application/**", "/interviews/*").hasAnyRole("HRMANAGER", "USER")
					
					.anyRequest().authenticated()
				)
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		return http.build();
	}

}
