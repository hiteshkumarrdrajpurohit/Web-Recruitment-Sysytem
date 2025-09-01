package com.sunbeam.dto;

import java.time.LocalDate;

import com.sunbeam.entity.types.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpDTO {

	@NotBlank(message = "Email cannot be empty")
	private String email;
	
	@NotBlank(message = "Password cannot be empty")
	private String password;
	
	@NotBlank(message = "First name cannot be empty")
	private String firstName;
	
	@NotBlank(message = "Last name cannot be empty")
	private String lastName;
	
	@NotBlank(message = "Phone number cannot be empty")
	private String phoneNumber;
	
	@NotNull(message = "User role cannot be null")
	private UserRole role;    // ADMIN, HR_MANAGER, RECRUITER, CANDIDATE
	 
	@NotNull(message = "Date of birth cannot be null")
	private LocalDate dateOfBirth;
   
}
