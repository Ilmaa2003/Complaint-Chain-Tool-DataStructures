package com.example.ComplaintChain.controller;

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



    // Assign a task (update complaint status)
    @PostMapping
    public ResponseEntity<Task> assignTask(@RequestBody Task task) {
        // Save task
        Task savedTask = taskService.assignTask(task);

        // Update complaint status to "In Progress"
        complaintService.updateComplaintStatus(task.getComplaintId(), "In Progress");

        return ResponseEntity.ok(savedTask);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/authority/{authorityId}")
    public ResponseEntity<List<Task>> getTasksByAuthority(@PathVariable Long authorityId) {
        return ResponseEntity.ok(taskService.getTasksByAuthority(authorityId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
