# 🚀 EmpDesk

A modern, feature-rich **Employee Management System** for organizations of all sizes.

EmpDesk is a **React + TypeScript + Vite** based web application designed to streamline HR and employee management processes. It provides a comprehensive suite of tools for managing employees, attendance, leaves, payroll, performance, documents, and more.

![Dashboard Preview](./src/assets/empdesk.png)

---

## ✨ Features

### 🏠 Core Modules

* **Employee Management**
  Add, edit, view, and manage employee profiles with detailed information.

* **Attendance Tracking**
  Mark, track, and manage employee attendance with filters and reports.

* **Leave Management**
  Request, approve, and track leaves with customizable leave types and policies.

* **Payroll System**
  Generate, manage, and track payroll with detailed breakdowns.

* **Performance Reviews**
  Conduct and track employee performance reviews with ratings and feedback.

* **Document Management**
  Upload, share, and manage company and employee documents securely.

---

### 📊 Dashboard & Analytics

* **Interactive Dashboard**
  Overview of key metrics like total employees, departments, attendance, and recent activities.

* **Reports**
  Generate and export reports for employees, attendance, leaves, payroll, and performance.

* **Charts & Visualizations**
  Data visualization using Recharts for better insights.

---

### 🗓️ Additional Features

* **Events & Notices**
  Create and manage company events and announcements.

* **Tasks & Projects**
  Assign, track, and manage employee tasks.

* **Departments & Designations**
  Organize employees with structured hierarchy.

* **Authentication**
  Secure login system with role-based access control.

---

### 🎨 UI/UX Highlights

* Modern & fully responsive design using Tailwind CSS
* Dark / Light mode support
* Reusable UI components (DataTable, Modal, DatePicker, etc.)
* Smooth animations using Motion

---

## 🛠️ Tech Stack

| Category      | Technologies                                              |
| ------------- | --------------------------------------------------------- |
| Frontend      | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React |
| Charts        | Recharts                                                  |
| Animations    | Motion                                                    |
| Forms         | React Hook Form                                           |
| Notifications | React Hot Toast                                           |
| Routing       | React Router DOM v7                                       |
| Linting       | ESLint, TypeScript ESLint, Prettier                       |
| Build Tool    | Vite                                                      |

---

## 📁 Project Structure

```
empdesk/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or later)
* npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/maliha63/empdesk.git
cd empdesk
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## 📜 Available Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| npm run dev     | Start development server |
| npm run build   | Build for production     |
| npm run lint    | Run ESLint               |
| npm run preview | Preview production build |

---

## 🎨 Customization

### Theming

* Modify `tailwind.config.js` for colors, fonts, etc.
* Toggle themes using `ThemeContext`

### Adding Features

* **New Page:** `src/pages/`
* **New Component:** `src/components/`
* **State Management:** `src/context/`
* **API Services:** `src/services/`

---

## 📂 Key Pages

| Page        | Description               |
| ----------- | ------------------------- |
| Dashboard   | System overview & metrics |
| Employees   | Manage employee records   |
| Attendance  | Track attendance          |
| Leaves      | Leave management          |
| Payroll     | Salary management         |
| Performance | Reviews & ratings         |
| Documents   | File management           |
| Events      | Company events            |
| Notices     | Announcements             |
| Tasks       | Task tracking             |
| Reports     | Data export & analytics   |

---

## 🔧 Configuration

### Environment Variables

Create `.env`:

```
VITE_API_BASE_URL=http://your-api-url
```

### Tailwind Example

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
      },
    },
  },
};
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`feature/your-feature`)
3. Commit changes
4. Push to GitHub
5. Open a Pull Request

---

## 📄 License

Private and proprietary. Do not use or distribute without permission.



---
