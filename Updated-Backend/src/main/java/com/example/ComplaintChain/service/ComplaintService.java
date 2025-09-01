package com.example.ComplaintChain.service;

import com.example.ComplaintChain.entity.Authority;
import com.example.ComplaintChain.entity.Complaint;
import com.example.ComplaintChain.entity.CancelledComplaint;
import com.example.ComplaintChain.repository.AuthorityRepository;
import com.example.ComplaintChain.repository.ComplaintRepository;
import com.example.ComplaintChain.repository.CancelledComplaintRepository;
import com.example.ComplaintChain.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Comparator;
import java.util.Objects;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private CancelledComplaintRepository cancelledComplaintRepository;

    // ----------------- Complaint Actions -----------------
    public Complaint submitComplaint(Complaint c) {
        c.setStatus("Pending"); // Default status
        return complaintRepository.save(c);
    }
    @Autowired private TaskRepository taskRepo;

    public List<Complaint> getComplaintsByAuthority(Long authorityId) {
        return taskRepo.findByAuthorityId(authorityId).stream()
                .map(task -> complaintRepository.findById(task.getComplaintId()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }
    public Complaint startProcessing(Long id) {
        Complaint c = complaintRepository.findById(id).orElse(null);
        if (c != null) {
            c.setStatus("In Progress"); // Match DB
            complaintRepository.save(c);
        }
        return c;
    }

    public Complaint markResolved(Long id) {
        Complaint c = complaintRepository.findById(id).orElse(null);
        if (c != null) {
            c.setStatus("Resolved");
            complaintRepository.save(c);
        }
        return c;
    }

    public void cancelComplaint(Long id, String reason) {
        Complaint c = complaintRepository.findById(id).orElse(null);
        if (c != null) {
            CancelledComplaint cc = new CancelledComplaint();
            cc.setOriginalId(c.getId());
            cc.setDepartment(c.getDepartment());
            cc.setUrgency(c.getUrgency());
            cc.setDescription(c.getDescription());
            cc.setReason(reason);
            cc.setSubmittedAt(c.getSubmittedAt());
            cancelledComplaintRepository.save(cc);

            complaintRepository.delete(c); // remove from active complaints
        }
    }

    // ----------------- Fetch & Sort -----------------
    // Pending Complaints
    public List<Complaint> getPendingHighToLow() {
        return complaintRepository.findByStatusIgnoreCase("Pending")
                .stream()
                .sorted((a, b) -> b.getUrgency().compareToIgnoreCase(a.getUrgency()))
                .toList();
    }

    public List<Complaint> getPendingLowToHigh() {
        return complaintRepository.findByStatusIgnoreCase("Pending")
                .stream()
                .sorted(Comparator.comparing(Complaint::getUrgency))
                .toList();
    }

    public List<Complaint> getPendingDateAsc() {
        return complaintRepository.findByStatusIgnoreCase("Pending")
                .stream()
                .sorted(Comparator.comparing(Complaint::getSubmittedAt))
                .toList();
    }

    public List<Complaint> getPendingDateDesc() {
        return complaintRepository.findByStatusIgnoreCase("Pending")
                .stream()
                .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                .toList();
    }

    // In Progress Complaints
    public List<Complaint> getInProgressHighToLow() {
        return complaintRepository.findByStatusIgnoreCase("In Progress")
                .stream()
                .sorted((a, b) -> b.getUrgency().compareToIgnoreCase(a.getUrgency()))
                .toList();
    }

    public List<Complaint> getInProgressLowToHigh() {
        return complaintRepository.findByStatusIgnoreCase("In Progress")
                .stream()
                .sorted(Comparator.comparing(Complaint::getUrgency))
                .toList();
    }

    public List<Complaint> getInProgressDateAsc() {
        return complaintRepository.findByStatusIgnoreCase("In Progress")
                .stream()
                .sorted(Comparator.comparing(Complaint::getSubmittedAt))
                .toList();
    }

    public List<Complaint> getInProgressDateDesc() {
        return complaintRepository.findByStatusIgnoreCase("In Progress")
                .stream()
                .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                .toList();
    }

    // Cancelled Complaints
    public List<CancelledComplaint> getCancelled() {
        return cancelledComplaintRepository.findAll();
    }

    // Pending complaints for task assignment
    public List<Complaint> getPendingComplaints() {
        return complaintRepository.findByStatusIgnoreCase("Pending");
    }

    // Update complaint status
    public void updateComplaintStatus(Long id, String status) {
        Complaint c = complaintRepository.findById(id).orElse(null);
        if (c != null) {
            c.setStatus(status);
            complaintRepository.save(c);
        }
    }

    // Get complaint by ID
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id).orElse(null);
    }

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    @Autowired
    private AuthorityRepository authorityRepository; // inject this

    public List<Complaint> getComplaintsByAuthorityEmail(String email) {
        Authority authority = authorityRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authority not found"));
        Long authorityId = authority.getId();
        return taskRepo.findByAuthorityId(authorityId).stream()
                .map(task -> complaintRepository.findById(task.getComplaintId()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }




}
