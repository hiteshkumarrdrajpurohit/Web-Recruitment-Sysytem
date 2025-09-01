package com.sunbeam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SignInDTO {

	@NotBlank(message = "Email cannot be empty")
	private String email;
	
	@NotBlank(message = "Password cannot be empty")
	private String password;
	
}
