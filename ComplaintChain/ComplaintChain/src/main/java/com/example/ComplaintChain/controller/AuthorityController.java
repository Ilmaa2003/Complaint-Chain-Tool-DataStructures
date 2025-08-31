package com.example.ComplaintChain.controller;

import com.example.ComplaintChain.entity.Authority;
import com.example.ComplaintChain.service.AuthorityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/authority")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorityController {

    private final AuthorityService authorityService;

    public AuthorityController(AuthorityService authorityService) {
        this.authorityService = authorityService;
    }

    // Get all authorities
    @GetMapping
    public List<Authority> getAllAuthorities() {
        return authorityService.getAllAuthorities();
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Authority> getAuthorityById(@PathVariable Long id) {
        return authorityService.getAuthorityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/login")
    public ResponseEntity<Authority> login(@RequestBody Authority loginRequest) {
        return authorityService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build()); // Unauthorized if invalid
    }

    @GetMapping("/findByEmail")
    public ResponseEntity<Authority> getByEmail(@RequestParam String email) {
        return authorityService.getAuthorityByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new authority
    @PostMapping
    public Authority createAuthority(@RequestBody Authority authority) {
        return authorityService.saveAuthority(authority);
    }

    // Update authority
    @PutMapping("/{id}")
    public ResponseEntity<Authority> updateAuthority(@PathVariable Long id, @RequestBody Authority authorityDetails) {
        return authorityService.getAuthorityById(id)
                .map(authority -> {
                    authority.setName(authorityDetails.getName());
                    authority.setEmail(authorityDetails.getEmail());
                    authority.setPhone(authorityDetails.getPhone());
                    authority.setDepartment(authorityDetails.getDepartment());
                    authority.setLevel(authorityDetails.getLevel());
                    authority.setPassword(authorityDetails.getPassword());
                    authorityService.saveAuthority(authority);
                    return ResponseEntity.ok(authority);
                }).orElse(ResponseEntity.notFound().build());
    }

    // Delete authority
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthority(@PathVariable Long id) {
        authorityService.deleteAuthority(id);
        return ResponseEntity.noContent().build();
    }
}
