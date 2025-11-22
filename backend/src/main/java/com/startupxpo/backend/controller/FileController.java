package com.startupxpo.backend.controller;


import com.startupxpo.backend.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    // Endpoint 1: Get Upload URL
    // POST /api/files/presigned-upload
    // Body: { "fileName": "pitch_deck.pdf", "contentType": "application/pdf" }
    @PostMapping("/presigned-upload")
    public ResponseEntity<Map<String, String>> getUploadUrl(@RequestBody Map<String, String> payload) {
        String fileName = payload.get("fileName");
        String contentType = payload.get("contentType");

        return ResponseEntity.ok(storageService.generateUploadUrl(fileName, contentType));
    }

    // Endpoint 2: Get Download URL
    // GET /api/files/presigned-download?key=ideas/123-deck.pdf&fileName=MyPitch.pdf
    @GetMapping("/presigned-download")
    public ResponseEntity<Map<String, String>> getDownloadUrl(
            @RequestParam String key,
            @RequestParam String fileName) {

        String url = storageService.generateDownloadUrl(key, fileName);
        return ResponseEntity.ok(Map.of("downloadUrl", url));
    }
}
