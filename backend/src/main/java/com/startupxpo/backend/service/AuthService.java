package com.startupxpo.backend.service;

import com.startupxpo.backend.model.User;
import com.startupxpo.backend.payload.request.LoginRequest;
import com.startupxpo.backend.payload.request.SignupRequest;
import com.startupxpo.backend.payload.response.LoginResponse;
import com.startupxpo.backend.payload.response.MessageResponse;
import com.startupxpo.backend.repository.UserRepository;
import com.startupxpo.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public ResponseEntity<?> registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    
    public ResponseEntity<?> loginUser(LoginRequest loginRequest) {
        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid email or password!"));
            }
            
            User user = userOptional.get();
            
            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid email or password!"));
            }
            
            // Load user details for JWT generation
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
            
            // Generate JWT token
            String jwtToken = jwtUtil.generateToken(userDetails);
            
            // Create login response
            LoginResponse loginResponse = new LoginResponse(
                jwtToken,
                "Bearer",
                user.getEmail(),
                "Login successful!"
            );
            
            return ResponseEntity.ok(loginResponse);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Login failed!"));
        }
    }
}
