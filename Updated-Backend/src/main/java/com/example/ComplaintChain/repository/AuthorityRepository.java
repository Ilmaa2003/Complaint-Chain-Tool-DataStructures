package com.example.ComplaintChain.repository;

import com.example.ComplaintChain.entity.Authority;
import com.example.ComplaintChain.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<Authority> findByEmail(String email);

    Optional<Authority> findByEmailAndPassword(String email, String password);

}
