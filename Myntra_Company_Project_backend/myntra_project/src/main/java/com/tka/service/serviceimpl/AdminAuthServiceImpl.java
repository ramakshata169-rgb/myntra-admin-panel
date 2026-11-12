
package com.tka.service.serviceimpl;

import java.security.SecureRandom;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tka.dto.AdminLoginRequest;
import com.tka.dto.AdminResponce;
import com.tka.dto.AdminSetupRequest;
import com.tka.entity.Admin;
import com.tka.repository.AdminRepository;
import com.tka.service.AdminAuthService;

@Service
public class AdminAuthServiceImpl implements AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, ResetOtp> resetOtps =
            new ConcurrentHashMap<>();

    private final SecureRandom secureRandom = new SecureRandom();

    public AdminAuthServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

  
    private static class ResetOtp {
        private final String otp;
        private final long expiresAt;

        private ResetOtp(String otp, long expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    //  Create the Admin  first
    @Override
    public AdminResponce createFirstAdmin(AdminSetupRequest request) {

        if (adminRepository.count() > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Admin setup is already completed");
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (adminRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists");
        }

        Admin admin = new Admin();
        admin.setName(request.getName().trim());
        admin.setEmail(email);
        admin.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));
        admin.setRole("ADMIN");
        admin.setActive(true);

        adminRepository.save(admin);

        return new AdminResponce(
                "Admin created successfully",
                admin.getEmail(),
                admin.getRole());
    }

    //  Admin Login
    @Override
    public AdminResponce login(AdminLoginRequest request) {
    	 String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
    	    String password = request.getPassword();
    	    
//    	  it will help to find admin by email.
    	    Admin admin = adminRepository.findByEmailIgnoreCase(email)
    	            .orElseThrow(() -> new ResponseStatusException(
    	                    HttpStatus.UNAUTHORIZED,
    	                    "Invalid email or password"
    	            ));
    	    
    	    // it will Check whether admin account is active
    	    if (!admin.isActive()) {
    	        throw new ResponseStatusException(
    	                HttpStatus.FORBIDDEN,
    	                "Admin account is inactive"
    	        );
    	    }
    	    boolean passwordMatches = passwordEncoder.matches(
    	            password,
    	            admin.getPasswordHash()
    	    );
    	    if (!passwordMatches) {
    	        throw new ResponseStatusException(
    	                HttpStatus.UNAUTHORIZED,
    	                "Invalid email or password"
    	        );
    	    }

        return new AdminResponce(
                "Admin login successful",
                admin.getEmail(),
                admin.getRole());
    }

    //  Register another Admin
    //  authentication sathi he operation perform karto,
   
    @Override
    public AdminResponce registerAdmin(AdminSetupRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (adminRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists");
        }

        Admin admin = new Admin();
        admin.setName(request.getName().trim());
        admin.setEmail(email);
        admin.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));
        admin.setRole("ADMIN");
        admin.setActive(true);

        adminRepository.save(admin);

        return new AdminResponce(
                "Admin registered successfully",
                admin.getEmail(),
                admin.getRole());
    }

    //  Request for password reset
    @Override
    public Map<String, String> forgotPassword(String emailInput) {

        if (emailInput == null || emailInput.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required");
        }

        String email = emailInput.trim()
                .toLowerCase(Locale.ROOT);

        Admin admin = adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Admin email not found"));

        if (!admin.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin account is inactive");
        }

        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000));

        long expiresAt = System.currentTimeMillis()
                + (5 * 60 * 1000L);

        resetOtps.put(email, new ResetOtp(otp, expiresAt));

        // OTP  will also appears in the backend console.
   
        System.out.println(
                "Development password-reset OTP: " + otp);

        return Map.of(
                "message",
                "OTP generated successfully",
                "demoOtp", otp);              
                
    }

    //   it will help to Verify OTP
    @Override
    public Map<String, String> verifyOtp(
            String emailInput,
            String otp) {

        if (emailInput == null || emailInput.isBlank()
                || otp == null || otp.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email and OTP are required");
        }

        String email = emailInput.trim()
                .toLowerCase(Locale.ROOT);

        ResetOtp saved = resetOtps.get(email);

        if (saved == null
                || System.currentTimeMillis() > saved.expiresAt
                || !saved.otp.equals(otp)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired OTP");
        }

        return Map.of(
                "message",
                "OTP verified successfully");
    }

    // this is used for Reset password
    @Override
    public Map<String, String> resetPassword(
            String emailInput,
            String otp,
            String newPassword) {

        if (emailInput == null || emailInput.isBlank()
                || otp == null || otp.isBlank()
                || newPassword == null
                || newPassword.length() < 8
                || newPassword.length() > 72) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email and OTP are required. Password must be 8 to 72 characters.");
        }

        String email = emailInput.trim()
                .toLowerCase(Locale.ROOT);

        ResetOtp saved = resetOtps.get(email);

        if (saved == null
                || System.currentTimeMillis() > saved.expiresAt
                || !saved.otp.equals(otp)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired OTP");
        }

        Admin admin = adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Admin not found"));

        if (!admin.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin account is inactive");
        }

        admin.setPasswordHash(
                passwordEncoder.encode(newPassword));

        adminRepository.save(admin);

        // OTP can no longer be reused
        resetOtps.remove(email, saved);

        return Map.of(
                "message",
                "Password reset successfully");
    }
}

