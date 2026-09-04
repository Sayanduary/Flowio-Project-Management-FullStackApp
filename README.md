# Flowio - Project Management SaaS

A full-stack project management application for agile teams, featuring workspace collaboration, Kanban boards, calendar views, analytics dashboards, and email notifications.

**Live:** https://flowio-project-management.vercel.app/

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Background Jobs (Inngest)](#background-jobs-inngest)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

Flowio is a Project Management SaaS built for teams that need a modern alternative to Jira or Trello. It provides multi-tenant workspaces, project tracking, task management with multiple views (Kanban, Calendar, List), real-time collaboration via comments, analytics dashboards, and automated email notifications.

### How It Works

1. **Authentication** -- Users sign up/sign in via Clerk. Creating an organization in Clerk automatically creates a workspace in the database via webhook-triggered Inngest functions.
2. **Workspaces** -- Each workspace is a Clerk Organization. Users can be Admins or Members. All data (projects, tasks, comments) is scoped to a workspace.
3. **Projects** -- Created within workspaces. Each project has a team lead, status, priority, date range, and assigned members.
4. **Tasks** -- Created within projects. Tasks have types (Task, Bug, Feature, Improvement), statuses (Todo, In Progress, Done), priorities (Low, Medium, High), assignees, and due dates.
5. **Views** -- Tasks can be viewed as a Kanban board, monthly calendar, or filterable list.
6. **Comments** -- Team members can discuss tasks via threaded comments (polled every 10 seconds for near-real-time updates).
7. **Analytics** -- Charts show task status distribution, type breakdown, and priority breakdown per project.
8. **Email Notifications** -- When a task is assigned, the assignee receives an email. If the task isn't completed by its due date, a reminder email is sent automatically.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| React Router DOM | 7.x | Client-side routing |
| Redux Toolkit | 2.x | State management |
| React Redux | 9.x | React-Redux bindings |
| Tailwind CSS | 4.x | Utility-first CSS |
| Recharts | 3.x | Chart components |
| Axios | 1.x | HTTP client |
| Clerk | 6.x | Authentication UI + hooks |
| date-fns | 4.x | Date formatting/manipulation |
| lucide-react | latest | Icon library |
| react-hot-toast | 2.x | Toast notifications |
| Vite | 7.x | Build tool |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 5.x | HTTP framework |
| Prisma ORM | 7.x | Database ORM |
| @clerk/express | 2.x | Authentication middleware |
| Inngest | 4.x | Background job processing |
| Nodemailer | 9.x | Email sending |
| dotenv | 17.x | Environment variables |
| cors | 2.x | CORS middleware |
| nodemon | 3.x | Dev server auto-reload |

### Database & External Services

| Service | Purpose |
|---|---|
| PostgreSQL (Neon) | Primary database |
| Clerk | Authentication, user management, organizations |
| Inngest | Background jobs, event-driven functions |
| Brevo (Sendinblue) | SMTP relay for sending emails |
| Vercel | Hosting (frontend + backend) |

---

## Features

### Workspaces
- Multi-tenant organizations with role-based access (Admin, Member)
- Invite members via email
- Workspace-level member management
- Workspace switching via dropdown

### Projects
- Create, edit, and delete projects within workspaces
- Project statuses: Active, Planning, Completed, On Hold, Cancelled
- Project priorities: Low, Medium, High
- Project members with team lead assignment
- Date range tracking (start date, end date)
- Auto-calculated progress based on task completion

### Tasks
- **Kanban Board** -- Drag-and-drop tasks across status columns (Todo, In Progress, Done)
- **Calendar View** -- Monthly calendar showing tasks by due date with overdue highlighting
- **List View** -- Filterable and sortable task table with bulk delete
- Task types: Task, Bug, Feature, Improvement, Other
- Task priorities: Low, Medium, High
- Assign tasks to project members with due dates

### Comments & Discussion
- Threaded comments on tasks
- Polled every 10 seconds for near-real-time updates
- Comment history with user attribution

### Analytics Dashboard
- Task status distribution (bar chart)
- Task type breakdown (pie chart)
- Priority breakdown (progress bars)
- Project-level analytics

### Dark/Light Theme
- Full dark mode support
- Theme persistence via localStorage

### Landing Page
- Marketing page with interactive demo
- Features grid, pricing section, testimonials, FAQ

### Email Notifications
- Task assignment email sent immediately
- Due-date reminder email sent automatically if task is not completed

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (SPA)                         │
│  React + Redux Toolkit + Tailwind CSS + Clerk Provider      │
│  Vite Dev Server (dev) / Vercel Static (prod)               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS (Clerk JWT in Authorization header)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     API SERVER (Express)                     │
│  Clerk Middleware → Auth Check → Controller → Prisma ORM    │
│  Vercel Serverless Function (prod)                          │
└──────┬──────────────────────────────┬───────────────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐            ┌──────────────────┐
│  PostgreSQL   │            │     Inngest       │
│  (Neon)       │            │  Background Jobs  │
│               │            │  - Clerk sync     │
│  Users        │            │  - Email sending  │
│  Workspaces   │            │  - Due reminders  │
│  Projects     │            └──────────────────┘
│  Tasks        │
│  Comments     │
└──────────────┘
```

### Request Flow

1. Client sends request with `Authorization: Bearer <Clerk JWT>` header
2. `clerkMiddleware()` validates the JWT and attaches auth context to `req.auth()`
3. `protect` middleware extracts `userId` from `req.auth()`; returns 401 if unauthorized
4. Controller handler extracts `userId`, performs authorization checks (workspace admin, project lead, etc.)
5. Controller performs database operations via Prisma
6. Response is returned as JSON

### Data Flow (Frontend)

1. On login, `Layout.jsx` dispatches `fetchWorkspaces({ getToken })` to Redux
2. The thunk calls `GET /api/workspaces` with the Clerk JWT
3. Backend returns all workspaces with nested members, projects, tasks, comments, and assignees
4. Redux store is populated; `currentWorkspace` is set from localStorage or defaults to the first workspace
5. All subsequent data comes from the Redux store (no additional API calls for listing)
6. Mutations (create/update/delete) call the API and dispatch Redux actions for immediate UI updates

---

## Project Structure

```
flowio/
├── README.md
├── package.json                    # Root scripts (dev, build, start)
│
├── backend/
│   ├── package.json                # Backend dependencies
│   ├── server.js                   # Express entry point
│   ├── vercel.json                 # Vercel deployment config
│   ├── prisma.config.js            # Prisma config (unpooled DB URL for CLI)
│   ├── generate-client.js          # Prisma client generator script
│   │
│   ├── config/
│   │   └── db.js                   # Prisma client with Neon adapter
│   │
│   ├── prisma/
│   │   └── schema.prisma           # Database schema (models, enums, relations)
│   │
│   ├── generated/
│   │   └── prisma/                 # Auto-generated Prisma client
│   │
│   ├── middleware/
│   │   └── auth.middleware.js      # Clerk auth verification middleware
│   │
│   ├── routes/
│   │   ├── workspace.route.js      # Workspace routes
│   │   ├── project.route.js        # Project routes
│   │   ├── task.route.js           # Task routes
│   │   └── comment.route.js        # Comment routes
│   │
│   ├── controller/
│   │   ├── workspace.controller.js # Workspace handlers
│   │   ├── project.controller.js   # Project CRUD + members
│   │   ├── task.controller.js      # Task CRUD + Inngest events
│   │   └── comment.controller.js   # Comment add + list
│   │
│   ├── inngest/
│   │   └── index.js                # All Inngest functions (8 functions)
│   │
│   └── utils/
│       └── nodemailer.js           # Email sender via Brevo SMTP
│
├── frontend/
│   ├── package.json                # Frontend dependencies
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite + React + Tailwind config
│   ├── vercel.json                 # SPA rewrite rules
│   │
│   ├── public/                     # Static assets
│   │
│   └── src/
│       ├── main.jsx                # React entry (ClerkProvider, Redux, Router)
│       ├── App.jsx                 # Route definitions
│       ├── index.css               # Global styles (Outfit font, Tailwind)
│       │
│       ├── app/
│       │   └── store.js            # Redux store
│       │
│       ├── features/
│       │   ├── workspaceSlice.js   # Redux slice for workspaces/projects/tasks
│       │   └── themeSlice.js       # Redux slice for dark/light theme
│       │
│       ├── configs/
│       │   └── api.js              # Axios instance with baseURL
│       │
│       ├── assets/
│       │   └── assets.js           # Image imports + dummy data
│       │
│       ├── pages/
│       │   ├── AuthPage.jsx        # Clerk SignIn/SignUp
│       │   ├── Home.jsx            # Marketing landing page
│       │   ├── Layout.jsx          # Authenticated layout (sidebar + navbar)
│       │   ├── Dashboard.jsx       # Dashboard with stats and activity
│       │   ├── Projects.jsx        # Projects list with search/filter
│       │   ├── ProjectDetails.jsx  # Project detail with tabbed views
│       │   ├── TaskDetails.jsx     # Task detail with comments
│       │   └── Team.jsx            # Team members + invite
│       │
│       └── components/
│           ├── Navbar.jsx          # Top navbar (search, theme toggle, user)
│           ├── Sidebar.jsx         # Left sidebar navigation
│           ├── WorkspaceDropdown.jsx
│           ├── MyTasksSidebar.jsx
│           ├── ProjectsSidebar.jsx
│           ├── StatsGrid.jsx       # Dashboard stat cards
│           ├── ProjectOverview.jsx
│           ├── RecentActivity.jsx
│           ├── TasksSummary.jsx
│           ├── ProjectCard.jsx
│           ├── ProjectTasks.jsx    # Task table with filters + bulk delete
│           ├── ProjectCalendar.jsx # Calendar view
│           ├── ProjectAnalytics.jsx # Charts (bar, pie, priority)
│           ├── ProjectSettings.jsx # Project edit + delete
│           ├── CreateProjectDialog.jsx
│           ├── CreateTaskDialog.jsx
│           ├── AddProjectMember.jsx
│           └── InviteMemberDialog.jsx
```

---

## Database Schema

### Enums

| Enum | Values |
|---|---|
| `WorkspaceRole` | `ADMIN`, `MEMBER` |
| `TaskStatus` | `TODO`, `IN_PROGRESS`, `DONE` |
| `TaskType` | `TASK`, `BUG`, `FEATURE`, `IMPROVEMENT`, `OTHER` |
| `ProjectStatus` | `ACTIVE`, `PLANNING`, `COMPLETED`, `ON_HOLD`, `CANCELLED` |
| `Priority` | `LOW`, `MEDIUM`, `HIGH` |

### Models

#### User
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | Clerk user ID |
| `name` | String | |
| `email` | String | Unique |
| `image` | String | Default `""` |
| `createdAt` | DateTime | Default `now()` |
| `updatedAt` | DateTime | Auto-updated |

#### Workspace
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | Clerk organization ID |
| `name` | String | |
| `slug` | String | Unique |
| `description` | String? | Nullable |
| `settings` | Json | Default `{}` |
| `ownerId` | String | FK → User.id, cascade delete |
| `image_url` | String | Default `""` |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

#### WorkspaceMember
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | UUID, auto-generated |
| `userId` | String | FK → User.id, cascade |
| `workspaceId` | String | FK → Workspace.id, cascade |
| `message` | String | Default `""` |
| `role` | WorkspaceRole | Default `MEMBER` |

Unique constraint: `@@unique([userId, workspaceId])`

#### Project
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | UUID |
| `name` | String | |
| `description` | String? | |
| `priority` | Priority | Default `MEDIUM` |
| `status` | ProjectStatus | Default `ACTIVE` |
| `start_date` | DateTime? | |
| `end_date` | DateTime? | |
| `team_lead` | String | FK → User.id |
| `workspaceId` | String | FK → Workspace.id, cascade |
| `progress` | Int | Default `0` |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

#### ProjectMember
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | |
| `userId` | String | FK → User.id, cascade |
| `projectId` | String | FK → Project.id, cascade |

Unique constraint: `@@unique([userId, projectId])`

#### Task
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | UUID |
| `projectId` | String | FK → Project.id, cascade |
| `title` | String | |
| `description` | String? | |
| `status` | TaskStatus | Default `TODO` |
| `type` | TaskType | Default `TASK` |
| `priority` | Priority | Default `MEDIUM` |
| `assigneeId` | String | FK → User.id, cascade |
| `due_date` | DateTime | |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

#### Comment
| Field | Type | Notes |
|---|---|---|
| `id` | String (PK) | |
| `content` | String | |
| `userId` | String | FK → User.id, cascade |
| `taskId` | String | FK → Task.id, cascade |
| `createdAt` | DateTime | Default `now()` |

### Entity Relationships

```
User ──< WorkspaceMember >── Workspace (owned by User)
User ──< ProjectMember >── Project
User ──< Task (as assignee)
User ──< Comment

Workspace ──< Project
Project ──< Task
Task ──< Comment
```

---

## API Endpoints

All routes are prefixed with `/api` and require authentication via the `protect` middleware unless noted otherwise.

### Health Check

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Returns "Server Is Live" |
| GET | `/test-db` | No | Test database connection |

### Workspaces (`/api/workspaces`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List all workspaces for current user (with nested members, projects, tasks, comments) |
| POST | `/add-member` | Yes (Admin) | Add member to workspace. Body: `{ email, role, workspaceId, message }` |

### Projects (`/api/projects`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes (Workspace Admin) | Create project. Body: `{ workspaceId, name, description, status, priority, start_date, end_date, team_lead }` |
| PUT | `/:projectId` | Yes (Lead/Owner/Admin) | Update project |
| DELETE | `/:projectId` | Yes (Lead/Owner/Admin) | Delete project and all related tasks, comments, members |
| POST | `/:projectId/addMember` | Yes (Project Lead) | Add member to project |

### Tasks (`/api/tasks`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes (Project Lead) | Create task. Body: `{ projectId, title, description, status, type, priority, assigneeId, due_date }`. Triggers email notification via Inngest. |
| PUT | `/:id` | Yes (Lead or Member) | Update task. Only Lead can change title, assignee, due_date. |
| DELETE | `/:id` | Yes (Lead/Owner/Admin) | Delete task and all comments |

### Comments (`/api/comments`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes (Project Member/Lead) | Add comment to task. Body: `{ taskId, content }` |
| GET | `/:taskId` | Yes (Project Member/Lead) | Get all comments for a task |

### Inngest Endpoint

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/inngest/*` | No (Inngest signing key) | Inngest webhook receiver |

---

## Authentication & Authorization

### Authentication (Clerk)

- **Frontend:** `ClerkProvider` wraps the entire app with `VITE_CLERK_PUBLISHABLE_KEY`
- **Backend:** `clerkMiddleware()` from `@clerk/express` attaches auth context to every request
- **JWT Validation:** The `protect` middleware calls `req.auth()` to extract `userId`; returns 401 if missing
- **Organization Management:** Workspaces are Clerk Organizations. Creating a workspace triggers a `clerk/organization.created` webhook which syncs to the database via Inngest.

### Authorization (Role-based Access Control)

| Action | Required Role |
|---|---|
| Create Workspace | Clerk (built-in) |
| Add Workspace Member | Workspace Admin |
| Create Project | Workspace Admin |
| Update Project | Project Lead, Workspace Owner, or Workspace Admin |
| Delete Project | Project Lead, Workspace Owner, or Workspace Admin |
| Add Project Member | Project Lead |
| Create Task | Project Lead |
| Update Task (title/assignee/due_date) | Project Lead |
| Update Task (status/description/type/priority) | Project Lead or Project Member |
| Delete Task | Project Lead, Workspace Owner, or Workspace Admin |
| Add Comment | Project Member or Project Lead |
| View Comments | Project Member or Project Lead |

---

## Background Jobs (Inngest)

The backend hosts an Inngest endpoint at `/api/inngest` with 8 functions:

### Clerk Webhook Sync Functions

| Function | Trigger Event | Description |
|---|---|---|
| `sync-user-from-clerk` | `clerk/user.created` | Upserts user in PostgreSQL |
| `update-user-from-clerk` | `clerk/user.updated` | Updates user record |
| `delete-user-with-clerk` | `clerk/user.deleted` | Deletes user record |
| `sync-workspace-from-clerk` | `clerk/organization.created` | Creates workspace + Admin membership. Creates placeholder user if owner not found. |
| `update-workspace-from-clerk` | `clerk/organization.updated` | Updates workspace |
| `delete-workspace-with-clerk` | `clerk/organization.deleted` | Deletes workspace |
| `sync-workspace-member-from-clerk` | `clerk/organizationMembership.created` | Upserts workspace member |

### Email Notification Functions

| Function | Trigger Event | Description |
|---|---|---|
| `send-task-assignment-email` | `app/task.assigned` | Sends assignment email immediately, then sleeps until due date and sends a reminder if the task is not completed |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (Neon recommended)
- Clerk account (for authentication)
- Inngest account (for background jobs)
- Brevo or SMTP account (for emails)

### Installation

```bash
git clone <repo-url>
cd flowio
npm install
```

### Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Run in Development

```bash
# Both frontend + backend concurrently
npm run dev

# Or individually
npm run dev:backend    # Backend on port 5000
npm run dev:frontend   # Frontend on port 5173
```

### Build for Production

```bash
npm run build
```

### Start in Production

```bash
npm start
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Environment mode (`development`) |
| `PORT` | Server port (`5000`) |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side) |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `DATABASE_URL` | PostgreSQL connection string (pooled, for app) |
| `DATABASE_URL_UNPOOLED` | PostgreSQL connection string (unpooled, for Prisma CLI) |
| `INNGEST_EVENT_KEY` | Inngest event key |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `SENDER_EMAIL` | Email sender address |
| `SMTP_USER` | Brevo SMTP username |
| `SMTP_PASSWORD` | Brevo SMTP password |

### Frontend (`frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for client-side auth |
| `VITE_BASEURL` | Backend API base URL (e.g., `http://localhost:5000/api`) |

---

## Deployment

The Backend is deployed on **Vercel** at https://flowio-sigma.vercel.app

- **Backend:** Deployed as a Vercel serverless function via `@vercel/node`. The `process.env.VERCEL` check prevents `app.listen()` from running in serverless mode.
- **Frontend:** Deployed as a Vercel static site with SPA rewrite rules.
- **Database:** Neon handles PostgreSQL hosting with serverless driver.
- **Auth:** Clerk manages authentication in production.
- **Background Jobs:** Inngest processes webhook events and email notifications.

### Vercel Configuration

- `backend/vercel.json` -- Routes all requests to `server.js`, includes source directories in bundle
- `frontend/vercel.json` -- SPA rewrite rules (all routes rewrite to `/`)

---

## License

This project is private and not publicly licensed.
