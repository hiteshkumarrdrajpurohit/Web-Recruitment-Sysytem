package com.sunbeam.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sunbeam.entity.Interview;
import com.sunbeam.entity.types.InterviewStatus;

/**
 * DAO interface for Interview entity
 * Provides data access methods for interview management
 */
@Repository
public interface InterviewDao extends JpaRepository<Interview, Long> {

    // Find all interviews with application, user, and vacancy details
    @Query("SELECT i FROM Interview i JOIN FETCH i.application a JOIN FETCH a.user JOIN FETCH a.vacancy")
    List<Interview> findAllWithDetails();
    
    // Find interviews by application ID
    List<Interview> findByApplicationId(Long applicationId);
    
    // Find interviews by application ID with details
    @Query("SELECT i FROM Interview i JOIN FETCH i.application a JOIN FETCH a.user JOIN FETCH a.vacancy WHERE a.id = :applicationId")
    List<Interview> findByApplicationIdWithDetails(@Param("applicationId") Long applicationId);
    
    // Find interviews by HR manager ID
    List<Interview> findByHrManagerId(Long hrManagerId);
    
    // Find interviews by status
    List<Interview> findByStatus(InterviewStatus status);
    
    // Find interviews by status with details
    @Query("SELECT i FROM Interview i JOIN FETCH i.application a JOIN FETCH a.user JOIN FETCH a.vacancy WHERE i.status = :status")
    List<Interview> findByStatusWithDetails(@Param("status") InterviewStatus status);
    
    // Find interviews scheduled for a specific date range
    List<Interview> findByScheduledDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find upcoming interviews (status = SCHEDULED and future date)
    @Query("SELECT i FROM Interview i WHERE i.status = 'SCHEDULED' AND i.scheduledDateTime > :currentDateTime ORDER BY i.scheduledDateTime")
    List<Interview> findUpcomingInterviews(@Param("currentDateTime") LocalDateTime currentDateTime);
    
    // Find interviews by interviewer name
    List<Interview> findByInterviewerNameContaining(String interviewerName);
    
    // Get interview statistics
    @Query("SELECT COUNT(i) FROM Interview i WHERE i.status = :status")
    long countByStatus(@Param("status") InterviewStatus status);
    
    // Find interview with application and user details
    @Query("SELECT i FROM Interview i JOIN FETCH i.application JOIN FETCH i.application.user WHERE i.id = :id")
    Optional<Interview> findByIdWithDetails(@Param("id") Long id);
}
