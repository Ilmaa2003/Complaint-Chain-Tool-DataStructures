package com.example.ComplaintChain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "authorities")
public class Authority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String level; // Level 1, Level 2, Level 3

    @Column(nullable = false)
    private String password;

    public Authority() {}

    public Authority(String name, String email, String phone, String department, String level, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.level = level;
        this.password = password;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
