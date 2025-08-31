package com.example.ComplaintChain.repository;

import com.example.ComplaintChain.entity.CancelledComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CancelledComplaintRepository extends JpaRepository<CancelledComplaint, Long> {}
