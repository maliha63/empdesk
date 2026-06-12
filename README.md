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

**Three View Modes:**
* **Month View** - Full calendar grid with event indicators (colored dots), upcoming events cards below with 3-dot menu
* **Week View** - 7-day grid with hourly time slots and color-coded event blocks, matching reference design
* **List View** - Chronological listing of upcoming events with full metadata and action menus

**Features:**
* Create, edit, and delete company events
* Event categorization with icons (meeting, deadline, social, training)
* Dynamic event filtering - shows only future events relative to current date
* Manager access to edit/delete via 3-dot menus on event cards and list items
* Event indicator dots on calendar days with events
* Proper time slot positioning in week view
* Events update dynamically when date changes

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

## 🎨 Module Redesigns & Improvements (Latest Release)

### Performance Module Redesign
* **Stat Cards** - 4 key metric cards: Average Score, Highest Score, Lowest Score, Total Employees
* **Trend Indicators** - Green/red arrows showing performance direction
* **Sparkline Trends** - Visual trend charts in employee table using mini LineCharts
* **Employee Metadata** - Top performer and lowest scorer names displayed in stat cards
* **Color Coding** - Green trends for good performers, red for improvement areas

### Events Module Complete Redesign - 3 View Modes with Full Functionality

**Month View (Fully Implemented):**
* Calendar grid with square date cells (aspect-square)
* Event indicator dots on days with events (colored by category)
* Selected date highlighting in blue
* Inline view tabs (Month/Week/List) in header with left/right navigation arrows
* Upcoming events cards below calendar with 3-dot edit/delete menus (managers only)
* Dynamic event filtering - shows only future events relative to current date
* Events update when date changes

**Week View (Grid-Based Layout):**
* 7-day grid with time labels column + 7 day columns
* Time slots from 9 AM to 5 PM with hourly rows (20px height)
* Events positioned in correct time slot cells with category colors
* Day headers showing day name and date number
* Color-coded event blocks by category (meeting, deadline, social, training)
* Legend at bottom showing category color dots
* Inline view tabs in header with week navigation arrows
* Matches reference design exactly

**List View (Future Events Focus):**
* Chronological listing of upcoming events only
* Each event card shows: category icon, title, date, time, location
* 3-dot menu on each card (managers only) for edit/delete
* Category-colored left border on event cards
* Hover effects and smooth transitions
* Inline view tabs in header

**Manager Event Management:**
* Edit/Delete options visible only to managers (user.role === "manager")
* 3-dot dropdown menu on event cards and list items
* Edit opens modal with pre-filled event data
* Delete removes event with confirmation toast
* Menu closes automatically after action

**Create/Edit Modal:**
* Custom modal implementation with overlay
* Accessible via floating + Create Event button
* Accessible via Edit option in 3-dot menus
* Form fields: Title, Date, Time, Category, Location, Description
* Proper form validation with error feedback
* Cancel and Update/Create buttons

### Design & Implementation
* **View Navigation** - Inline tabs (Month/Week/List) in header with < > date arrows on same row
* **Color System** - Reusable categoryColors object with bg, text, border, dot, icon colors
* **Category Icons** - Briefcase (meeting), Clock (deadline), Users (social), Book (training)
* **Responsive Layout** - Grid-based layouts with proper spacing and alignment
* **Dark Mode** - Full dark mode support throughout all views
* **Helper Functions** - getViewButtonClass for consistent tab styling, futureEvents filtering with useMemo
* **Square Calendar Cells** - aspect-square ensures uniform calendar appearance

### Bug Fixes
1. **Event Module Display** - Fixed "No events on this date" bug where today's events weren't showing on page load
2. **Modal Button Styling** - Cancel uses secondary variant (light), Create/Update uses primary variant (dark)
3. **Dashboard Redundancy** - Removed duplicate Leave Request card from employee dashboard
4. **Notice Board UI** - Fixed truncated description display to show full text content
5. **Sidebar Navigation** - Smart auto-expand when clicking collapsed parent modules with children
6. **Module Styling** - Parent modules bold with no background when child is active

### Code Quality
* All imports verified as used (no unused dependencies or functions)
* TypeScript strict mode compliance
* Reusable color and icon mapping objects
* Clean separation of concerns
* Full dark mode support
* Production-ready with 0 build warnings

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


