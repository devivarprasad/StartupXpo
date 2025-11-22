package com.startupxpo.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "startups")
public class Startup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String startupName;
    private String shortDescription;
    private String category;
    private Double funding;

    // THIS is the link to S3
    private String s3Key;

    // Store original filename for the "Save As" feature later
    private String originalFileName;

    // Getters and Setters...
}
