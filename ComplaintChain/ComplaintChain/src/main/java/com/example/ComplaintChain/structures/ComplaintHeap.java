package com.example.ComplaintChain.structures;

import com.example.ComplaintChain.entity.Complaint;
import java.util.ArrayList;
import java.util.List;

public class ComplaintHeap {

    private final List<Complaint> heap = new ArrayList<>();

    // Compare complaints: High > Low, then earlier submitted first
    private boolean higherPriority(Complaint a, Complaint b) {
        if (a.getUrgency().equalsIgnoreCase("High") && b.getUrgency().equalsIgnoreCase("Low")) return true;
        if (a.getUrgency().equalsIgnoreCase("Low") && b.getUrgency().equalsIgnoreCase("High")) return false;
        return a.getSubmittedAt().isBefore(b.getSubmittedAt());
    }

    // Add complaint to heap
    public void add(Complaint complaint) {
        heap.add(complaint);
        heapifyUp(heap.size() - 1);
    }

    // Remove top (highest priority) complaint
    public Complaint poll() {
        if (heap.isEmpty()) return null;
        Complaint top = heap.get(0);
        Complaint last = heap.remove(heap.size() - 1);
        if (!heap.isEmpty()) {
            heap.set(0, last);
            heapifyDown(0);
        }
        return top;
    }

    // Peek at top complaint
    public Complaint peek() {
        if (heap.isEmpty()) return null;
        return heap.get(0);
    }

    // Remove complaint by ID
    public Complaint removeById(Long id) {
        for (int i = 0; i < heap.size(); i++) {
            if (heap.get(i).getId().equals(id)) {
                Complaint removed = heap.get(i);
                Complaint last = heap.remove(heap.size() - 1);
                if (i < heap.size()) {
                    heap.set(i, last);
                    heapifyDown(i);
                    heapifyUp(i);
                }
                return removed;
            }
        }
        return null;
    }

    // Heapify up after insert
    private void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (higherPriority(heap.get(index), heap.get(parent))) {
                swap(index, parent);
                index = parent;
            } else break;
        }
    }

    // Heapify down after removal
    private void heapifyDown(int index) {
        int size = heap.size();
        while (true) {
            int left = 2 * index + 1;
            int right = 2 * index + 2;
            int largest = index;

            if (left < size && higherPriority(heap.get(left), heap.get(largest))) largest = left;
            if (right < size && higherPriority(heap.get(right), heap.get(largest))) largest = right;

            if (largest != index) {
                swap(index, largest);
                index = largest;
            } else break;
        }
    }

    private void swap(int i, int j) {
        Complaint temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    // Return list of all complaints
    public List<Complaint> toList() {
        return new ArrayList<>(heap);
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }
}
