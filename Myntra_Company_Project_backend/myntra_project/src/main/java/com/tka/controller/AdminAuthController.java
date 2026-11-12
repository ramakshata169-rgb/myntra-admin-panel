
package com.tka.controller;

import com.tka.dto.AdminLoginRequest;
import com.tka.dto.AdminResponce;
import com.tka.dto.AdminSetupRequest;
import com.tka.service.AdminAuthService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin") //using this in every url
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/setup")//setup for the sign in 
    public ResponseEntity<AdminResponce> createAdmin(
            @Valid @RequestBody AdminSetupRequest request) {
        return ResponseEntity.ok(
            adminAuthService.createFirstAdmin(request));
    }

    @PostMapping("/login")//use to do login directly
    public ResponseEntity<AdminResponce> login(
            @Valid @RequestBody AdminLoginRequest request,
            HttpSession session) {

        AdminResponce response = adminAuthService.login(request);

        session.setAttribute("adminEmail", response.getEmail());
        session.setAttribute("adminRole", response.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register") //api for register
    public ResponseEntity<AdminResponce> register(
            @Valid @RequestBody AdminSetupRequest request,
            HttpSession session) {

        requireAdmin(session);

        return ResponseEntity.ok(
            adminAuthService.registerAdmin(request));
    }

    @GetMapping("/dashboard")//it will let u on the dashboard page
    public ResponseEntity<?> dashboard(HttpSession session) {
        requireAdmin(session);

        return ResponseEntity.ok(Map.of(
            "message", "Welcome to Myntra Admin Dashboard",
            "email", session.getAttribute("adminEmail"),
            "role", session.getAttribute("adminRole")
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        return ResponseEntity.ok(
            adminAuthService.forgotPassword(request.get("email")));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request) {

        return ResponseEntity.ok(
            adminAuthService.verifyOtp(
                request.get("email"), request.get("otp")));
    }

    @PostMapping("/reset-password")//it will help to reset the password
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        return ResponseEntity.ok(
            adminAuthService.resetPassword(
                request.get("email"),
                request.get("otp"),
                request.get("newPassword")));
    }

    private void requireAdmin(HttpSession session) {
        if (session.getAttribute("adminEmail") == null
                || !"ADMIN".equals(session.getAttribute("adminRole"))) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED,
                "Please login as admin");
        }
    }
}

