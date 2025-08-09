package com.startupxpo.backend.controller;


import com.startupxpo.backend.payload.request.LoginRequest;
import com.startupxpo.backend.payload.request.SignupRequest;
import com.startupxpo.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthService authService;

    // Signup endpoint: POST /api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest)
    {
        logger.info("Received signup request for email: {}", signupRequest.getEmail());
        return authService.registerUser(signupRequest);
    }

    // Login endpoint: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Received login request for email: {}", loginRequest.getEmail());
        return authService.loginUser(loginRequest);
    }
}
