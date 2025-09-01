package com.sunbeam.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sunbeam.entity.Vacancy;
import com.sunbeam.entity.types.JobStatus;
import com.sunbeam.entity.types.JobType;

/**
 * DAO interface for Vacancy entity
 * Provides data access methods for vacancy management
 */
@Repository
public interface VacancyDao extends JpaRepository<Vacancy, Long> {
	
	// Find vacancies by status
	List<Vacancy> findByStatus(JobStatus status);
	
	// Find vacancies by department
	List<Vacancy> findByDepartmentContaining(String department);
	
	// Find vacancies by location
	List<Vacancy> findByLocationContaining(String location);
	
	// Find vacancies by employment type
	List<Vacancy> findByEmployementType(JobType employmentType);
	
	// Find vacancies by title containing keyword
	List<Vacancy> findByTitleContaining(String title);
	
	// Find active vacancies with deadline after current date
	@Query("SELECT v FROM Vacancy v WHERE v.status = 'ACTIVE' AND v.applicationDeadline > :currentDate ORDER BY v.createdAt DESC")
	List<Vacancy> findActiveVacancies(@Param("currentDate") LocalDate currentDate);
	
	// Find vacancies by salary range
	@Query("SELECT v FROM Vacancy v WHERE v.minSalary >= :minSalary AND v.maxSalary <= :maxSalary")
	List<Vacancy> findBySalaryRange(@Param("minSalary") Long minSalary, @Param("maxSalary") Long maxSalary);
	
	// Search vacancies by multiple criteria
	@Query("SELECT v FROM Vacancy v WHERE " +
		   "(:title IS NULL OR LOWER(v.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
		   "(:department IS NULL OR LOWER(v.department) LIKE LOWER(CONCAT('%', :department, '%'))) AND " +
		   "(:location IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
		   "(:status IS NULL OR v.status = :status)")
	List<Vacancy> searchVacancies(@Param("title") String title, 
								  @Param("department") String department,
								  @Param("location") String location, 
								  @Param("status") JobStatus status);
	
	// Get vacancy statistics
	@Query("SELECT COUNT(v) FROM Vacancy v WHERE v.status = :status")
	long countByStatus(@Param("status") JobStatus status);
}
