# 🚀 EmpDesk — Employee Management System

A modern, scalable, and fully responsive **Employee Management Dashboard** built with **React, TypeScript, and Tailwind CSS**, designed to streamline employee operations with a clean UI and modular architecture.

![Dashboard Preview](./src/assets/empdesk.png)

---

## 🧭 Overview

EmpDesk is a frontend-driven Employee Management System focused on **clarity, performance, and scalability**. It models real-world HR workflows including employee management, leave tracking, and role-based access control.

---

## ✨ Features

### 🔐 Authentication & Role-Based Access

* Manager and Employee roles
* Protected routes and conditional UI rendering

### 👨‍💼 Employee Management

* Add, edit, delete employees
* Structured employee profiles
* Department-based organization

### 📊 Dashboard & Analytics

* Key metrics overview
* Department distribution charts
* Recent activity tracking

### 🧾 Leave Management

* Apply for leave
* Approve / reject requests (Manager)
* Track leave history

### 👤 Profile System

* Personal profile view
* Attendance and performance tracking (UI-level)

### 🔎 Search & Filtering

* Real-time search
* Department-based filtering

### 🎨 UI/UX

* Fully responsive (mobile → desktop)
* Dark & Light mode with smooth transitions
* Modern UI with reusable components

---

## 🛠 Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Frontend         | React 18 + Vite + TypeScript |
| Styling          | Tailwind CSS + CSS Variables |
| State Management | React Context + useReducer   |
| Routing          | React Router v6              |
| Animations       | Framer Motion                |
| Charts           | Recharts                     |
| Icons            | Lucide React                 |
| Notifications    | react-hot-toast              |

---

## ⚙️ Architecture

### 1. State Management (Context-Based)

* `AuthContext` → Handles authentication & roles
* `EmployeeContext` → Employee data management
* `LeaveContext` → Leave workflows

✔ Lightweight alternative to Redux
✔ Clean separation of concerns

---

### 2. Component Design

* Reusable UI components (Card, Button, Modal, etc.)
* Clear separation between UI and logic
* Scalable folder structure

---

### 3. Theming System

* CSS Custom Properties (`--bg`, `--text`, etc.)
* Persistent theme (localStorage)
* Smooth transitions across all components

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── context/           # Global state (Auth, Employee, Leave)
├── hooks/             # Custom hooks
├── layouts/           # Layout wrappers (Dashboard, Auth)
├── pages/             # Main pages
├── services/          # Mock API layer
├── types/             # TypeScript definitions
├── utils/             # Helpers & mock data
├── constants.ts
└── index.css          # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)

### Installation

```bash
# Clone the repository
git clone https://github.com/maliha63/empdesk.git

# Navigate to project
cd empdesk

# Install dependencies
npm install

# Run development server
npm run dev
```

Open: **http://localhost:5173**

---

## 📊 Data Handling

* Mock employee dataset
* LocalStorage for persistence (leave requests, theme)
* Simulated real-time updates

---

## 📸 Key Pages

* Dashboard — analytics & overview
* Employees — full CRUD interface
* Employee Profile — detailed view
* My Profile — personal dashboard
* Add/Edit Employee — validated forms

---

## 🔮 Future Improvements

* Backend integration (Node.js / Firebase)
* Real authentication (JWT / OAuth)
* Database (MongoDB / Firestore)
* Attendance tracking system
* Payroll module
* Notifications system
* API abstraction layer
* Unit & integration testing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License

---

## 👩‍💻 Author

**Maliha Bathool**
GitHub: https://github.com/maliha63

---
