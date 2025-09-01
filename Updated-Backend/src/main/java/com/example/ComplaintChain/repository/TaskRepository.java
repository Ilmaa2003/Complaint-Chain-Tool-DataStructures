package com.example.ComplaintChain.repository;

import com.example.ComplaintChain.entity.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAuthorityId(Long authorityId);  // fetch tasks by authority
    List<Task> findByComplaintId(Long complaintId);  // fetch tasks by complaint
    @Transactional
    @Modifying
    void deleteByComplaintId(Long complaintId);
 }
