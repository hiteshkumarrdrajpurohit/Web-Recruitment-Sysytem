package com.sunbeam.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sunbeam.entity.User;
import com.sunbeam.entity.Vacancy;
import com.sunbeam.entity.types.UserRole;

@Repository
public interface UserDao extends JpaRepository<User, Long> {

	// sign in
	Optional<User> findByEmail(String em);

	//for signUp etc... check 
	boolean existsByEmail(String em);

	Optional<User> findByEmailAndPassword(String email, String password);
	
	// Find users by role
	List<User> findByRole(UserRole role);
	
}
