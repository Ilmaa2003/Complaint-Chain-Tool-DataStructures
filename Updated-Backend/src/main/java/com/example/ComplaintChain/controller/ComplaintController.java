package com.example.ComplaintChain.controller;

import com.example.ComplaintChain.entity.Complaint;
import com.example.ComplaintChain.entity.CancelledComplaint;
import com.example.ComplaintChain.repository.ComplaintRepository;
import com.example.ComplaintChain.service.ComplaintService;
import com.example.ComplaintChain.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/submit")
    public Complaint submitComplaint(@RequestBody Complaint complaint) {
        return complaintService.submitComplaint(complaint);
    }

    @GetMapping("/{status}")
    public List<Complaint> getComplaints(
            @PathVariable String status,
            @RequestParam(required = false, defaultValue = "high-low") String sort) {

        // Normalize status: remove spaces, convert to lowercase
        String normalizedStatus = status.replaceAll("\\s+", "").toLowerCase();

        switch (normalizedStatus) {
            case "pending" -> {
                return switch (sort.toLowerCase()) {
                    case "low-high" -> complaintService.getPendingLowToHigh();
                    case "date-asc" -> complaintService.getPendingDateAsc();
                    case "date-desc" -> complaintService.getPendingDateDesc();
                    default -> complaintService.getPendingHighToLow();
                };
            }
            case "inprogress" -> {
                return switch (sort.toLowerCase()) {
                    case "low-high" -> complaintService.getInProgressLowToHigh();
                    case "date-asc" -> complaintService.getInProgressDateAsc();
                    case "date-desc" -> complaintService.getInProgressDateDesc();
                    default -> complaintService.getInProgressHighToLow();
                };
            }
            default -> throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
    @Autowired
    private ComplaintRepository complaintRepo;

    @PutMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable Long id, @RequestParam String status) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepo.save(complaint);
    }
    @PutMapping("/resolve/{id}")
    public ResponseEntity<String> resolveComplaint(@PathVariable Long id) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        // Mark as resolved
        complaint.setStatus("Resolved");
        complaintRepo.save(complaint);

        // Remove related task
        taskService.deleteTasksByComplaintId(id);

        return ResponseEntity.ok("Complaint resolved and task removed.");
    }


    @PostMapping("/cancel/{id}")
    public void cancelComplaint(@PathVariable Long id, @RequestParam String reason) {
        complaintService.cancelComplaint(id, reason);
    }

    @PostMapping("/tasks/auto-assign")
    public ResponseEntity<String> autoAssign() {
        List<Complaint> pending = complaintService.getPendingComplaints();
        taskService.autoAssignPendingComplaints(pending);
        return ResponseEntity.ok("Pending complaints processed for assignment.");
    }


    @GetMapping("/cancelled")
    public List<CancelledComplaint> getCancelledComplaints() {
        return complaintService.getCancelled();
    }
}
