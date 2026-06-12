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
* Professional split-layout login with branded design

### 👨‍💼 Employee Management

* Add, edit, delete employees with full-page forms
* Structured employee profiles with multiple sections
* Department-based organization
* Optimized table layout with proper column spacing
* Horizontal scrollbar for large datasets

### 📊 Dashboard & Analytics

* Key metrics overview
* Department distribution charts
* Recent activity tracking
* Dynamic performance charts that update based on selected employee
* Varied performance ratings (Excellent, Good, Average, Poor) with color-coded badges
* Interactive employee selection with visual feedback

### 🗓️ Events Management

* Create, edit, and delete company events
* Event categorization (meetings, deadlines, social, training)
* Category icons and visual hierarchy
* Date synchronization with calendar

### 🧾 Leave Management

* Apply for leave
* Approve / reject requests (Manager)
* Track leave history

### 👤 Profile System

* Personal profile view
* Attendance and performance tracking
* Role-specific sections (skills, competencies for managers)
* Activity status and login tracking

### 🔎 Search & Filtering

* Real-time search with friendly "no results" messaging
* Department-based filtering
* Dynamic search feedback

### 🎨 UI/UX

* Fully responsive (mobile → desktop)
* Dark & Light mode with smooth transitions
* Modern, branded UI with reusable components
* Improved 404 page with navigation options
* Enhanced event cards with icons and animations
* Professional login interface with split-layout design

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

## 🐛 Recent Bug Fixes & Improvements (Latest Release)

### Fixed Issues
1. **Event Module Display** - Fixed "No events on this date" bug where today's events weren't showing on page load
2. **Event Module UI Redesign** - Completely revamped Events page with modern card design, improved visual hierarchy, and professional styling
3. **Modal Button Styling** - Fixed modal buttons: Cancel uses secondary variant (light), Create/Update uses primary variant (dark) with proper padding
4. **Dashboard Redundancy** - Removed duplicate Leave Request card from employee dashboard (already available in Leave module)
5. **Notice Board UI** - Fixed truncated description display to show full text content
6. **Sidebar Navigation** - Implemented smart expand behavior: auto-expand sidebar when clicking collapsed parent modules with children
7. **Module Styling** - Enhanced visual hierarchy with parent modules showing bold text (no background) when child is active

### UI/UX Improvements
* Modern event cards with better spacing and visual hierarchy
* Enhanced hover effects and smooth transitions
* Improved empty state with better messaging
* Better category badge and metadata layout
* Professional modal button styling matching design standards
* Consistent color usage and visual feedback

### Code Quality
* All imports verified as used (no unused dependencies)
* Removed unused variables (categoryColors)
* Clean, production-level code structure
* Added relevant comments for maintainability
* Optimized component initialization with proper state handling
* Full TypeScript type safety
* Successful production build without warnings

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


