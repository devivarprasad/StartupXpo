package com.startupxpo.backend.controller;

import com.startupxpo.backend.DTO.StartupSubmissionDTO;
import com.startupxpo.backend.model.Startup;
import com.startupxpo.backend.repository.StartupRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/startups")
public class StartupController {

    private final StartupRepository startupRepository;

    public StartupController(StartupRepository startupRepository) {
        this.startupRepository = startupRepository;
    }

    @PostMapping("/submit-idea")
    public ResponseEntity<Startup> submitStartup(@RequestBody StartupSubmissionDTO dto) {

        // Map DTO to Entity
        Startup startup = new Startup();
        startup.setStartupName(dto.getStartupName());
        startup.setShortDescription(dto.getShortDescription());
        startup.setCategory(dto.getCategory());
        startup.setFunding(dto.getFunding());

        // LINKING THE FILE
        startup.setS3Key(dto.getS3Key());
        startup.setOriginalFileName(dto.getOriginalFileName());

        // Save to DB
        Startup savedStartup = startupRepository.save(startup);

        return ResponseEntity.ok(savedStartup);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Startup>> getAllStartups() {
        List<Startup> startups = startupRepository.findAll();
        return ResponseEntity.ok(startups);
    }

}
