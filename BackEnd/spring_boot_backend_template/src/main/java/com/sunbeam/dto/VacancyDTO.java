package com.sunbeam.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.sunbeam.entity.types.JobStatus;
import com.sunbeam.entity.types.JobType;

@Getter
@Setter
public class VacancyDTO {
	private Long id; // Primary key - required for edit/delete operations
	
	private String title;
	
    private String description;
    
    private String department;
    
    private String location;
    
    private JobType employementType;
    
    private Long minSalary;
    
    private Long maxSalary;
    
    private String jobDescription;
    
    private String reponsibilites; // Note: matches entity spelling
    
    private JobStatus status;
    
    private LocalDate applicationDeadline; // Note: matches entity field name
    
    private String requiredEducation;
    
    private String requiredExperience;
    
    private Long numberOfVacencies; // Note: matches entity spelling
    
    private String shiftDetails;
    
    private Long hrManagerId; // Reference to HR manager
    // Audit fields from BaseEntity
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
