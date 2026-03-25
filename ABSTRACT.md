# Abstract: RequestHub - AI-Driven Automated Request Management System

**Project Title:** RequestHub: A Centralized, Automated Request Management System  
**Author:** [Your Name]  
**Technology Stack:** MERN Stack (MongoDB, Express.js, React.js, Node.js), Socket.io, n8n Automation, JWT.

---

### **Executive Summary**
In modern organizational environments, managing various types of requests—ranging from leave applications and purchase requisitions to IT support and travel authorizations—often involves cumbersome manual processes, leading to delays, miscommunication, and a lack of transparency. **RequestHub** is a web-based, full-stack application designed to streamline these workflows by providing a centralized platform for request submission, tracking, and automated approval notifications.

### **Problem Statement**
Traditional request management systems often suffer from:
1.  **Fragmented Communication**: Requests are often sent via email or physical forms, making them difficult to track.
2.  **Delayed Processing**: A lack of real-time notifications results in pending requests sitting unattended for long periods.
3.  **Limited Visibility**: Employees often lack clear insights into the current status of their submitted requests.
4.  **Manual Overload**: HR and Admin teams spend excessive time manually filtering and notifying the appropriate stakeholders.

### **Proposed Solution**
RequestHub addresses these challenges by integrating a high-performance **MERN-stack** architecture with **n8n automation**. The system allows users to submit categorized requests with supporting documentation, which are then stored in a secure MongoDB database. 

**Key Innovation**: The integration of **n8n (an open-source workflow automation tool)** enables the system to periodically fetch pending requests and automatically notify relevant Admin or HR personnel via pre-configured channels (such as Email or Slack), ensuring a rapid response time.

### **Key Features**
*   **Role-Based Access Control (RBAC):** Distinct dashboards for Employees, HR, and Admin users.
*   **Real-Time Subscriptions:** Utilizing **Socket.io** to provide users with instant updates when the status of their request changes (Approved, Rejected, or In-Review).
*   **Secure File Management:** Integration with **Multer** for handling supporting document uploads (PDFs/Images).
*   **Automated Workflow Integration:** An API endpoint specifically designed for **n8n** to trigger automated approval cycles and notifications.
*   **Interactive UI/UX:** Built with **React.js**, **Vite**, and **Framer Motion**, offering a premium, smooth, and responsive user experience.

### **Project Impact**
RequestHub significantly reduces the administrative burden by automating the notification and tracking process. It improves organizational efficiency, enhances transparency between employees and management, and provides a scalable foundation for future enhancements such as AI-based request prioritization and predictive resource allocation.

---

**Keywords:** *MERN Stack, Workflow Automation, n8n, Real-time Notifications, Request Tracking, Enterprise Management System.*
