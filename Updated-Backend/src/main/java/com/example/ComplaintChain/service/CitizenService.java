package com.example.ComplaintChain.service;

import com.example.ComplaintChain.entity.Citizen;
import com.example.ComplaintChain.repository.CitizenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitizenService {

    private final CitizenRepository citizenRepository;

    public CitizenService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    // Register new citizen
    public Citizen registerCitizen(Citizen citizen) {
        // Optionally: hash password here
        return citizenRepository.save(citizen);
    }

    public boolean emailExists(String email) {
        return citizenRepository.existsByEmail(email);
    }

    public boolean nicExists(String nic) {
        return citizenRepository.existsByNic(nic);
    }

    public boolean phoneExists(String phone) {
        return citizenRepository.existsByPhone(phone);
    }

    public Optional<Citizen> login(String email, String password) {
        return citizenRepository.findByEmailAndPassword(email, password);
    }
    public Optional<Citizen> getCitizenByEmail(String email) {
        return citizenRepository.findByEmail(email);
    }

    public List<Citizen> getAllCitizens() {
        return citizenRepository.findAll();
    }

}
