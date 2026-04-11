package com.sunbeam.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Collection;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;


import com.sunbeam.entity.types.UserRole;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Lob;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="users")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)

public class User  extends BaseEntity implements UserDetails {
       
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;    // ADMIN, HR_MANAGER, RECRUITER, CANDIDATE
    
    @Column
    private String skills;

    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    private String address;

    private  String city;
    
    private String state;

    private String country;
     
    private Long zipCode;

   
    private String orgName;

   
    private String designation;

  
    private LocalDate startDate;
  
   
    private LocalDate endDate;

   
    private String summary;

    @Lob 
    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    private Boolean isActive = true;

   @OneToMany(mappedBy = "user", 
			cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Application> applicationList = new ArrayList<>();

   @OneToOne(mappedBy = "user", 
			cascade = CascadeType.ALL, orphanRemoval = true)
    private HrManager hrManager;


    @Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_" + this.role.name());
		return authorities;
	}
	@Override
	public String getUsername() {
		return this.email;
	}

}