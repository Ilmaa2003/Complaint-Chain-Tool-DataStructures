package com.example.ComplaintChain.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(nullable = false)
    private Long complaintId;

    @Column(nullable = false)
    private Long authorityId;

    @Column(nullable = false)
    private LocalDate deadline;

    public Task() {}

    public Task(Long complaintId, Long authorityId, LocalDate deadline) {
        this.complaintId = complaintId;
        this.authorityId = authorityId;
        this.deadline = deadline;
    }

    // Getters and Setters
    public Long getTaskId() { return taskId; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public Long getAuthorityId() { return authorityId; }
    public void setAuthorityId(Long authorityId) { this.authorityId = authorityId; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
}
