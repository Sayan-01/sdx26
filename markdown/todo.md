# 📋 SDX26 (Agency Client Portal) - Implementation & Launch Todo List

This file tracks the outstanding features, gaps, and steps required to launch the SDX26 MVP, along with the roadmap for post-launch AI features.

---

## 🚀 Core MVP Launch Gaps (Immediate Priority)

These features are either partially built (mocked) or missing completely, and must be resolved before the MVP launch.

### 1. 📂 Production-Ready File & Asset Uploads
- [ ] **Replace Mock S3 URL:** Change the simulated S3 URL (`simulatedUrl`) in [files-client.tsx](file:///d:/SAYAN-X/abc/sdx26/src/app/dashboard/projects/[id]/files/_components/files-client.tsx) and [portal-onboarding-client.tsx](file:///d:/SAYAN-X/abc/sdx26/src/app/portal/[token]/onboarding/portal-onboarding-client.tsx) with a real storage upload handler.
- [ ] **Integrate UploadThing/AWS S3:** Configure the existing `uploadthing` package in the backend API to securely store uploaded brand assets, logo files, and milestone deliverables.
- [ ] **Track File Sizes & Versions:** Ensure uploaded file metadata (size, version number, storage keys) is correctly saved in the `FileVersion` database model.
- [ ] **File Delete Action:** Complete the handler for the file deletion button (`Trash2`) on the files list.

### 2. 📝 Milestone Task Status Management
- [ ] **Complete/Update Task Actions:** Create server actions to update a task's status (`PENDING` ➔ `IN_PROGRESS` ➔ `COMPLETED`), change assignees, or adjust priority.
- [ ] **Delete Tasks:** Provide a mechanism for agency team members to delete mistakenly created tasks.
- [ ] **Interactive Status Checks:** Replace static task lists in the dashboard/project page with interactive checkboxes/controls to allow instant status updates.

### 3. 🕸️ Subdomain Routing Middleware
- [ ] **Next.js Subdomain Rewrites:** Implement `middleware.ts` at the root of the project to capture subdomain requests (`agency-slug.milestack.com`) and rewrite them to resolve the correct agency tenant context via `/api/internal/resolve-tenant`.
- [ ] **Local Testing Configuration:** Document how to configure dynamic subdomains locally (e.g., via `localhost` hosts file adjustment or `lvh.me`).

### 4. 🔑 Premium Magic Link UX & Delivery
- [ ] **HTML Email Layout:** Upgrade the text-only nodemailer notification templates in [sendPortalUrl.ts](file:///d:/SAYAN-X/abc/sdx26/src/lib/sendPortalUrl.ts) to premium HTML layouts with white-label agency branding and clearer call-to-action buttons.
- [ ] **Custom Link Verification UI:** Polish the verification loading state, ensuring it matches the premium visual identity.

---

## 💳 Billing & Tenant Management

Ensure subscription limits and payment processing operate smoothly for different agency tiers.

### 1. 💵 Polar Billing Dashboard
- [ ] **Subscriptions Management UI:** Add a billing section under [settings/page.tsx](file:///d:/SAYAN-X/abc/sdx26/src/app/dashboard/settings/page.tsx) where agency owners can check their current active plan (Starter vs Pro), view usage metrics (storage, members count), and access Polar's Customer Portal to manage subscriptions.
- [ ] **Webhook Validation:** Add secure signature verification to the Polar webhook route [route.ts](file:///d:/SAYAN-X/abc/sdx26/src/app/api/webhooks/polar/route.ts) to verify incoming payloads.

### 2. 🔐 Role-Based Access Enforcement
- [ ] **Team Member Permissions:** Restrict non-Owner roles (Team Members) from viewing or changing Billing settings, inviting/removing team members, or altering core agency configuration.
- [ ] **Isolation Audits:** Double-check client portals to verify that no client can access routes or files belonging to another project or agency.

---

## 🎨 UX Polish & Error Prevention

Fix broken links and incomplete views to guarantee a seamless client experience.

### 1. 🛠️ Broken / 404 Sidebar Navigation Links
- [ ] **Client Help Page:** Create `/portal/[token]/help` to guide clients through onboarding or explain how to submit deliverables.
- [ ] **Client Settings Page:** Create `/portal/[token]/settings` allowing clients to update their profiles, companies, and phone numbers.
- [ ] **Agency Support Page:** Create `/dashboard/support` (or point `/help` to an embedded widget like Crisp/Intercom).
- [ ] **Global Logout Handlers:** Create a `/logout` page or interception handler that triggers the NextAuth `signOut()` function and clears both NextAuth and Jose client session cookies.

### 2. 🔍 Real Search & Filters
- [ ] **Project Dashboard Search:** Wire up the search input and filters in the project overview list to search by client or project name.
- [ ] **Files Search & Filters:** Wire up the search input and filter button in [portal-files-client.tsx](file:///d:/SAYAN-X/abc/sdx26/src/app/portal/[token]/files/portal-files-client.tsx) to filter resources by milestone or uploader.

---

## 🤖 AI-Powered Features (Post-Launch Backlog)

The unique innovation layer that sets SDX26 apart. To be implemented incrementally after the core MVP launch.

- [ ] **AI Smart-Onboarding Chatbot:** Integrate an LLM chatbot (e.g., Gemini API) into the client portal to walk clients through checklists, answer agency workflow FAQs, and capture specific textual onboarding requirements.
- [ ] **Automated Status Reports:** AI action to generate weekly email summaries for clients by digesting milestone changes, completed tasks, and files uploaded.
- [ ] **Smart Task Suggester:** Suggest milestones and onboarding checklists based on the project description during project setup.
- [ ] **Asset Quality Inspector:** Automated inspection of client uploads (e.g., check logo resolution, verify image extensions, inspect document content using file-parsing libraries).
- [ ] **Predictive Delay Detector:** Alert agency owners about potential project delays based on historical response times of similar clients.

---

## ⚙️ Deployment & Launch Checklist

Preparation checklist for pushing the codebase to production:

- [ ] **Prisma Migrations:** Apply current database migrations to production (Neon PostgreSQL database).
- [ ] **Seed Base Plans:** Ensure default subscription plans (`starter`, `pro`) are seeded in the database.
- [ ] **Production Environment Variables:** Set up production keys for:
  - [ ] `DATABASE_URL` (Neon Production String)
  - [ ] `AUTH_SECRET` & `SESSION_SECRET`
  - [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (Production Callback URLs configured)
  - [ ] `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` (Production Callback URLs configured)
  - [ ] `EMAIL_USER` & `EMAIL_PASSWORD` (SMTP configuration for emails)
  - [ ] `POLAR_ACCESS_TOKEN` & `POLAR_WEBHOOK_SECRET` (Switch sandbox to Live mode)
  - [ ] `INTERNAL_SECRET`
  - [ ] `NEXT_PUBLIC_URL_DOMAIN` (Your custom domain)
  - [ ] `NEXT_PUBLIC_URL_SCHEME` (Set to `https://`)
  - [ ] `UPLOADTHING_TOKEN` (Real token for cloud storage)
- [ ] **Subdomain DNS Setup:** Configure wildcard DNS records (`*.milestack.com`) pointing to the hosting provider (e.g., Vercel) to enable subdomain tenant routing.
