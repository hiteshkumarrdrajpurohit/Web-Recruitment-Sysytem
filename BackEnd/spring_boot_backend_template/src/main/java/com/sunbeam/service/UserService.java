package com.sunbeam.service;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.sunbeam.dto.ApiResponse;
import com.sunbeam.dto.SignInDTO;
import com.sunbeam.dto.SignUpDTO;
import com.sunbeam.dto.UpdateUserDTO;
import com.sunbeam.dto.UserDTO;
//import com.sunbeam.dto.VacancyDTO;
import com.sunbeam.dto.SignInResponseDTO;

public interface UserService extends UserDetailsService {

	//UserDTO signIn(SignInDTO dto);
	SignInResponseDTO signInWithToken(SignInDTO dto);
	UserDTO signUp(SignUpDTO dto);
	ApiResponse updateUser(Long id,UpdateUserDTO dto);
	UserDTO getUserByEmail(String email);
	List<UserDTO> getAllCandidates();
	
}

