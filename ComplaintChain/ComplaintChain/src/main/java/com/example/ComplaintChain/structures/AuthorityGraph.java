package com.example.ComplaintChain.structures;

import java.util.*;
import com.example.ComplaintChain.entity.Authority;
import org.springframework.stereotype.Component;

@Component
public class AuthorityGraph {

    private final Map<String, List<AuthorityNode>> departmentAuthorities = new HashMap<>();
    private static final int MAX_TASKS = 2; // maximum tasks per authority

    // Add authority to department
    public void addAuthority(Authority authority) {
        departmentAuthorities
                .computeIfAbsent(authority.getDepartment(), k -> new ArrayList<>())
                .add(new AuthorityNode(authority));
    }

    // Get the authority with the least workload in a department and under MAX_TASKS
    public AuthorityNode getNextAvailableAuthority(String department) {
        List<AuthorityNode> nodes = departmentAuthorities.get(department);
        if (nodes == null || nodes.isEmpty()) return null;

        // sort by current workload
        nodes.sort(Comparator.comparingInt(AuthorityNode::getCurrentWorkload));

        // return first authority under MAX_TASKS
        for (AuthorityNode node : nodes) {
            if (node.getCurrentWorkload() < MAX_TASKS) {
                return node;
            }
        }

        return null; // no authority available
    }

    // Increment workload after assigning task
    public void assignTaskToAuthority(AuthorityNode node) {
        if (node.getCurrentWorkload() < MAX_TASKS) {
            node.incrementWorkload();
        }
    }

    // Decrement workload if task is completed
    public void completeTaskForAuthority(AuthorityNode node) {
        node.decrementWorkload();
    }

    // Get all authorities of a department
    public List<AuthorityNode> getDepartmentAuthorities(String department) {
        return departmentAuthorities.getOrDefault(department, new ArrayList<>());
    }
}
