package com.example.ComplaintChain.repository;

import com.example.ComplaintChain.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen, Long> {

    // Returns true if a citizen with the given email exists
    boolean existsByEmail(String email);

    // Returns true if a citizen with the given NIC exists
    boolean existsByNic(String nic);

    boolean existsByPhone(String phone);

    Optional<Citizen> findByEmailAndPassword(String email, String password);
    Optional<Citizen> findByEmail(String email);

}
