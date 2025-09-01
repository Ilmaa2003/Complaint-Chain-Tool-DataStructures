# Complaint Chain Manager

**Developed by:**  
- Ilma M H F – cohndse242f-041  
- Azward M A – cohndse242f-042  

**Program:** Higher National Diploma in Software Engineering  
**School:** School of Computing and Engineering, National Institute of Business Management, Colombo-7  

Demonstration video :  https://drive.google.com/file/d/1AX3lMMwM0iUjb6QZF66atnqjov_bF8ai/view?usp=drive_link

---

## Introduction

**Complaint Chain Manager** is a tool designed for efficient management of public complaints received from citizens. These complaints may relate to road damages, garbage disposal, electricity or water issues, and other civic problems.  

The tool allows complaints to be **effectively managed, stored, analyzed, directed, and resolved** by authorities across different levels in the organizational hierarchy.  

**Objectives:**  
- Maintain complaint records for easy storage and accessibility  
- Reduce the time taken for problem resolution  
- Categorize and prioritize complaints based on urgency  
- Track the status of complaints  
- Automatic task assignments  

---

## Functional Requirements

### Input Requirements

- **Complaint details:**  
  - Citizen Name  
  - National ID Number  
  - Contact Number  
  - Email Address  
  - Address  
  - Complaint Description  
  - Relevant Department  
  - Level of Urgency  
  - Submission Time and Date  

- **Staff profiles:**  
  - Name  
  - Contact Number  
  - Email Address  

- Department, position, and complaint assignments for staff  
- Status updates of complaints managed by staff (e.g., in review, in progress)  

### Process Requirements

- Submit complaints  
- Arrange complaints according to submission order and urgency  
- Track the status of complaint resolution  
- Automatically assign tasks

### Output Requirements

- View complaints along with their current status  
- Show complaints based on specific conditions  
- Generate a history of complaints  

---

## Data Structures Used

- **Heap – for managing complaints based on priority**  
  - Complaints have priorities such as high and low  
  - Ensures high-priority complaints are resolved first  
  - Efficiently filters complaints based on urgency  

- **Queue – for maintaining first-come, first-served order**  
  - Ensures the first received complaint is considered first  
  - Maintains fairness while sorting priority-wise complaints  
  - Filters complaints automatically based on arrival time  

- **Graph – for defining organizational hierarchy**  
  - Represents relationships between different authority levels  
  - Automatically redirects tasks

---


## 4. Technologies Used

### Frontend
- **React.js** – Interactive user interfaces  
- **HTML5 & CSS3** – Markup and styling  
- **JavaScript (ES6+)** – Dynamic client-side logic  
- **Axios** – HTTP requests to backend APIs  
- **React Router** – Page routing  
- **Optional UI Libraries** – Material-UI, Bootstrap  

### Backend
- **Java with Spring Boot** – REST API development  
- **Spring Data JPA** – Database interactions  
- **MySQL** – Relational database  
- **Maven** – Build automation and dependency management  
- **Java Collections / Data Structures** – Heap, Queue, Graph  

---

## Summary

The **Complaint Chain Manager** improves efficiency in complaint management by organizing, prioritizing, and directing citizen complaints within an authority structure. It ensures timely resolution and proper tracking of all complaints.
