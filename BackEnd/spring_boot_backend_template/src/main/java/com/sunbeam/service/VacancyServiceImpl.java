package com.sunbeam.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunbeam.custom_exceptions.ResourceNotFoundException;
import com.sunbeam.dao.VacancyDao;
import com.sunbeam.dao.HrManagerDao;
import com.sunbeam.dao.UserDao;
import com.sunbeam.dto.ApiResponse;
import com.sunbeam.dto.VacancyDTO;
import com.sunbeam.entity.Vacancy;
import com.sunbeam.entity.HrManager;
import com.sunbeam.entity.User;
import com.sunbeam.entity.types.JobStatus;

import lombok.AllArgsConstructor;

/**
 * Service implementation for Vacancy operations
 */
@Service
@Transactional
@AllArgsConstructor	
public class VacancyServiceImpl implements VacancyService {
	
	private final VacancyDao vacancyDao;
	private final HrManagerDao hrManagerDao;
	private final UserDao userDao;
	private final ModelMapper modelMapper;

	@Override
	public List<VacancyDTO> getAllActiveVacancies() {
		List<Vacancy> activeVacancies = vacancyDao.findActiveVacancies(LocalDate.now());
		return activeVacancies.stream()
			.map(vacancy -> modelMapper.map(vacancy, VacancyDTO.class))
			.collect(Collectors.toList());
	}

	@Override
	public List<VacancyDTO> getAllVacancies() {
		List<Vacancy> vacancies = vacancyDao.findAll();
		return vacancies.stream()
			.map(vacancy -> modelMapper.map(vacancy, VacancyDTO.class))
			.collect(Collectors.toList());
	}

	@Override
	public VacancyDTO getVacancyById(Long id) {
		Vacancy vacancy = vacancyDao.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Vacancy not found with ID: " + id));
		
		return modelMapper.map(vacancy, VacancyDTO.class);
	}

	@Override
	public VacancyDTO createVacancy(VacancyDTO vacancyDTO) {
		Vacancy vacancy = modelMapper.map(vacancyDTO, Vacancy.class);
		
		// Set default status if not provided
		if (vacancy.getStatus() == null) {
			vacancy.setStatus(JobStatus.DRAFT);
		}
		
		// Set HR manager if hrManagerId is provided
		if (vacancyDTO.getHrManagerId() != null) {
			HrManager hrManager = hrManagerDao.findById(vacancyDTO.getHrManagerId())
				.orElseThrow(() -> new ResourceNotFoundException("HR Manager not found with ID: " + vacancyDTO.getHrManagerId()));
			vacancy.setHrManager(hrManager);
		}
		
		Vacancy savedVacancy = vacancyDao.save(vacancy);
		return modelMapper.map(savedVacancy, VacancyDTO.class);
	}

	@Override
	public VacancyDTO createVacancy(VacancyDTO vacancyDTO, String hrEmail) {
		Vacancy vacancy = modelMapper.map(vacancyDTO, Vacancy.class);
		// Set default status if not provided
		if (vacancy.getStatus() == null) {
			vacancy.setStatus(JobStatus.DRAFT);
		}
		// Find or create HR manager by email
		HrManager hrManager = hrManagerDao.findByUserEmail(hrEmail)
			.orElseGet(() -> {
				// If HR manager doesn't exist, create one
				User user = userDao.findByEmail(hrEmail)
					.orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + hrEmail));
				HrManager newHrManager = new HrManager();
				newHrManager.setUser(user);
				newHrManager.setDepartmentName("Human Resources");
				return hrManagerDao.save(newHrManager);
			});
		vacancy.setHrManager(hrManager);
		
		Vacancy savedVacancy = vacancyDao.save(vacancy);
		return modelMapper.map(savedVacancy, VacancyDTO.class);
	}
	@Override
	public VacancyDTO updateVacancy(Long id, VacancyDTO vacancyDTO) {
		Vacancy existingVacancy = vacancyDao.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Vacancy not found with ID: " + id));
		
		// Update fields
		existingVacancy.setTitle(vacancyDTO.getTitle());
		existingVacancy.setDescription(vacancyDTO.getDescription());
		existingVacancy.setDepartment(vacancyDTO.getDepartment());
		existingVacancy.setLocation(vacancyDTO.getLocation());
		existingVacancy.setEmployementType(vacancyDTO.getEmployementType());
		existingVacancy.setMinSalary(vacancyDTO.getMinSalary());
		existingVacancy.setMaxSalary(vacancyDTO.getMaxSalary());
		existingVacancy.setReponsibilites(vacancyDTO.getReponsibilites());
		existingVacancy.setStatus(vacancyDTO.getStatus());
		existingVacancy.setApplicationDeadline(vacancyDTO.getApplicationDeadline());
		existingVacancy.setRequiredEducation(vacancyDTO.getRequiredEducation());
		existingVacancy.setRequiredExperience(vacancyDTO.getRequiredExperience());
		existingVacancy.setNumberOfVacencies(vacancyDTO.getNumberOfVacencies());
		existingVacancy.setShiftDetails(vacancyDTO.getShiftDetails());
		
		Vacancy updatedVacancy = vacancyDao.save(existingVacancy);
		return modelMapper.map(updatedVacancy, VacancyDTO.class);
	}

	@Override
	public ApiResponse deleteVacancy(Long id) {
		if (!vacancyDao.existsById(id)) {
			throw new ResourceNotFoundException("Vacancy not found with ID: " + id);
		}
		vacancyDao.deleteById(id);
		return new ApiResponse("Vacancy deleted successfully");
	}

	@Override
	public List<VacancyDTO> getVacanciesByStatus(JobStatus status) {
		List<Vacancy> vacancies = vacancyDao.findByStatus(status);
		return vacancies.stream()
			.map(vacancy -> modelMapper.map(vacancy, VacancyDTO.class))
			.collect(Collectors.toList());
	}

	@Override
	public List<VacancyDTO> searchVacancies(String title, String department, String location) {
		List<Vacancy> vacancies = vacancyDao.searchVacancies(title, department, location, JobStatus.ACTIVE);
		return vacancies.stream()
			.map(vacancy -> modelMapper.map(vacancy, VacancyDTO.class))
			.collect(Collectors.toList());
	}
}