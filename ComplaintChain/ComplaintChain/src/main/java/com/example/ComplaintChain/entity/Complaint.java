package com.example.ComplaintChain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nationalId;
    private String contact;
    private String email;
    private String address;
    private String description;
    private String department;
    private String urgency; // High / Low
    private LocalDateTime submittedAt;
    private String status; // Pending / InProgress / Resolved

    public Complaint() {}

    public Complaint(String name, String nationalId, String contact, String email,
                     String address, String description, String department,
                     String urgency, LocalDateTime submittedAt, String status) {
        this.name = name;
        this.nationalId = nationalId;
        this.contact = contact;
        this.email = email;
        this.address = address;
        this.description = description;
        this.department = department;
        this.urgency = urgency;
        this.submittedAt = submittedAt;
        this.status = status;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
