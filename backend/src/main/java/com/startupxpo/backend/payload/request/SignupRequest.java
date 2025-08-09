// src/main/java/com/startupxpo/backend/payload/request/SignupRequest.java

package com.startupxpo.backend.payload.request;

import lombok.AllArgsConstructor; // Assuming you use Lombok
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // For getters, setters, etc.
@NoArgsConstructor // For default constructor needed by Jackson
@AllArgsConstructor // For convenience constructor
public class SignupRequest {
    private String name;    // Corresponds to "name" in JSON
    private String email;   // Corresponds to "email" in JSON
    private String password;// Corresponds to "password" in JSON
    // private Set<String> roles; // If you expect roles from signup, add here
}