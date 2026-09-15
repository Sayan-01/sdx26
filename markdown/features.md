# Project Features: SDX26 (Agency Client Portal)

A premium, white-label client portal and onboarding platform designed for agencies to streamline project kickoffs, asset collection, and client management.

---

## 🚀 MVP Features (Core Foundation)
- [ ] **Agency Dashboard**: Unified view of active projects, client status, recent activities, and upcoming deadlines.
- [ ] **Magic Link Access**: Secure, passwordless authentication for clients via unique project tokens.
- [ ] **Onboarding Checklists**: Dynamic requirement lists for clients to upload brand assets (logos, copy, credentials, links).
- [ ] **File Management**: Centralized repository for project-specific documents, categorized assets, and versioned deliverables.
- [ ] **Project Status Tracking**: Real-time progress bars and milestone management for transparent client visibility.
- [ ] **Internal Milestone Tasks**: Granular task management within milestones, assignable to specific agency team members.
- [ ] **Role-Based Access Control**: Distinct permissions for Agency Owners, Team Members, and Clients.

---

## 🤖 AI-Powered Features (The Innovation Edge)
- [ ] **AI Smart-Onboarding**: Intelligent assistant that guides clients through onboarding requirements and answers agency workflow FAQs.
- [ ] **Automated Status Reports**: AI generates concise weekly summaries of project progress based on completed tasks and milestones.
- [ ] **Smart Task Suggester**: Analyzes project briefs/descriptions to automatically recommend necessary onboarding items and milestone schedules.
- [ ] **Asset Quality Inspector**: AI-driven validation of uploaded assets (checking image resolution, format compliance, or copy completeness).
- [ ] **Predictive Delay Detection**: Identifies potential delivery bottlenecks based on historical response times and task completion velocity.

---

## ✨ Unique Features (Startup & Production Ready)
- [ ] **Dynamic Subdomain Routing**: Full white-label branding with `agency-slug.domain.com` for personalized client portals.
- [ ] **Live Collaboration Feed**: Real-time activity logs and instant notifications when clients submit assets or milestones advance.
- [ ] **Embedded Payment Workflows**: Seamless payment integration (Stripe / Polar) to collect deposits or milestone payouts directly in-portal.
- [ ] **Performance Analytics**: Agency operational metrics tracking kickoff velocity, time-to-delivery, and client response rates.
- [ ] **Robust Multi-Tenancy**: Enterprise database architecture with strict tenant isolation between agencies and projects.

---

### Why this is a Pro-Level Project:
1.  **Architecture:** Handles complex multi-tenancy and dynamic routing.
2.  **User Experience:** Solves a real-world pain point (onboarding friction) with a premium UI.
3.  **Monetization Potential:** Built as a SaaS-ready platform with clear value for B2B users.


## Users
[ ] Login, and agency creation workflow.
[ ] Agency Owner: Can create projects, invite clients, manage team members, view all project data.
[ ] Agency Team Member: Can view projects assigned to them, manage tasks, upload files, view client data.
[ ] Client: Can view projects assigned to them, upload files, view project data, receive notifications.

## Agency
[ ] Agency Dashboard: Unified view of active projects, client status, and upcoming deadlines.
[ ] Create, manage, delete projects. Each project will have its own unique token for access.
[ ] Add Team Members: Invite colleagues by email, assign roles (Owner, Member, Client), and manage seat allocations.
[ ] Activity logs: View and mark as read all activity logs.
[ ] Settings: Update agency profile picture, name, agency name(only owner), agency slug(only owner).

## Client
[ ] Access Project: Seamless access via secure project magic link token without needing an account setup.
[ ] Client Dashboard: High-level overview of project health, sprint progress bar, recent files, and immediate action items.
[ ] Onboarding: Configurable requirement lists per project (logos, copy, links, assets), status tracking, and AI-powered guidance.
[ ] Milestones: 
[ ] Files: Upload files to the project, each file can be assigned a category (logo, copy, credentials).
[ ] Payments: make a payment for the milestone, each payment can be assigned a milestone and amount.

## Projects
[ ] Manage Project: Create a new project with a unique token. -> clients can access project using this token (special magic link).
[ ] Add Milestones: Add milestones to the project, each milestone can have multiple tasks, each task can have multiple subtasks.
[ ] Manage Team: Add team members to the project, each team member can be assigned a role (owner, member, client).
[ ] Manage Files: Upload files to the project, each file can be assigned a category (logo, copy, credentials).
[ ] Manage Tasks: Manage tasks, each task can be assigned a status (pending, in-progress, completed).

