# 🚀 TaskMaster - Modern Project Management System

**TaskMaster** is a high-performance Full-stack application designed for efficient team collaboration and task management. It features a modern React interface and a Node.js backend connected to a remote PostgreSQL database on Linux.

---

## ✨ Features & Functionalities

### 📋 Task Management
* **Full CRUD Lifecycle:** Create, edit, and delete tasks with detailed descriptions and priorities.
* **Prioritization:** Visual badges for Low, Medium, and High priority.
* **Live Filtering:** Real-time search and status-based filtering.

### 👥 Team Collaboration
* **Email Invitations:** Secure flow via Gmail SMTP. New users automatically join projects upon registration.
* **Role-Based Access Control (RBAC):**
  - **Owner:** Full project control and member management.
  - **Manager:** Create, edit, and assign tasks.
  - **Worker:** View tasks and update statuses.
* **Multi-Assignee Support:** Assign multiple members to a single task using tags.

### 🔄 Advanced Workflow
* **Dynamic Statuses:** Tasks move through To Do, In Progress, Blocked, and Done.
* **Intelligent Blocking:** Enforced "Reason for Block" entry when a task is stalled.

### 📊 Analytics & UX
* **Team Workload:** Monitoring active tasks per employee (Alerts at 5+ tasks).
* **Project Progress:** Real-time visual progress bar.
* **Modern UI:** Smooth animations, Toast notifications, and loading spinners.

---

## 🚀 Installation & Setup Guide

### 📋 Prerequisites
* **Node.js** (v18 or higher)
* **Docker** (Installed on your Linux server)
* **Gmail Account** (with 2FA enabled for App Passwords)

---

### 🚀 Step 1: Database Setup (Linux Server)

1. Create a file named `docker-compose.yml` on your server and paste this:

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:15-alpine
    container_name: taskmaster-postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: system_zadan
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

    Run the database:

code Bash

docker compose up -d

🚀 Step 2: Backend Configuration (/task-manager-backend)

    Install Dependencies:

code Bash

cd task-manager-backend
npm install

    Environment Variables:
    Create a .env file in the backend folder:

code Env

DATABASE_URL="postgresql://user:password@YOUR_LINUX_IP:5432/system_zadan?schema=public"
JWT_SECRET="YourSuperSecretKey123"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"

    Initialize Database & Start:

code Bash

npx prisma migrate dev --name init
node index.js

🚀 Step 3: Frontend Configuration (/task-manager-frontend)

    Install Dependencies:

code Bash

cd ../task-manager-frontend
npm install

    Launch Application:

code Bash

npm run dev

The application will be live at: http://localhost:5173
🛠️ Critical Technical Notes
🔐 JWT Authentication

All requests to protected routes must include the header:
Authorization: Bearer <your_token>
📧 Gmail SMTP Setup

    Enable 2-Factor Authentication in your Google Account.

    Search for "App Passwords" in Google settings.

    Generate a password for "Mail" and use the 16-character code in your .env file.

🏗️ Project Structure
code Text

TaskManager/
├── task-manager-backend/    # Node.js + Prisma
│   ├── routes/              # API Logic (auth, tasks, projects, dashboard)
│   ├── prisma/              # Database Schema & Migrations
│   └── lib/                 # Shared logic (prisma client, mailer)
├── task-manager-frontend/   # React + Tailwind
│   ├── src/components/      # Reusable UI (Sidebar, TaskList, Modals)
│   ├── src/pages/           # Views (Dashboard, Login, Register)
│   └── src/context/         # Auth State Management
└── docker-compose.yml       # Infrastructure
