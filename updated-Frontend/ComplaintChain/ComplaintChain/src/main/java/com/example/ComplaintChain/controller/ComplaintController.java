package com.example.ComplaintChain.controller;

import com.example.ComplaintChain.entity.Complaint;
import com.example.ComplaintChain.entity.CancelledComplaint;
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
