package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import java.io.*;

@Service
public class TextService {

    public String correctText(String text, String lang) {
        return runPythonScript("correct.py", text, lang);
    }

    public String rewriteText(String text, String lang, String style) {
        Process process = null;
        BufferedReader reader = null;
        
        try {
            Path pythonScript = Paths.get("rewrite.py").toAbsolutePath();
            
            process = new ProcessBuilder(
                    "python",
                    pythonScript.toString(),
                    text,
                    lang,
                    style
                )
                .redirectErrorStream(true)
                .start();
    
            reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
    
            if (!process.waitFor(30, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                return "Timeout du script Python";
            }
    
            return output.toString().trim();
            
        } catch (Exception e) {
            return "Erreur système: " + e.getMessage();
        } finally {
            try {
                if (reader != null) reader.close();
            } catch (IOException e) {
                System.err.println("Warning: échec de fermeture du reader");
            }
            if (process != null && process.isAlive()) {
                process.destroy();
            }
        }
    }

    public String translateText(String text, String sourceLang, String targetLang) {
        return runPythonScript("translate.py", text, sourceLang, targetLang);
    }

    public String correctDocx(MultipartFile file, String lang) throws Exception {
        // Créer un répertoire temporaire dédié
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"), "correction_ai");
        Files.createDirectories(tempDir);
        
        Path tempFile = tempDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            file.transferTo(tempFile);
            
            // Chemin absolu du script Python
            Path pythonScript = Paths.get("correct_docx.py").toAbsolutePath();
            
            // Exécution avec timeout
            Process process = new ProcessBuilder(
                    "python",
                    pythonScript.toString(),
                    tempFile.toString(),
                    lang
                )
                .redirectErrorStream(true)
                .start();
    
            // Lecture de la sortie
            String output;
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                
                if (!process.waitFor(30, TimeUnit.SECONDS)) {
                    process.destroy();
                    throw new RuntimeException("Timeout du script Python");
                }
                
                output = reader.lines().collect(Collectors.joining("\n"));
            }
    
            if (process.exitValue() != 0) {
                throw new RuntimeException("Erreur Python: " + output);
            }
    
            Path correctedFile = Paths.get(output.trim());
            if (!Files.exists(correctedFile)) {
                throw new RuntimeException("Fichier corrigé introuvable: " + correctedFile);
            }
    
            return correctedFile.toString();
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }
    
    

    private String runPythonScript(String scriptName, String... args) {
        try {
            List<String> command = new ArrayList<>();
            command.add("python");
            command.add(scriptName);
            command.addAll(Arrays.asList(args));

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return output.toString().trim();
            } else {
                return "Error executing script";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error running Python script: " + e.getMessage();
        }
    }
}

