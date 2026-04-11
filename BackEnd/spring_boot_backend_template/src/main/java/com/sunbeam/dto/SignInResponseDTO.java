package com.sunbeam.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponseDTO {
    private String token;
    private Long userId;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String profilePicture;
}
