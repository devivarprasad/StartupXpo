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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    
    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity<?> registerUser(SignupRequest signupRequest) {
        try {
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
            }
            
            User user = new User();
            user.setEmail(signupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Registration failed! " + e.getMessage()));
        }
    }
    
    public ResponseEntity<?> loginUser(LoginRequest loginRequest) {
        try {
            // Use Spring Security's AuthenticationManager for proper authentication
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );
            
            // If we reach here, authentication was successful
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Generate JWT token
            String jwtToken = jwtUtil.generateToken(userDetails);
            
            // Create login response
            LoginResponse loginResponse = new LoginResponse(
                jwtToken,
                "Bearer",
                userDetails.getUsername(),
                "Login successful!"
            );
            
            return ResponseEntity.ok(loginResponse);
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid email or password!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Login failed! " + e.getMessage()));
        }
    }
}
