package com.example.ComplaintChain.structures;

import com.example.ComplaintChain.entity.Complaint;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComplaintQueue {
    private final List<Complaint> list = new ArrayList<>();
    private int front = 0;
    private int rear = 0;

    // Check if queue is empty
    public boolean isEmpty() {
        return front == rear;
    }

    // Check if queue is full (since ArrayList grows dynamically, always false)
    public boolean isFull() {
        return false;
    }

    // Add a complaint to the rear
    public void enqueue(Complaint complaint) {
        list.add(complaint);
        rear++;
    }

    // Remove a complaint from the front
    public Complaint dequeue() {
        if (isEmpty()) throw new RuntimeException("Queue is empty");
        Complaint c = list.get(front);
        front++;
        return c;
    }

    // Peek at the front complaint without removing
    public Complaint peek() {
        if (isEmpty()) throw new RuntimeException("Queue is empty");
        return list.get(front);
    }

    // Remove a complaint by its ID
    public Complaint removeById(Long id) {
        for (int i = front; i < rear; i++) {
            if (list.get(i).getId().equals(id)) {
                Complaint removed = list.get(i);
                list.remove(i);
                rear--;
                return removed;
            }
        }
        return null;
    }

    // Get a list of all complaints in the queue
    public List<Complaint> toArray() {
        return new ArrayList<>(list.subList(front, rear));
    }

    // Get a sorted list of complaints
    public List<Complaint> toListSorted(Comparator<Complaint> comparator) {
        List<Complaint> sorted = new ArrayList<>(list.subList(front, rear));
        sorted.sort(comparator);
        return sorted;
    }
}
