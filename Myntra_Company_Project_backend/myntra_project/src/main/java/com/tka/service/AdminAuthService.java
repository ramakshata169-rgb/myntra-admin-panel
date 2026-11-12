
package com.tka.service;

import java.util.Map;

import com.tka.dto.AdminLoginRequest;
import com.tka.dto.AdminResponce;
import com.tka.dto.AdminSetupRequest;

public interface AdminAuthService {

    AdminResponce createFirstAdmin(AdminSetupRequest request);

    AdminResponce login(AdminLoginRequest request);

    AdminResponce registerAdmin(AdminSetupRequest request);

    Map<String, String> forgotPassword(String email);

    Map<String, String> verifyOtp(String email, String otp);

    Map<String, String> resetPassword(
        String email, String otp, String newPassword);
}

