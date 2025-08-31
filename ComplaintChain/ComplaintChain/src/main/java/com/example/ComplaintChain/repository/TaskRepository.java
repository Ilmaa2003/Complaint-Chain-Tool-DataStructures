package com.example.ComplaintChain.repository;

import com.example.ComplaintChain.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAuthorityId(Long authorityId);
}
