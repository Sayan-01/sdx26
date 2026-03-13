# Overall

# 🧠 Client Collaboration Platform — Final Product Plan

Name → Milestack

Tagline → The client collaboration workspace for modern web agencies.

> Description →
> 
> 
> Milestack is a client collaboration hub built for web design
> and development agencies.
> 
> Manage projects, approvals, files, and feedback in one place
> so your team and clients stay aligned from onboarding to launch.
> 

> Hero title → 
op 1: The structured workspace for agencies and their clients.
op 2: The SaaS Platform That Simplifies Agency–Client Collaboration
op 3: **The Professional Workspace Where Agencies and Clients Stay Aligned.**
> 

> Hero Description → 
- Milestack helps web design and development agencies manage client projects,
collect assets, share deliverables, gather feedback, and track
milestones — all inside one organized workspace.
- Stop losing projects to email threads and "final_v2" chaos. Milestack centralizes your onboarding, approvals, and milestone payments into one branded portal your clients will actually love to use.
> 

[Market validation](https://www.notion.so/Market-validation-322b5ca5dcfe809ab0c4cf84044c2eb2?pvs=21)

## 🎯 Problem

Agencies today work across too many disconnected tools:

| Problem | Current Mess |
| --- | --- |
| Operational Fragmentation | Agency owners pay for **single source of truth** |
| Onboarding friction | Logo, credentials chase করতে সপ্তাহ চলে যায়। |
| Approvals | Email back-and-forth with no audit trail |
| Milestone payment lag | Work done এবং invoice এর connection broken। |
| Client communication | WhatsApp, Email, Slack — everywhere |
| File management | Google Drive chaos, no version control |
| Feedback | Lost in email threads, no context |
| Project tracking | Notion/Trello not client-facing |
| Payments | Manual Stripe invoices, no milestone linking |

**The result:** Scattered context, missed feedback, slow approvals, and frustrated clients.

---

## ✅ Solution

A single platform where Agency Owners, Team Members, and Clients collaborate in one structured workspace — with role-based access, milestone-linked payments, and clear approval flows.

Our product solve

- Multiplatform dependency — project, time log, client, invoice (Operational Fragmentation)
- onboarding assets/file in on place
- Approval State management
- Milestone & payment log
- File management → solve ‘Final_v2’ chaos
- Decisions, approvals, asset versions track (History management)
- Handle feedback loop
- Human API Syndrome

Main pain point ranking:

| **Pain Point** | **Frequency Score** | **Severity Score** | **Willingness to Pay Score** | **Overall Priority** |
| --- | --- | --- | --- | --- |
| Operational Fragmentation | 10/10 | 9/10 | 10/10 | **Critical** |
| Onboarding Friction | 9/10 | 8/10 | 9/10 | **Critical** |
| Approval Failure | 7/10 | 10/10 | 8/10 | **High** |
| Milestone/Payment Lag | 8/10 | 7/10 | 7/10 | **High** |
| Visual File Chaos | 8/10 | 5/10 | 6/10 | **Medium** |

---

## 🚀 MVP Features

### 1. Multi-Client Dashboard

- Agency sees all active clients and projects in one view
- Project status at a glance (active, pending, completed)
- Quick access to milestones, files, and messages per project

---

### 2. Client Invitation via Magic Link

- Agency inputs: client name, email, project name
- System sends a branded invite email
- Client clicks the magic link → no signup required → lands directly on their project portal

---

### 3. Onboarding Checklist

Agency creates a checklist of required assets from the client. (problem: but all in one day create a homework effect so take time)

**Default checklist items:**
- Logo
- Brand Guidelines
- Hosting Access
- Domain Access
- Website Content
- Images

**Each item has a status:**
- `Pending` — not yet uploaded
- `Uploaded` — client uploaded, awaiting review
- `Approved` — agency confirmed

---

### 4. File Upload + Approval System

**Agency uploads deliverables (with vidual context) :**
- Design (pnd, jpg, figma link)
- Wireframes (PDF, link)
- Prototype links
- Documents (PDF, doc, link)

**Approval Window
-** Feature (e.g., a 48-hour auto-approval timer). 
- This forces clients to make decisions and protects the agency's timeline.

**Client actions on each file:**
- ✅ Approve
- 🔄 Request Change
- 💬 Comment

File statuses: `Uploaded → Under Review → Approved / Revision Requested`

**File Approval — কোন version approve হচ্ছে সেটা দেখাও**

> তোমার প্ল্যানে approve/request change আছে, কিন্তু client কোন version দেখছে সেটা কোথাও দেখানো নেই। রিসার্চে সবচেয়ে বড় ভয় হলো client ভুল করে পুরনো version approve করে দেয়। তাই প্রতিটা file এ "Version 3 of 3" এরকম label আর একটা simple version history দেখাও। এতে "v2_final_ACTUAL" এর সমস্যা আর হবে না।
> 

---

### 5. Milestone Tracking

Projects are broken into structured milestones:

| Milestone | Status | Due Date | Payment |
| --- | --- | --- | --- |
| 1. Wireframe | ✅ Approved | Mar 10 | $500 |
| 2. Design | 🔄 In Review | Mar 20 | $1,000 |
| 3. Development | ⏳ Pending | Apr 5 | $2,000 |
| 4. Launch | ⏳ Pending | Apr 15 | $500 |

Each milestone has:
- Title & description
- Status (`Pending / In Progress / In Review / Approved / Paid`)
- Due date
- Linked payment amount
- Attached files
- Context thread (comments)

---

### 6. Contextual Messaging

Threaded chat attached to each milestone, file, or task — not a general inbox.

**Example thread under “Homepage Design” milestone:**

```
Client:  Change the hero section font size
Agency:  Updated version uploaded ✓
Client:  Looks good, approved!
```

---

### 7. Activity Feed

A timestamped log of all project activity, visible to the agency.

```
10:21 AM  Client uploaded logo
11:02 AM  Agency uploaded wireframe
11:10 AM  Client approved Milestone 1
02:30 PM  Payment received — $500
```

Every project has an Activity tab — a running timeline of everything that happened. Works like a notification panel. No real-time, no WebSocket needed.
How it works:

Every action in the system →
User opens Activity tab →
Bell icon shows unread count →
User opens tab → all marked as read →

What shows in the panel:
What triggers an activity entry:

- Client uploaded onboarding file
- Owner approved onboarding item
- Milestone created / status changed
- File uploaded / approved / revision requested
- Comment / message added
- Payment made
- Project marked completed
- Team member uploaded file

---

### 8. Manual Payment Tracking

- Agency manually marks milestone payment status:
    - `Pending`
    - `Paid`
- Client sees payment status per milestone

---

### 9. Team Collaboration

Agency owner can add internal team members to a project.

**Team roles:**
- Designer
- Developer
- Project Manager/admin

---

### **10. Scope Creep Protection**

রিসার্চ বলছে agency দের বড় একটা সমস্যা হলো client ছোট ছোট request করতে থাকে, আর সেগুলো bill হয় না। তোমার প্ল্যানে এর কোনো সমাধান নেই। একটা simple "Change Request Log" যোগ করো যেখানে agency বলতে পারবে এটা "original scope এ আছে" নাকি "নতুন request।" এটা তোমাকে ClickUp আর Notion থেকে আলাদা করবে।

---

## 🔐 Roles & Permissions

### Role 1 — Owner (Agency Owner)

Full control over the workspace.

**Can:**
- Create and delete projects
- Invite clients and team members
- Add team members to agency (Settings → Team)
- Assign team members to specific projects
- Upload files and create milestones
- View and manage payments
- Approve and send updates to clients
- See everything

---

### Role 2 — Team Member (Developer / Designer)

Working access — no admin or financial permissions.

**Can:**
- View assigned projects and tasks
- Upload work files
- Reply to comments
- Update task/milestone status

**Cannot:**
- View payment details
- Manage client accounts
- Delete projects
- Approve milestones on behalf of client

---

### Role 3 — Client

Clean, simplified view of their own project only.

**Can:**
- View project progress and milestone status
- Upload assets (via onboarding checklist)
- Approve or request changes on files
- Comment on milestones and files
- Pay milestones (advanced)

**Cannot:**
- See internal team activity
- Manage team members or settings

---

## 🗺️ User Flows

### 1a. Owner Signup & Agency Creation

```
Visitor hits /signup
→ Enters: name, email, password
→ INSERT users (role=owner, agency_id=NULL)
→ Redirected to "Setup your agency" screen
→ Enters: agency name, logo
→ INSERT agencies (owner_id = new user's id)
→ UPDATE users (agency_id = new agency's id)
→ INSERT team_members (agency_id, user_id, role='owner')
→ Redirected to Dashboard (empty state)
```

> ⚠️ User তৈরি হয় আগে। Agency তৈরি হয় পরে। তারপর user-এর agency_id fill হয়।
> 

### 1b. Login flow

```
role=owner  → /dashboard (all projects visible)
role=team   → /dashboard (only projects WHERE user_id IN project_members)
role=client → Error: "Please use your Magic Link to access your portal"
```

---

### 2a. Owner Adds Team Member

```
Owner goes to Settings → Team (for invite team_member)
→ Enters: name, email, designation (designer, developer, HR, project_manager)
→ INSERT users (name, email, password=NULL, role=team, agency_id = owner's agency_id)
→ INSERT team_members (agency_id, user_id, role='member' designation)
→ System sends invite email to team member
→ Team member sets password → logs in → sees assigned projects
```

### 2b. Owner Assigns Team Member to Project

```
Owner goes to Project → Members (for assign team_member to project)
→ Selects team members from dropdown (multi-select)
→ Owner selects member + Assigns role (admin | team | viewer)
→ INSERT project_members (project_id, user_id, role)
→ Team members see this project in their dashboard
```

### তাহলে দুটো Table-এর কাজ

`team_members` — তোমার agency-র employee list
এরা তোমার agency-তে exist করে
Developer, Designer, PM — এখানেই add হয়
Agency Settings → Team এ দেখা যায়
কোনো project না দিলেও এরা agency-তে থাকে

শুধু দুটো প্রশ্নের উত্তর দেয় —

- আমার agency-তে কে কে আছে?
- কাউকে project-এ assign করার সময় dropdown-এ কাদের দেখাবো?

`project_members` — কে কোন project-এ কাজ করবে
team_members থেকে কাউকে pick করে
specific project-এ assign করা হয়
সেই project-এর files, milestones, messages দেখতে পাবে

শুধু একটা প্রশ্নের উত্তর দেয় —

- এই project-এ কে কে আছে?

---

### 3. Owner Creates Project & Invites Client

```
Owner clicks "New Project"
→ Enters: project name, client name, client email
→ INSERT users (name, email, password=NULL)
→ INSERT projects (agency_id, client_id, status=active)
→ INSERT magic_link (project_id, client_email, token, expires_at)
→ System sends invite email to client
```

---

### 4. Client Enters via Magic Link (No Signup)

```
Client receives email: "You've been invited to your project portal"
→ Client clicks Magic Link (/invite/:token)
→ SELECT magic_link WHERE token = :token
→ Check: expires_at not passed, used_at is NULL
→ UPDATE magic_link (used_at = now)
→ Client dashboard opens directly — no password, no signup
→ Client sees their project, onboarding checklist, milestones
```

---

### 5. Client Onboarding

```
Client sees checklist: Upload Logo, Brand Guidelines, Hosting Access...
→ Client uploads each file
→ UPDATE onboarding_items (status=uploaded, file_url)
→ INSERT activity_log ("Client uploaded Logo.png")
→ Owner gets notified
→ Owner reviews → marks each item Approved
→ UPDATE onboarding_items (status=approved)
```

---

### 6. Agency Executes Work

```
Owner/Team creates milestones: Wireframe → Design → Dev → Launch
→ INSERT milestones (project_id, title, due_date, amount, status=pending)
→ Team uploads deliverable files per milestone
→ INSERT files (project_id, milestone_id, uploader_id, status=uploaded)
→ UPDATE milestones (status=in_review)
→ INSERT activity_log
→ Client gets notified
```

---

### 7. Client Reviews

```
Client opens milestone → sees uploaded file
→ Takes action:

  [Approve]
  → UPDATE files (status=approved)
  → UPDATE milestones (status=approved)
  → INSERT payments (milestone_id, amount, status=pending)

  [Request Change]
  → UPDATE files (status=revision_requested)
  → INSERT messages (file_id, content="Change navbar to black")
  → Owner + Team get notified

  [Comment]
  → INSERT messages (milestone_id or file_id, content)
```

---

### 8. Revision Cycle

```
Team sees change request comment
→ Developer fixes issue
→ INSERT files (new version, status=uploaded)
→ UPDATE milestones (status=in_review)
→ INSERT activity_log
→ Client gets notified
→ Client reviews again → Approves
→ (back to step 7 Approve path)
```

---

### 9. Payment

```
Milestone approved → payments row created (status=pending)
→ Client sees "Pay Now" on milestone
→ Client pays (Stripe / Razorpay / manual)
→ UPDATE payments (status=paid, paid_at, invoice_url)
→ UPDATE milestones (status=paid)
→ INSERT activity_log ("Client paid Milestone 2 — Design")
```

---

### 10. Project Completion

```
All milestones status=paid
→ Final deliverables unlocked (Source Files, Live URL, Docs)
→ UPDATE projects (status=completed)
→ Owner can archive project
→ INSERT activity_log ("Project marked Completed")
```

---

## 🔮 Advanced Features (Post-MVP)

### Visual Design Feedback (Figma-style)

- Client clicks directly on an uploaded image to leave pinned comments
- Example: Click on hero section → “Increase font size here”
- Agency sees all pins on the image and resolves them

### Live Website Preview

- Agency shares a staging URL inside the portal
- Client can preview the live site in context without leaving the portal

### Secure Credential Vault

- Clients share sensitive credentials safely inside the platform
- Encrypted storage for: Hosting, Domain, Stripe, CMS, Analytics access
- Only the Owner role can view vault contents

### Stripe / Razorpay Integration

- Client pays milestone directly from the portal
- Auto-generates and downloads invoice
- Milestone status updates automatically on payment

---

## 🗄️ Database Schema (Core Tables)

| Table | Key Fields |
| --- | --- |
| `users` | id, name, email, password, role (owner |
| `agencies` | id, name, owner_id, logo_url, created_at |
| `team_members` | id, agency_id, user_id, role (owner, member), designation (designer, developer, HR, project_manager) |
| `project_members` | id, project_id, user_id, role (admin, member, viewer), added_at |
| `projects` | id, agency_id, client_id, name, status (active, completed, archived), created_at, updated_at |
| `onboarding_items` | id, project_id, label, status (pending, uploaded, approved), file_url, requested_by, updated_at |
| `milestones` | id, project_id, title, description, due_date, amount, status (pending, in_progress, in_review, approved, paid), created_at, updated_at |
| `files` | id, project_id, milestone_id, uploader_id, file_name, file_type, url, status(uploaded, in_review, approved, revision_requested),current_version_id, created_at, updated_at |
| `messages` | id, project_id, milestone_id, file_id, sender_id, content, created_at |
| `activity_log` | id, project_id, actor_id, action, is_read (default false), metadata (JSONB), entity_type, entity_id, created_at |
| `payments` | id, milestone_id, amount, status (pending, paid), paid_at, invoice_url |
| `magic_link` | id, project_id, client_email, token, expires_at, used_at |

---

## 🌐 Pages & Routes

### Public

| Route | Page |
| --- | --- |
| `/` | Landing / Marketing page |
| `/login` | Agency login |
| `/signup` | Agency registration |
| `/invite/:token` | Magic link client entry |

### Agency (Authenticated)

| Route | Page |
| --- | --- |
| `/dashboard` | Multi-client overview |
| `/projects` | All projects list |
| `/projects/new` | Create new project |
| `/projects/:id` | Project detail — milestones, files, activity |
| `/settings/team` | Agency team directory — add/remove members |
| `/projects/:id/members` | Assign agency members to this project |
| `/projects/:id/files` | File management |
| `/projects/:id/milestones` | Milestone tracker |
| `/settings` | Agency profile & billing |

### Client Portal (Magic Link Access)

| Route | Page |
| --- | --- |
| `/portal/:token` | Client dashboard entry |
| `/portal/:token/onboarding` | Upload required assets |
| `/portal/:token/milestones` | View milestones, approve, comment |
| `/portal/:token/files` | View & approve files |
| `/portal/:token/payments` | Pay milestones, download invoices |

---

## 🔌 API Endpoints

### Auth

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/magic-link/verify
```

### Projects

```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Clients & Invitations

```
POST   /api/projects/:id/invite          # Send magic link
GET    /api/projects/:id/client
```

### Agency Team (Settings)

POST /api/team/invite
GET /api/team
DELETE /api/team/:memberId

### Project Members (Project-level assignment)

```
GET    /api/projects/:id/team
POST   /api/projects/:id/team
DELETE /api/projects/:id/team/:memberId
```

### Onboarding

```
GET    /api/projects/:id/onboarding
POST   /api/projects/:id/onboarding
PATCH  /api/projects/:id/onboarding/:itemId
```

### Milestones

```
GET    /api/projects/:id/milestones
POST   /api/projects/:id/milestones
PATCH  /api/projects/:id/milestones/:milestoneId
DELETE /api/projects/:id/milestones/:milestoneId
```

### Files

```
GET    /api/projects/:id/files
POST   /api/projects/:id/files           # Upload
PATCH  /api/projects/:id/files/:fileId   # Approve / request change
DELETE /api/projects/:id/files/:fileId
```

### Comments

```
GET    /api/projects/:id/messages
POST   /api/projects/:id/messages
```

### Activity

```
GET    /api/projects/:id/activity
PATCH  /api/projects/:id/activity/read   # Mark all as read
```

### Payments

```
GET    /api/projects/:id/payments
POST   /api/projects/:id/payments/initiate
PATCH  /api/projects/:id/payments/:paymentId  # Mark as paid (manual)
GET    /api/projects/:id/payments/:paymentId/invoice
```

---

## 🛠️ Tech Stack (Recommended)

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | Next.js API Routes or Node.js (Express/Fastify) |
| Database | PostgreSQL (via Neon.db) |
| ORM | Prisma |
| Auth | Auth.js |
| File Storage | Uploadthings or AWS S3 |
| Payments | Stripe (global) + Razorpay (India) |
| Email | Resend or Postmark |
| Real-time | Supabase Realtime or Pusher (for activity feed & comments -> not present in MVP now.) |
| Deployment | Vercel (frontend) + Railway or Render (backend if separate) |

---

## ⚖️ Operational metrics

| Metric | Industry Impact |
| --- | --- |
| Client churn | 75–80% operational friction এর কারণে |
| Administrative overhead | 67% সময় context gathering |
| Response delay | 36 ঘন্টা reply না দিলে client হারানোর সম্ভাবনা |
| Onboarding delay | 2-14 দিন শুধু assets chase করতে |

---

## 📋 Build Priority

### Phase 1 — Core MVP

1. Auth (Agency signup/login)
2. Multi-client dashboard
3. Project creation + Magic Link client invite***
4. Onboarding checklist**
5. File upload + approval**
6. Milestones (create, track, status)
7. Contextual comments/messaging
8. Activity log
9. Manual payment tracking
10. Scope Creep Protection**

### Phase 2 — Growth Features

1. Stripe/Razorpay payment integration
2. Invoice generation & download
3. Team roles & permissions
4. Email notifications

### Phase 3 — Advanced

1. Visual design feedback (pinned comments on images)
2. Secure credential vault
3. Live website preview embed
4. Analytics dashboard for agency

---

*Plan version: 1.0 — Ready for development scoping and sprint planning.*