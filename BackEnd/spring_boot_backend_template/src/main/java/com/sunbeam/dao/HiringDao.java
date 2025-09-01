package com.sunbeam.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sunbeam.entity.Hirings;
import com.sunbeam.entity.types.Decision;

/**
 * DAO interface for Hirings entity
 * Provides data access methods for hiring decisions
 */
@Repository
public interface HiringDao extends JpaRepository<Hirings, Long> {

    // Find all hirings with details (eager loading)
    @Query("SELECT h FROM Hirings h JOIN FETCH h.application a JOIN FETCH a.user JOIN FETCH h.vacancy JOIN FETCH h.hrManager hr JOIN FETCH hr.user")
    List<Hirings> findAllWithDetails();

    // Find hirings by application ID
    List<Hirings> findByApplicationId(Long applicationId);
    
    // Find the latest hiring by application ID
    Optional<Hirings> findTopByApplicationIdOrderByCreatedAtDesc(Long applicationId);
    
    // Find hirings by application ID with details
    @Query("SELECT h FROM Hirings h JOIN FETCH h.application a JOIN FETCH a.user JOIN FETCH h.vacancy JOIN FETCH h.hrManager hr JOIN FETCH hr.user WHERE a.id = :applicationId")
    List<Hirings> findByApplicationIdWithDetails(@Param("applicationId") Long applicationId);
    
    // Find hirings by vacancy ID
    List<Hirings> findByVacancyId(Long vacancyId);
    
    // Find hirings by vacancy ID with details
    @Query("SELECT h FROM Hirings h JOIN FETCH h.application a JOIN FETCH a.user JOIN FETCH h.vacancy v JOIN FETCH h.hrManager hr JOIN FETCH hr.user WHERE v.id = :vacancyId")
    List<Hirings> findByVacancyIdWithDetails(@Param("vacancyId") Long vacancyId);
    
    // Find hirings by decision
    List<Hirings> findByDecision(Decision decision);
    
    // Find hirings by decision with details
    @Query("SELECT h FROM Hirings h JOIN FETCH h.application a JOIN FETCH a.user JOIN FETCH h.vacancy JOIN FETCH h.hrManager hr JOIN FETCH hr.user WHERE h.decision = :decision")
    List<Hirings> findByDecisionWithDetails(@Param("decision") Decision decision);
    
    // Find hirings by HR manager ID
    List<Hirings> findByHrManagerId(Long hrManagerId);
    
    // Find hirings by interviewer name
    List<Hirings> findByInterviewerNameContaining(String interviewerName);
    
    // Get hiring statistics
    @Query("SELECT COUNT(h) FROM Hirings h WHERE h.decision = :decision")
    long countByDecision(@Param("decision") Decision decision);
    
    // Get total hirings count
    @Query("SELECT COUNT(h) FROM Hirings h")
    long getTotalHiringsCount();
}
