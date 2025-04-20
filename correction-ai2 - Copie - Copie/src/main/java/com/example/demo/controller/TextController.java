package com.example.demo.controller;

import java.io.File;
import java.nio.file.Files;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.TextService;

@RestController
@RequestMapping("/api/text")
@CrossOrigin(origins = "http://localhost:3000")
public class TextController {

    @Autowired
    private TextService textService;

    @PostMapping("/correct")
public String correctText(@RequestBody Map<String, String> request) {
    return textService.correctText(
        request.get("text"),
        request.get("lang") // Ajout du paramètre de langue
    );
}

@PostMapping("/rewrite")
public String rewriteText(@RequestBody Map<String, String> request) {
    return textService.rewriteText(
        request.get("text"), 
        request.get("lang"),
        request.get("style")
    );
}

    @PostMapping("/translate")
    public String translateText(@RequestBody Map<String, String> request) {
        return textService.translateText(
            request.get("text"),
            request.get("sourceLang"),
            request.get("targetLang")
        );
    }

    @PostMapping("/correct-docx")
    public ResponseEntity<byte[]> correctDocx(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "lang", required = false, defaultValue = "fr") String lang) {
        
        try {
            String correctedFilePath = textService.correctDocx(file, lang);
            File correctedFile = new File(correctedFilePath);
            byte[] fileContent = Files.readAllBytes(correctedFile.toPath());
            
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=corrected_" + file.getOriginalFilename());
            
            // Détermine le type MIME en fonction de l'extension
            String contentType = file.getContentType();
            if (contentType == null) {
                if (file.getOriginalFilename().toLowerCase().endsWith(".docx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                } else if (file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else {
                    contentType = "application/octet-stream";
                }
            }
            headers.add(HttpHeaders.CONTENT_TYPE, contentType);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(("Erreur lors de la correction: " + e.getMessage()).getBytes());
        }
    }

    
}
