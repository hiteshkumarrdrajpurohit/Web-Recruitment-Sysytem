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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.dto.ApiResponse;
import com.sunbeam.dto.VacancyDTO;
import com.sunbeam.entity.types.JobStatus;
import com.sunbeam.service.VacancyService;

import lombok.AllArgsConstructor;

/**
 * REST Controller for Vacancy operations
 * Handles all vacancy-related HTTP requests
 */
@RestController
@RequestMapping("/vacancies")
@AllArgsConstructor
public class VacancyController {

    private final VacancyService vacancyService;
    /**
     * Get all vacancies (Public access for job seekers)
     * @return List of all active vacancies
     */
    @GetMapping
    public ResponseEntity<List<VacancyDTO>> getAllVacancies() {
        List<VacancyDTO> vacancies = vacancyService.getAllActiveVacancies();
        return ResponseEntity.ok(vacancies);
    }
    /**
     * Get vacancy by ID
     * @param id - Vacancy ID
     * @return Vacancy details
     */
    @GetMapping("/{id}")
    public ResponseEntity<VacancyDTO> getVacancyById(@PathVariable Long id) {
        VacancyDTO vacancy = vacancyService.getVacancyById(id);
        return ResponseEntity.ok(vacancy);
    }  
    /**
     * Search vacancies by criteria
     * @param title - Job title (optional)
     * @param department - Department (optional)
     * @param location - Location (optional)
     * @return List of matching vacancies
     */
    @GetMapping("/search")
    public ResponseEntity<List<VacancyDTO>> searchVacancies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String location) {
        
        List<VacancyDTO> vacancies = vacancyService.searchVacancies(title, department, location);
        return ResponseEntity.ok(vacancies);
    }
    /**
     * Create new vacancy (HR only)
     * @param vacancyDTO - Vacancy details
     * @param authentication - Current authenticated user
     * @return Created vacancy
     */
    @PostMapping
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<VacancyDTO> createVacancy(@RequestBody VacancyDTO vacancyDTO, Authentication authentication) {
        String hrEmail = authentication.getName();
        VacancyDTO createdVacancy = vacancyService.createVacancy(vacancyDTO, hrEmail);
        return ResponseEntity.ok(createdVacancy);
    }
    /**
     * Update vacancy (HR only)
     * @param id - Vacancy ID
     * @param vacancyDTO - Updated vacancy details
     * @return Updated vacancy
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<VacancyDTO> updateVacancy(@PathVariable Long id, @RequestBody VacancyDTO vacancyDTO) {
        VacancyDTO updatedVacancy = vacancyService.updateVacancy(id, vacancyDTO);
        return ResponseEntity.ok(updatedVacancy);
    }

    /**
     * Delete vacancy (HR only)
     * @param id - Vacancy ID
     * @return Success response
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<ApiResponse> deleteVacancy(@PathVariable Long id) {
        ApiResponse response = vacancyService.deleteVacancy(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get vacancies by status (HR only)
     * @param status - Job status
     * @return List of vacancies with the given status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<List<VacancyDTO>> getVacanciesByStatus(@PathVariable JobStatus status) {
        List<VacancyDTO> vacancies = vacancyService.getVacanciesByStatus(status);
        return ResponseEntity.ok(vacancies);
    }

    /**
     * Get all vacancies for HR dashboard (includes draft, closed, etc.)
     * @return List of all vacancies
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('HRMANAGER')")
    public ResponseEntity<List<VacancyDTO>> getAllVacanciesForHR() {
        List<VacancyDTO> vacancies = vacancyService.getAllVacancies();
        return ResponseEntity.ok(vacancies);
    }
}
