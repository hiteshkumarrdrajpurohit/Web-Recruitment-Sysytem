package com.sunbeam.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sunbeam.entity.HrManager;

/**
 * DAO interface for HrManager entity
 * Provides data access methods for HR manager operations
 */
@Repository
public interface HrManagerDao extends JpaRepository<HrManager, Long> {

    // Find HR manager by user ID
    Optional<HrManager> findByUserId(Long userId);
    
    // Find HR managers by department name
    List<HrManager> findByDepartmentNameContaining(String departmentName);
    
    // Check if user is an HR manager
    boolean existsByUserId(Long userId);
    // Find HR manager with user details
    @Query("SELECT h FROM HrManager h JOIN FETCH h.user WHERE h.id = :id")
    Optional<HrManager> findByIdWithUser(@Param("id") Long id);
    
    // Find HR manager by user email
    @Query("SELECT h FROM HrManager h JOIN h.user u WHERE u.email = :email")
    Optional<HrManager> findByUserEmail(@Param("email") String email);
}
