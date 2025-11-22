// src/main/java/com/startupxpo/backend/payload/request/SignupRequest.java

package com.startupxpo.backend.payload.request;

import lombok.AllArgsConstructor; // Assuming you use Lombok
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // For getters, setters, etc.
@NoArgsConstructor // For default constructor needed by Jackson
@AllArgsConstructor // For convenience constructor
public class SignupRequest {
    private String username; // Corresponds to "username" in JSON
    private String password;
    private String role;
}