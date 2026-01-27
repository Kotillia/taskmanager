🚀 TaskMaster - Modern Project Management System

TaskMaster is a high-performance Full-stack application designed for team collaboration and task management. It features a modern React interface and a Node.js backend connected to a remote PostgreSQL database on Linux.
✨ Features & Functionalities
📋 Task Management

    Full CRUD Lifecycle: Create, edit, and delete tasks with detailed descriptions and priorities.

    Prioritization: Visual badges for Low, Medium, and High priority.

    Live Filtering: Search and filter tasks by status in real-time.

👥 Team Collaboration

    Email Invitations: Secure flow via Gmail SMTP. New users automatically join projects upon registration.

    Role-Based Access Control (RBAC):

        Owner: Full project control and member management.

        Manager: Create, edit, and assign tasks.

        Worker: View tasks and update statuses.

    Multi-Assignee: Assign multiple members to a single task using tags.

🔄 Advanced Workflow

    Dynamic Statuses: Tasks move through To Do, In Progress, Blocked, and Done.

    Intelligent Blocking: Enforced "Reason for Block" entry when a task is stalled.

📊 Analytics & UX

    Team Workload: Monitoring active tasks per employee (Alerts at 5+ tasks).

    Project Progress: Real-time visual progress bar.

    Modern UI: Smooth animations, Toast notifications, and loading spinners.

🚀 Installation & Setup Guide
📋 Prerequisites

    Node.js (v18 or higher)

    Docker (Installed on your Linux server)

    Gmail Account (with 2FA enabled for App Passwords)

🚀 Step 1: Database Setup (Linux Server)

    Create a file named docker-compose.yml on your server:

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

docker compose up -d

🚀 Step 2: Backend Configuration (/task-manager-backend)

    Install Dependencies:

cd task-manager-backend
npm install

    Environment Variables:
    Create a .env file in the backend folder:

# Use YOUR_LINUX_IP if Node is running locally, or "postgres" if Node is in Docker
DATABASE_URL="postgresql://user:password@YOUR_LINUX_IP:5432/system_zadan?schema=public"
JWT_SECRET="YourSuperSecretKey123"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"

    Critical: Configure CORS (index.js):
    Ensure your backend allows requests from the frontend:

const cors = require('cors');
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

    Initialize Database & Start:


npx prisma migrate dev --name init
node index.js

🚀 Step 3: Frontend Configuration (/task-manager-frontend)

    Install Dependencies:

cd ../task-manager-frontend
npm install

    Vite Proxy Config (vite.config.js):
    To avoid connection issues, add a proxy:

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})

    Launch Application:

npm run dev

Access at: http://localhost:5173
🛠️ Critical Technical Notes
🔐 JWT Authentication

All requests to protected routes must include the header:
Authorization: Bearer <your_token>
📧 Gmail SMTP Setup

    Enable 2-Factor Authentication in Google Account settings.

    Search for "App Passwords".

    Generate a password for "Mail" on "Other (Custom Name)".

    Use the provided 16-character code in your .env file.

🏗️ Project Structure

TaskManager/
├── task-manager-backend/    # Node.js + Prisma
│   ├── routes/              # Modular API (auth, tasks, projects, dashboard)
│   ├── prisma/              # Database Schema & Migrations
│   └── lib/                 # Shared logic (prisma client, mailer)
├── task-manager-frontend/   # React + Tailwind
│   ├── src/components/      # Reusable UI (Sidebar, TaskList, Modals)
│   ├── src/pages/           # Main Views (Dashboard, Login)
│   └── src/context/         # Auth State Management
└── docker-compose.yml       # PostgreSQL Infrastructure
