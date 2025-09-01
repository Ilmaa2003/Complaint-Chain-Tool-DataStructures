package com.example.ComplaintChain.controller;

import com.example.ComplaintChain.entity.Complaint;
import com.example.ComplaintChain.entity.Task;
import com.example.ComplaintChain.service.TaskService;
import com.example.ComplaintChain.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;
    private final ComplaintService complaintService;

    public TaskController(TaskService taskService, ComplaintService complaintService) {
        this.taskService = taskService;
        this.complaintService = complaintService;
    }

    // Create/assign a task (links to a complaint)
    @PostMapping
    public ResponseEntity<Task> assignTask(@RequestBody Task task) {
        Task savedTask = taskService.assignTask(task);
        // Update complaint status to "In Progress"
        complaintService.updateComplaintStatus(task.getComplaintId(), "In Progress");
        return ResponseEntity.ok(savedTask);
    }

    // Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // Get tasks by complaint ID
    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<List<Task>> getTasksByComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(taskService.getTasksByComplaint(complaintId));
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    // Optional: update task deadline
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskService.updateTask(id, updatedTask);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/complaints-by-authority")
    public ResponseEntity<List<Complaint>> getComplaintsByAuthorityEmail(@RequestParam String email) {
        List<Complaint> complaints = complaintService.getComplaintsByAuthorityEmail(email);
        return ResponseEntity.ok(complaints);
    }

}
