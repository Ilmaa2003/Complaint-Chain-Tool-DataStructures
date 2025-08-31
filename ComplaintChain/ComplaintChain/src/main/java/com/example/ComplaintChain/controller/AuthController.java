package com.example.ComplaintChain.controller;

import com.example.ComplaintChain.entity.Citizen;
import com.example.ComplaintChain.service.CitizenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")  // allow React app
public class AuthController {

    private final CitizenService citizenService;

    public AuthController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    // Existing registration endpoint
    @PostMapping("/register")
    public Citizen register(@RequestBody Citizen citizen) {
        return citizenService.registerCitizen(citizen);
    }

    // AuthController.java
    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = citizenService.emailExists(email);
        return Collections.singletonMap("exists", exists);
    }

    @GetMapping("/check-nic")
    public Map<String, Boolean> checkNic(@RequestParam String nic) {
        boolean exists = citizenService.nicExists(nic);
        return Collections.singletonMap("exists", exists);
    }

    @GetMapping("/check-phone")
    public Map<String, Boolean> checkPhone(@RequestParam String phone) {
        boolean exists = citizenService.phoneExists(phone);
        return Collections.singletonMap("exists", exists);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return citizenService.login(email, password)
                .map(citizen -> {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("message", "Login successful");
                    resp.put("firstName", citizen.getFirstName());
                    resp.put("lastName", citizen.getLastName());
                    resp.put("email", citizen.getEmail());  // <-- add this
                    resp.put("nic", citizen.getNic());
                    resp.put("phone", citizen.getPhone());
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> ResponseEntity.status(401)
                        .body(Collections.singletonMap("message", "Invalid email or password")));
    }

    @GetMapping("/citizen")
    public ResponseEntity<?> getCitizenByEmail(@RequestParam String email) {
        Optional<Citizen> citizenOpt = citizenService.getCitizenByEmail(email);

        if (citizenOpt.isPresent()) {
            return ResponseEntity.ok(citizenOpt.get());
        } else {
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Citizen not found");
            return ResponseEntity.status(404).body(resp);
        }
    }

    @GetMapping("/all-citizens")
    public ResponseEntity<List<Citizen>> getAllCitizens() {
        List<Citizen> citizens = citizenService.getAllCitizens();
        return ResponseEntity.ok(citizens);
    }


}
