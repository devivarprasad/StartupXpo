package com.startupxpo.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StartupSubmissionDTO {
    private String startupName;
    private String shortDescription;
    private String category;
    private Double funding;

    // Frontend will send these after the S3 upload finishes
    private String s3Key;
    private String originalFileName;

    // Getters and Setters
}
