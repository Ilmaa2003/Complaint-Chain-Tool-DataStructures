package com.example.ComplaintChain.service;

import com.example.ComplaintChain.entity.Authority;
import com.example.ComplaintChain.entity.Task;
import com.example.ComplaintChain.entity.Complaint;
import com.example.ComplaintChain.repository.AuthorityRepository;
import com.example.ComplaintChain.repository.TaskRepository;
import com.example.ComplaintChain.structures.AuthorityGraph;
import com.example.ComplaintChain.structures.AuthorityNode;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ComplaintService complaintService;
    private final AuthorityGraph authorityGraph;
    private final AuthorityRepository authorityRepository;

    private final int MAX_TASKS_PER_AUTHORITY = 2; // maximum concurrent tasks

    public TaskService(TaskRepository taskRepository,
                       ComplaintService complaintService,
                       AuthorityGraph authorityGraph,
                       AuthorityRepository authorityRepository) {
        this.taskRepository = taskRepository;
        this.complaintService = complaintService;
        this.authorityGraph = authorityGraph;
        this.authorityRepository = authorityRepository;
    }

    // Populate graph from DB on startup
    @PostConstruct
    public void initAuthorityGraph() {
        List<Authority> authorities = authorityRepository.findAll();
        for (Authority authority : authorities) {
            authorityGraph.addAuthority(authority);
        }
        System.out.println("AuthorityGraph populated with " + authorities.size() + " authorities.");
    }

    // Complete task and trigger auto-assignment
    public void completeTask(Task task) {
        // Reduce authority workload
        authorityGraph.getDepartmentAuthorities(
                        complaintService.getComplaintById(task.getComplaintId()).getDepartment()
                ).stream()
                .filter(a -> a.getAuthority().getId().equals(task.getAuthorityId()))
                .findFirst()
                .ifPresent(authorityGraph::completeTaskForAuthority);

        // Delete task
        taskRepository.delete(task);

        // Update complaint status
        complaintService.updateComplaintStatus(task.getComplaintId(), "Completed");

        // Trigger auto-assignment for pending complaints in the same department
        List<Complaint> pending = complaintService.getPendingComplaints()
                .stream()
                .filter(c -> c.getDepartment().equals(
                        complaintService.getComplaintById(task.getComplaintId()).getDepartment()
                ))
                .collect(Collectors.toList());

        autoAssignPendingComplaints(pending);
    }

    // Assign a task manually
    public Task assignTask(Task task) {
        taskRepository.save(task);
        complaintService.updateComplaintStatus(task.getComplaintId(), "In Progress");

        authorityGraph.getDepartmentAuthorities(
                        complaintService.getComplaintById(task.getComplaintId()).getDepartment()
                ).stream()
                .filter(a -> a.getAuthority().getId().equals(task.getAuthorityId()))
                .findFirst()
                .ifPresent(authorityGraph::assignTaskToAuthority);

        return task;
    }

    // Automatically assign pending complaints with max workload check
    public void autoAssignPendingComplaints(List<Complaint> pendingComplaints) {
        for (Complaint c : pendingComplaints) {
            AuthorityNode available = authorityGraph.getNextAvailableAuthority(c.getDepartment());
            if (available != null && available.getCurrentWorkload() < MAX_TASKS_PER_AUTHORITY) {
                Task task = new Task();
                task.setComplaintId(c.getId());
                task.setAuthorityId(available.getAuthority().getId());
                task.setDeadline(null);
                taskRepository.save(task);

                authorityGraph.assignTaskToAuthority(available);
                complaintService.updateComplaintStatus(c.getId(), "In Progress");
            }
            // If no available authority or max workload reached, complaint stays pending
        }
    }

    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task != null) {
            authorityGraph.getDepartmentAuthorities(
                            complaintService.getComplaintById(task.getComplaintId()).getDepartment()
                    ).stream()
                    .filter(a -> a.getAuthority().getId().equals(task.getAuthorityId()))
                    .findFirst()
                    .ifPresent(authorityGraph::completeTaskForAuthority);

            taskRepository.delete(task);
            complaintService.updateComplaintStatus(task.getComplaintId(), "Pending");
        }
    }

    public List<Task> getTasksByAuthority(Long authorityId) {
        return taskRepository.findAll()
                .stream()
                .filter(task -> task.getAuthorityId().equals(authorityId))
                .collect(Collectors.toList());
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
