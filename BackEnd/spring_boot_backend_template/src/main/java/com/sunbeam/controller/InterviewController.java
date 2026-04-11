package com.sunbeam.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.dto.ApiResponse;
import com.sunbeam.dto.InterviewDTO;
import com.sunbeam.entity.types.InterviewStatus;
import com.sunbeam.service.InterviewService;

import lombok.AllArgsConstructor;

/**
 * REST Controller for Interview operations
 * Handles all interview-related HTTP requests
 */
@RestController
@RequestMapping("/interviews")
@AllArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    /**
     * Get all interviews (HR only)
     * @return List of all interviews
     */
    @GetMapping
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<List<InterviewDTO>> getAllInterviews() {
        List<InterviewDTO> interviews = interviewService.getAllInterviews();
        return ResponseEntity.ok(interviews);
    }

    /**
     * Get interview by ID
     * @param id - Interview ID
     * @return Interview details
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('HRMANAGER') or hasRole('USER')")
    public ResponseEntity<InterviewDTO> getInterviewById(@PathVariable Long id) {
        InterviewDTO interview = interviewService.getInterviewById(id);
        return ResponseEntity.ok(interview);
    }

    /**
     * Create new interview (HR only)
     * @param interviewDTO - Interview details
     * @param authentication - Current user authentication
     * @return Created interview
     */
    @PostMapping
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<InterviewDTO> createInterview(@RequestBody InterviewDTO interviewDTO, Authentication authentication) {
        String userEmail = authentication.getName();
        InterviewDTO createdInterview = interviewService.createInterviewByEmail(interviewDTO, userEmail);
        return ResponseEntity.ok(createdInterview);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<InterviewDTO> updateInterview(@PathVariable Long id, @RequestBody InterviewDTO interviewDTO) {
        InterviewDTO updatedInterview = interviewService.updateInterview(id, interviewDTO);
        return ResponseEntity.ok(updatedInterview);
    }

    /**
     * Update interview status
     * @param id - Interview ID
     * @param status - New status
     * @return Updated interview
     */
    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<InterviewDTO> updateInterviewStatus(
            @PathVariable Long id,
            @PathVariable InterviewStatus status) {
        InterviewDTO dto = new InterviewDTO();
        dto.setStatus(status);
        InterviewDTO updatedInterview = interviewService.updateInterview(id, dto);
        return ResponseEntity.ok(updatedInterview);
    }

    /**
     * Delete interview (HR only)
     * @param id - Interview ID
     * @return Success response
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<ApiResponse> deleteInterview(@PathVariable Long id) {
        ApiResponse response = interviewService.deleteInterview(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get interviews by status
     * @param status - Interview status
     * @return List of interviews with the given status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByStatus(@PathVariable InterviewStatus status) {
        List<InterviewDTO> interviews = interviewService.getInterviewsByStatus(status);
        return ResponseEntity.ok(interviews);
    }

    /**
     * Get interviews by application ID
     * @param applicationId - Application ID
     * @return List of interviews for the application
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasRole('HRMANAGER') or hasRole('USER')")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByApplication(@PathVariable Long applicationId) {
        List<InterviewDTO> interviews = interviewService.getInterviewsByApplication(applicationId);
        return ResponseEntity.ok(interviews);
    }
}
