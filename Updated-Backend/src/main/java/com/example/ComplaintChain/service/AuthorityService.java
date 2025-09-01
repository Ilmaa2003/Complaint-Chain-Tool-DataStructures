package com.example.ComplaintChain.service;

import com.example.ComplaintChain.entity.Authority;
import com.example.ComplaintChain.repository.AuthorityRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AuthorityService {

    private final AuthorityRepository authorityRepository;

    public AuthorityService(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }
    public Optional<Authority> login(String email, String password) {
        return authorityRepository.findByEmailAndPassword(email, password);
    }
    public Optional<Authority> getAuthorityByEmail(String email) {
        return authorityRepository.findByEmail(email);
    }


    // Create or update authority
    public Authority saveAuthority(Authority authority) {
        return authorityRepository.save(authority);
    }

    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }

    public Optional<Authority> getAuthorityById(Long id) {
        return authorityRepository.findById(id);
    }

    public void deleteAuthority(Long id) {
        authorityRepository.deleteById(id);
    }

    public boolean emailExists(String email) {
        return authorityRepository.existsByEmail(email);
    }

    public boolean phoneExists(String phone) {
        return authorityRepository.existsByPhone(phone);
    }
}
