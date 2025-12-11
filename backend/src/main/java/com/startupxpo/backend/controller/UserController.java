package com.startupxpo.backend.controller;


import com.startupxpo.backend.model.User;
import com.startupxpo.backend.payload.request.UserUpdateRequest;
import com.startupxpo.backend.payload.response.MessageResponse;
import com.startupxpo.backend.payload.response.UserResponse;
import com.startupxpo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET /api/users/me - returns details of the currently authenticated user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        // SecurityFilterChain already requires authentication for this endpoint.
        // Keep a tiny defensive check in case security config changes later.
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Unauthorized"));
        }

        String username = principal.getName();
        var optUser = userRepository.findByUsername(username);
        if (optUser.isPresent()) {
            User user = optUser.get();
            return ResponseEntity.ok(toUserResponse(user));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(Principal principal, @RequestBody UserUpdateRequest updateRequest) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Unauthorized"));
        }

        String username = principal.getName();
        var optUser = userRepository.findByUsername(username);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }

        User user = optUser.get();

        // If username is changing, ensure uniqueness
        String newUsername = updateRequest.getUsername();
        if (newUsername != null && !newUsername.trim().isEmpty() && !newUsername.equals(user.getUsername())) {
            if (userRepository.existsByUsername(newUsername)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Username is already taken"));
            }
            user.setUsername(newUsername);
        }

        if (updateRequest.getEmail() != null) {
            user.setEmail(updateRequest.getEmail());
        }
        if (updateRequest.getLocation() != null) {
            user.setLocation(updateRequest.getLocation());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio());
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(toUserResponse(saved));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getEmail(),
                user.getLocation(),
                user.getBio()
        );
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(Principal principal) {
        String username = principal.getName();
        var users = userRepository.findAll();
        var userResponses = users.stream().filter(user->!user.getUsername().equals(username))
                .map(this::toUserResponse)
                .toList();
        return ResponseEntity.ok(userResponses);
    }
}
