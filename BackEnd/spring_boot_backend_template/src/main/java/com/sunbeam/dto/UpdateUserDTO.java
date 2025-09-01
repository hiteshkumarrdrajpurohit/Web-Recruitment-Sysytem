package com.sunbeam.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
	
	private String phoneNumber;
   
    private String skills;
    
    private String address;

	private  String city;
	    
	private String state;

	private Long zipCode;
	
	private String country;

    private String orgName;

	private String designation;
	
    private LocalDate startDate;
	  	   
    private LocalDate endDate;
   
    private String summary;

	}

