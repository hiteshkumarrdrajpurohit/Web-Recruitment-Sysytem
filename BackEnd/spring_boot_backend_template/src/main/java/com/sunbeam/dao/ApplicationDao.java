package com.sunbeam.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sunbeam.entity.Application;
import com.sunbeam.entity.types.ApplicationStatus;

/**
 * DAO interface for Application entity
 * Provides data access methods for application management
 */
@Repository
public interface ApplicationDao extends JpaRepository<Application, Long> {

    // Find applications by user ID with user and vacancy details
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.vacancy WHERE a.user.id = :userId")
    List<Application> findByUserIdWithDetails(@Param("userId") Long userId);
    
    // Find applications by user ID
    List<Application> findByUserId(Long userId);
    
    // Find applications by vacancy ID with user and vacancy details  
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.vacancy WHERE a.vacancy.id = :vacancyId")
    List<Application> findByVacancyIdWithDetails(@Param("vacancyId") Long vacancyId);
    
    // Find applications by vacancy ID
    List<Application> findByVacancyId(Long vacancyId);
    
    // Find applications by status with user and vacancy details
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.vacancy WHERE a.status = :status")
    List<Application> findByStatusWithDetails(@Param("status") ApplicationStatus status);
    
    // Find applications by status
    List<Application> findByStatus(ApplicationStatus status);
    
    // Find all applications with user and vacancy details
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.vacancy")
    List<Application> findAllWithDetails();
    
    // Find applications by user ID and status
    List<Application> findByUserIdAndStatus(Long userId, ApplicationStatus status);
    
    // Find applications by vacancy ID and status
    List<Application> findByVacancyIdAndStatus(Long vacancyId, ApplicationStatus status);
    
    // Check if user has already applied for a vacancy
    boolean existsByUserIdAndVacancyId(Long userId, Long vacancyId);
    
    // Get application statistics
    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status")
    long countByStatus(@Param("status") ApplicationStatus status);
    
    // Get total applications count
    @Query("SELECT COUNT(a) FROM Application a")
    long getTotalApplicationsCount();
    
    // Find application with user and vacancy details
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.vacancy WHERE a.id = :id")
    Optional<Application> findByIdWithDetails(@Param("id") Long id);
}
