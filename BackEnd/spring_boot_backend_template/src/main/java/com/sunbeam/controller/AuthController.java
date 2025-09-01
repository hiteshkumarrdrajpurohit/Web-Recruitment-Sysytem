package com.sunbeam.controller;

import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.sunbeam.dto.SignInDTO;
import com.sunbeam.dto.SignUpDTO;
import com.sunbeam.dto.UpdateUserDTO;
import com.sunbeam.dto.UserDTO;
import com.sunbeam.dto.ApiResponse;
import com.sunbeam.dto.SignInResponseDTO;
import com.sunbeam.service.UserService;
import lombok.AllArgsConstructor;
import com.sunbeam.custom_exceptions.AuthenticationFailureException;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class AuthController {
    
    private UserService userService;
    
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@Valid @RequestBody SignInDTO signInCredential) {
        try {
            // Delegate all business logic to service layer
            SignInResponseDTO response = userService.signInWithToken(signInCredential);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // For authentication failures, throw custom exception with message
            throw new AuthenticationFailureException("Invalid email or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpDTO signUpCredential) {
        return ResponseEntity.ok(userService.signUp(signUpCredential));
    }

    /**
     * Get user profile
     * @param authentication - Current user authentication
     * @return User profile data
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('HRMANAGER')")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Update user profile
     * @param updateUserDTO - Updated user data
     * @param authentication - Current user authentication
     * @return Success response
     */
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('HRMANAGER')")
    public ResponseEntity<ApiResponse> updateProfile(@RequestBody UpdateUserDTO updateUserDTO, Authentication authentication) {
        String email = authentication.getName();
        UserDTO currentUser = userService.getUserByEmail(email);
        ApiResponse response = userService.updateUser(currentUser.getId(), updateUserDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all candidates (users with USER role) - for HR
     * @return List of all candidates
     */
    @GetMapping("/candidates")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<List<UserDTO>> getAllCandidates() {
        List<UserDTO> candidates = userService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

}
