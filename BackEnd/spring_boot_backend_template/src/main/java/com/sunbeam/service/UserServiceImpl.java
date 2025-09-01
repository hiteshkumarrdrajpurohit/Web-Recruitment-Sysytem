package com.sunbeam.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunbeam.custom_exceptions.AuthenticationFailureException;
import com.sunbeam.custom_exceptions.InvalidInputException;
import com.sunbeam.custom_exceptions.ResourceNotFoundException;
import com.sunbeam.dao.UserDao;
import com.sunbeam.dto.ApiResponse;
import com.sunbeam.dto.SignInDTO;
import com.sunbeam.dto.SignUpDTO;
import com.sunbeam.dto.UpdateUserDTO;
import com.sunbeam.dto.UserDTO;
import com.sunbeam.dto.VacancyDTO;
import com.sunbeam.dto.SignInResponseDTO;
import com.sunbeam.entity.User;
import com.sunbeam.entity.types.UserRole;
import com.sunbeam.security.JwtUtil;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserDao userDao;
	
	private final ModelMapper modelMapper;
	
	private final PasswordEncoder passwordEncoder;
	
	private final JwtUtil jwtUtil;

	@Override
	public SignInResponseDTO signInWithToken(SignInDTO dto) {
		// Find user by email
		User user = userDao.findByEmail(dto.getEmail())
				.orElseThrow(() -> new AuthenticationFailureException("Invalid email or password"));
		
		// Check if password matches
		if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
			throw new AuthenticationFailureException("Invalid email or password");
		}
		
		// Create JWT token
		String token = jwtUtil.createTokenForUser(user);
		
		// Create and return SignInResponseDTO
		return new SignInResponseDTO(
			token,
			user.getId(),
			user.getEmail(),
			user.getRole().name(),
			user.getFirstName(),
			user.getLastName()
		);
	}

	@Override
	public UserDTO signUp(SignUpDTO dto) {
		// Check if email already exists
		if(userDao.existsByEmail(dto.getEmail())) {
			throw new InvalidInputException("Email Already Exist");
		}
		
		// Map DTO to entity
		User entity = modelMapper.map(dto, User.class);
		
		// Encode password before saving
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		
		// Save user
		User savedUser = userDao.save(entity);
		
		// Return mapped DTO without password
		return modelMapper.map(savedUser, UserDTO.class);
	}

	@Override
	public ApiResponse updateUser(Long id, UpdateUserDTO dto) {
		//get the user by ID
		User entity =userDao.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid User ID!!!!"));
		entity.setPhoneNumber(dto.getPhoneNumber());
		entity.setAddress(dto.getAddress());
		entity.setCity(dto.getCity());
		entity.setState(dto.getState());
		entity.setZipCode(dto.getZipCode());
		entity.setZipCode(dto.getZipCode());
		entity.setCountry(dto.getCountry());
		entity.setSkills(dto.getSkills());
		entity.setOrgName(dto.getOrgName());
		entity.setStartDate(dto.getStartDate());
		entity.setEndDate(dto.getEndDate());
		entity.setDesignation(dto.getDesignation());
		entity.setSummary(dto.getSummary());
		modelMapper.map(dto, entity);
		
		return new ApiResponse("Updated User details ....");
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userDao.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
		return user;
	}

	@Override
	public UserDTO getUserByEmail(String email) {
		User user = userDao.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
		return modelMapper.map(user, UserDTO.class);
	}

	@Override
	public List<UserDTO> getAllCandidates() {
		List<User> candidates = userDao.findByRole(UserRole.USER);
		return candidates.stream()
				.map(user -> modelMapper.map(user, UserDTO.class))
				.collect(Collectors.toList());
	}

}
