package com.tka.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tka.entity.Admin;

public interface AdminRepository extends MongoRepository<Admin, String>{
	

	 Optional<Admin> findByEmailIgnoreCase(String email);
}
