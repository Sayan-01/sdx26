export type DocSection = {
  title: string;
  slug: string;
  description: string;
  content: string;
  items?: { title: string; slug: string }[];
};

export type DocCategory = {
  title: string;
  items: DocSection[];
};

export const DOCS_DATA: DocCategory[] = [
  {
    title: "Bootup",
    items: [
      {
        title: "Introduction",
        slug: "introduction",
        description: "Welcome to SDX26, the ultimate collaboration workspace for modern agencies.",
        content: `
          SDX26 is a specialized client collaboration hub designed to bridge the gap between web agencies and their clients. It centralizes project management, approvals, files, and feedback into a single, professional, and branded workspace.

          ## Why SDX26?
          In a world of scattered email threads, WhatsApp messages, and "final_v2_ACTUAL" file chaos, SDX26 provides a single source of truth.

          ### Core Pillars
          - **Transparency**: Clients see exactly what you are working on.
          - **Alignment**: Approvals are tracked with a clear audit trail.
          - **Efficiency**: Milestone-linked payments ensure you get paid on time.
          - **Branding**: A professional portal that makes your agency look world-class.
        `,
      },
      {
        title: "Why Choose SDX26",
        slug: "why-SDX26",
        description: "Understand the competitive edge SDX26 gives to your agency.",
        content: `
          SDX26 isn't just another project management tool like ClickUp or Trello. It's built specifically for the **agency-client relationship**.

          ## Solving Real Problems
          
          | Problem | SDX26 Solution |
          | --- | --- |
          | **Onboarding Friction** | Structured checklists for asset collection. |
          | **Approval Failures** | Formal approval flow with versioning. |
          | **Payment Lag** | Automated Polar.sh integration for milestones. |
          | **Scope Creep** | Dedicated Change Request Log. |

          ## Human API Syndrome
          Agency owners often act as "Human APIs," manually transferring data between clients and teams. SDX26 automates this flow, letting your team focus on creation while the platform handles the coordination.
        `,
      },
    ],
  },
  {
    title: "Agency Side",
    items: [
      {
        title: "Dashboard Overview",
        slug: "agency-dashboard",
        description: "Manage all your clients and projects from a single birds-eye view.",
        content: `
          The Agency Dashboard is your command center. It provides a multi-client overview where you can track progress across all active projects.

          ## Key Features
          - **Active Projects**: See status, upcoming deadlines, and progress bars.
          - **Client Management**: Quick access to client contact info and project history.
          - **Unified Activity Feed**: Monitor recent actions across all projects in real-time.
          - **Financial Overview**: Track pending vs. settled balances at a glance.

          ### Project States
          Projects move through four main states:
          1. **Active**: Work is currently in progress.
          2. **On Hold**: Waiting for client feedback or assets.
          3. **Completed**: All milestones paid and deliverables sent.
          4. **Archived**: Historical records for reference.
        `,
      },
      {
        title: "Projects Management",
        slug: "projects-management",
        description: "How to create, configure, and manage project workflows.",
        content: `
          Creating a project in SDX26 is designed to be lightning-fast.

          ## Creating a New Project
          1. Click **"New Project"** on the dashboard.
          2. Enter the **Project Name** and **Client Details**.
          3. Define the initial **Milestones**.
          4. **Invite the Client** via Magic Link.

          ### Configuration Options
          - **Privacy Settings**: Control which team members see which projects.
          - **Deadline Tracking**: Set hard deadlines that show up in the client portal.
          - **Branding**: Customize colors and logos for the specific client portal.
        `,
      },
      {
        title: "Milestones",
        slug: "milestones",
        description: "Breaking down complex projects into achievable, payable phases.",
        content: `
          Milestones are the backbone of your project timeline. Each milestone represents a significant phase of work (e.g., Discovery, UI Design, Development).

          ## Milestone Structure
          - **Title & Description**: Clear scope definition.
          - **Due Date**: When the client should expect delivery.
          - **Amount**: The payment linked to this milestone completion.
          - **Internal Tasks**: Granular tasks assigned to your team to complete the milestone.

          ### Status Lifecycle
          \`PENDING\` → \`IN_PROGRESS\` → \`IN_REVIEW\` → \`APPROVED\` → \`PAID\`

          > [!TIP]
          > Always link an amount to a milestone. This ensures the client understands that approval leads to payment.
        `,
      },
      {
        title: "File Upload & Approval",
        slug: "file-approvals",
        description: "Master project deliverables, staging preview links, milestone associations, and version control.",
        content: `
          SDX26 eliminates the "which version is this?" chaos with an enterprise-grade asset management and approval workflow designed specifically for modern agencies and their clients.

          ## 1. Supported Deliverable Types

          Agencies deliver a combination of static assets and interactive preview environments. SDX26 natively supports both:

          ### A. Binary Files & Documents
          - **Design Assets**: High-resolution PNGs, SVGs, JPGs, and raster exports.
          - **Documents & Specs**: PDFs, project briefs, architecture diagrams, and contracts.
          - **Archives & Packages**: ZIP, TAR, and RAR deliverables containing source files or asset bundles.
          - *Storage Metering*: Uploaded binary files are automatically tracked against your Agency Plan Quota (e.g., Starter vs. Pro storage limits).

          ### B. External Deliverable Links
          - 🌐 **Website Staging & Previews**: Live preview deployments (e.g., Vercel, Netlify, staging subdomains).
          - 🎨 **Figma Prototypes & Canvases**: Direct links to interactive Figma frames, design systems, and flows.
          - 🎥 **Loom & Video Walkthroughs**: Asynchronous video walkthroughs and client demo recordings.
          - 💻 **GitHub Branches & Pull Requests**: Code review and engineering deliverable links.
          - 🔗 **Cloud & Drive Links**: Google Docs, Notion deliverables, or external drives.
          - *Zero Storage Cost*: External links do not consume any agency storage limit (0 MB used).

          ---

          ## 2. Milestone Association

          Deliverables are directly coupled to project milestones:
          - **Milestone Assignment**: During upload, select which project milestone the asset satisfies (e.g., *Milestone #1: Wireframes & UX Flow*, *Milestone #2: Frontend Alpha*).
          - **General Assets**: Non-milestone resources can be tagged as *General Deliverables* (e.g., brand guidelines, meeting notes).
          - **Milestone Filters**: Agencies and clients can filter the files repository by milestone to see exactly what belongs to each sprint.

          ---

          ## 3. Semantic Versioning & Iterations (v1, v2, v3...)

          Prevent duplicate file clutter with in-place versioning for both files and links:

          - **Adding a New Version**: Click **+ New Version** on any existing file or link to release an updated deliverable.
          - **Change Notes**: Include a concise note describing what changed (e.g., *"v2: Adjusted responsive layout on tablet and updated checkout dark mode"*).
          - **Automatic Increments**: SDX26 increments the version number automatically (\`v1\` ➔ \`v2\` ➔ \`v3\`) and updates the active live link.
          - **Version History Audit Trail**: Clicking the version pill badge opens the full chronological audit trail with past versions, change notes, timestamps, authors, and 1-click links to inspect previous iterations.

          ---

          ## 4. The Review & Approval Lifecycle

          Every deliverable transitions through clear, color-coded review states:

          1. 🟡 **Uploaded** (\`UPLOADED\`): Deliverable is added by the agency and queued for client review.
          2. 🟣 **Under Review** (\`UNDER_REVIEW\`): Client or QA team is actively inspecting the asset or staging preview.
          3. 🟢 **Approved** (\`APPROVED\`): Client has verified and signed off on the deliverable.
          4. 🔴 **Revision Requested** (\`REVISION_REQUESTED\`): Client requested changes, prompting the agency to publish a new version.

          > [!TIP]
          > Linking deliverables to specific milestones ensures clients can review outputs in context before approving the milestone payment.

          ---

          ## 5. Client Portal Experience

          Clients access project assets through their secure, passwordless **Magic Link Portal** (\`/portal/[token]/files\`):
          - **No Account Barrier**: Instant, frictionless access via tokenized URLs.
          - **Direct Previews**: 1-click preview for external staging links and Figma canvases in a new tab.
          - **Direct Downloads**: Immediate file downloads for binary assets and archives.
          - **Status & Milestone Visibility**: Complete transparency into deliverable versions, authors, and milestone completion.

          ---

          ## 6. Live Non-Blocking Updates

          All file uploads, link creations, version updates, and deletions utilize **Optimistic & Live State Updates** combined with background Next.js server sync (\`router.refresh()\`). Changes appear instantly with zero page flicker and no hard browser reloads.
        `,
      },
      {
        title: "Onboarding System",
        slug: "onboarding-system",
        description: "Collect logos, credentials, and content without the chase.",
        content: `
          The Onboarding Checklist is the first thing a client sees. It ensures you have everything you need to start the project.

          ## Setup
          When a project is created, SDX26 generates a default checklist:
          - Logo (Vector format)
          - Brand Guidelines
          - Domain/Hosting Access
          - Website Copy

          ## The Workflow
          - **Client Uploads**: Client provides links or files for each item.
          - **Agency Review**: You mark items as **Approved** or **Rejected**.
          - **Progress Tracking**: A progress bar shows the client how close they are to "Project Start."
        `,
      },
      {
        title: "Team Management",
        slug: "team-management",
        description: "Organize your agency staff and assign them to the right projects.",
        content: `
          SDX26 supports multi-user collaboration with granular roles.

          ## Agency Roles
          - **Owner**: Full access to billing, project creation, and team management.
          - **Admin**: Can manage all projects but cannot access agency billing.
          - **Member**: Can only see projects they are assigned to.

          ### Assigning Members
          You can assign specific members to a project (e.g., assign a Designer and a Developer). This keeps their dashboard clean and focused only on the work they need to do.
        `,
      },
      {
        title: "Activity Feed",
        slug: "activity-feed",
        description: "A complete audit trail of every interaction in the project.",
        content: `
          The Activity Feed provides a chronological log of everything that happens within a project.

          ## What's Tracked?
          - File uploads and version changes.
          - Milestone status updates.
          - Client comments and approvals.
          - Payment confirmations.
          - Portal access logs (when the client logs in).

          ### Use Case: Accountability
          If a client claims they didn't see a file, the Activity Feed shows exactly when the file was uploaded and when the client last accessed the portal.
        `,
      },
      {
        title: "Payments",
        slug: "agency-payments",
        description: "Track invoices and payment status across all projects.",
        content: `
          SDX26 integrates with **Polar.sh** to handle payments seamlessly.

          ## Financial Tracking
          The Finance tab shows:
          - **Total Value**: The sum of all milestones.
          - **Amount Settled**: Funds already received.
          - **Pending Balance**: Invoiced but not yet paid.

          ### Polar Integration
          When a milestone is approved, a payment link is automatically generated via Polar.sh. Once the client pays, SDX26 receives a webhook and automatically marks the milestone as **PAID**.
        `,
      },
      {
        title: "Scope Creep Protection",
        slug: "scope-creep",
        description: "Handle out-of-scope requests with transparent cost & timeline proposals.",
        content: `
          Scope creep is the #1 killer of agency profit margins. SDX26 helps you protect your revenue with an audit-backed Change Request system.

          ## How It Works: Bi-Directional Flow

          Both **Agency and Client** can initiate Change Requests:

          ### Case A: Client Request
          1. **Client Request**: Client submits a request from the Client Portal (e.g., *"Add a coupon system to the website"*). Initial status: \`SUBMITTED\`.
          2. **Agency Review**: Agency assesses the request, selects the scope type (\`IN_SCOPE\` or \`NEW_REQUEST\`), defines the official proposed cost and estimated timeline impact.
          3. **Client Approval**: The proposal appears in the Client Portal as \`PENDING_CLIENT_APPROVAL\`. The client reviews the breakdown and can **Approve**, **Reject**, or **Request Revision**.
          4. **Auto-Conversion**: When the client approves, SDX26 automatically converts the request into a new Milestone under the project (status: \`CONVERTED\`).

          ### Case B: Agency Request
          1. **Agency Proposal**: Agency identifies an extra feature or out-of-scope deliverable (e.g., *"Add admin dashboard for an additional $300 and 5 extra days"*).
          2. **Official Proposal**: Agency logs the request in \`projects/[id]/scope\` with proposed cost and timeline impact, sending it directly for client review (\`PENDING_CLIENT_APPROVAL\`).
          3. **Client Approval**: Client approves in the portal, instantly converting it into a paid milestone.

          ## Three Golden Rules of Scope Management
          1. **Bi-directional Initiation**: Both Agency and Client can initiate change requests.
          2. **Agency Cost & Timeline Authority**: Only the Agency proposes the official cost and timeline; the Client explicitly approves, rejects, or requests revision.
          3. **Strict Single Conversion**: New milestones or tasks are generated only after approval, and strictly once. Rejected requests never create work.

          ## Change Request Lifecycle & Statuses
          - \`SUBMITTED\`: Client-submitted request awaiting Agency proposal.
          - \`NEEDS_REVISION\`: Client requested revision on the proposed cost or timeline.
          - \`PENDING_CLIENT_APPROVAL\`: Agency proposed official pricing & timeline, awaiting client response.
          - \`APPROVED\` / \`CONVERTED\`: Approved by client and auto-converted into an active project milestone.
          - \`REJECTED\`: Declined by client (no work or fee created).
          - \`CANCELLED\`: Cancelled by agency or client before approval.
        `,
      },
      {
        title: "Sending Magic Link",
        slug: "magic-link-sending",
        description: "How to invite clients and manage their access.",
        content: `
          SDX26 uses Magic Links for a frictionless client experience. No passwords required.

          ## How to Invite
          1. Go to **Project Details** → **Portal** tab.
          2. Click **"Send Invite"**.
          3. The client receives a branded email with their unique access link.

          ### Regenerating Links
          If a client loses their link or you want to rotate access:
          1. Navigate to \`projects/[id]/portal\`.
          2. Click **"Regenerate Link"**.
          3. The old link will be immediately invalidated, and a new one will be sent.
        `,
      },
    ],
  },
  {
    title: "Client Side",
    items: [
      {
        title: "Client Portal Overview",
        slug: "client-portal-overview",
        description: "The professional hub for your clients to track work and pay invoices.",
        content: `
          The Client Portal is a simplified, high-fidelity version of the dashboard designed specifically for non-technical users.

          ## What Clients See
          - **Project Progress**: A visual timeline of milestones.
          - **Pending Actions**: Clear alerts for things they need to approve or pay.
          - **Recent Activity**: Updates from your team.
          - **File Library**: Quick access to all approved deliverables.
        `,
      },
      {
        title: "Magic Link Access",
        slug: "client-access",
        description: "Frictionless login experience for clients.",
        content: `
          Clients don't need to create an account or remember a password.

          ## Access Steps
          1. Client receives an email from your agency.
          2. They click the secure button in the email.
          3. They are instantly authenticated and landed on their dashboard.

          ### Security
          Magic links are cryptographically secure and set to expire after 30 days of inactivity. They can be revoked by the agency at any time.
        `,
      },
      {
        title: "Onboarding Upload",
        slug: "client-onboarding",
        description: "How clients provide project assets.",
        content: `
          The onboarding checklist is the client's first task.

          ## How it works
          1. Clients see a list of items (e.g., Logo, Hosting).
          2. For each item, they can upload a file or provide a text link.
          3. Once they submit, the status changes to \`UPLOADED\`.
          4. They are notified once the agency approves the asset.
        `,
      },
      {
        title: "Reviewing Files & Deliverables",
        slug: "client-file-review",
        description: "The process for clients to inspect assets, preview staging links, and give feedback.",
        content: `
          Clients can review all shared deliverables directly in the portal (\`/portal/[token]/files\`).

          ## Deliverable Actions
          - **1-Click Previews**: Launch live staging websites, Figma prototypes, or Loom video walkthroughs in a new tab.
          - **File Inspection**: View high-resolution images, design exports, and PDF documents.
          - **Direct Download**: Download asset bundles and source files instantly.
          - **Version Inspection**: Click version badges (e.g. \`v1\`, \`v2\`) to view change logs and past iterations.
          - **Approval Status**: Track real-time status (\`UPLOADED\`, \`UNDER_REVIEW\`, \`APPROVED\`, \`REVISION_REQUESTED\`).
        `,
      },
      {
        title: "Approvals & Feedback",
        slug: "client-approvals",
        description: "Formalizing the sign-off process.",
        content: `
          Approvals in SDX26 are legally binding in the context of the project contract.

          ## Milestone Sign-off
          When all deliverables for a milestone are approved, the client is prompted to approve the milestone itself.
          
          ### Audit Trail
          Every approval is timestamped and logged in the Activity Feed, providing protection for both the agency and the client.
        `,
      },
      {
        title: "Milestone Tracking",
        slug: "client-milestones",
        description: "Transparency into project status.",
        content: `
          Clients can see the entire project roadmap from Day 1.

          ## The Timeline
          - **Past**: Completed and paid milestones.
          - **Present**: Current work in review.
          - **Future**: Upcoming phases and estimated dates.

          This visibility reduces "where are we?" emails by up to 80%.
        `,
      },
      {
        title: "Payments",
        slug: "client-payments",
        description: "Secure and easy milestone payments for clients.",
        content: `
          Payments are handled via a secure checkout powered by Polar.sh.

          ## Payment Flow
          1. Client clicks **"Pay Now"** on an approved milestone.
          2. They are redirected to a secure checkout page.
          3. They pay via Credit Card, Apple Pay, or Google Pay.
          4. Upon completion, they are redirected back to SDX26, and their status is updated instantly.
        `,
      },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      {
        title: "Roles & Permissions",
        slug: "roles-permissions",
        description: "Understanding access levels in SDX26.",
        content: `
          SDX26 uses a hybrid Role-Based Access Control (RBAC) system.

          ## Role Hierarchy
          
          | Role | Project Access | Financial Access | Admin Access |
          | --- | --- | --- | --- |
          | **Owner** | All | Yes | Full |
          | **Admin** | All | No | Limited |
          | **Member** | Assigned Only | No | None |
          | **Client** | Their Own Only | Yes (Own Only) | None |
        `,
      },
      {
        title: "Project Lifecycle",
        slug: "project-lifecycle",
        description: "The journey of a project from onboarding to completion.",
        content: `
          Every project follows a structured lifecycle to ensure success.

          ## The 5 Phases
          1. **Onboarding**: Collecting requirements and assets.
          2. **Execution**: Working through iterative milestones.
          3. **Review**: Client feedback and versioning loops.
          4. **Settlement**: Milestone approval and payment.
          5. **Delivery**: Releasing final assets and archiving.
        `,
      },
      {
        title: "File Versioning System",
        slug: "versioning-system",
        description: "How SDX26 handles revisions for both files and external preview links.",
        content: `
          SDX26 eliminates "v2_final_FINAL" confusion by managing all revisions in-place under a single deliverable entity.

          ## Key Versioning Principles
          - **Dual Support**: Works seamlessly for both binary files (PDFs, ZIPs, images) and external links (Figma, Staging previews).
          - **In-Place Updates**: Releasing an update increments the version (\`v1\` ➔ \`v2\`) without creating duplicate file clutter.
          - **Change Notes**: Each version includes a concise note (e.g., *"v2: Updated checkout dark mode and responsive layout"*).
          - **Audit Trail**: Full chronological history with timestamps, authors, and 1-click access to previous versions.
          - **Milestone Cohesion**: Deliverables remain anchored to their assigned milestone throughout all version iterations.
        `,
      },
      {
        title: "Approval Workflow",
        slug: "approval-workflow",
        description: "The logic behind the SDX26 sign-off engine.",
        content: `
          The approval workflow is designed to prevent bottlenecks.

          ## Logic Rules
          - A Milestone cannot be approved until all linked Files are approved.
          - A Payment cannot be initiated until a Milestone is approved (unless manual).
          - Approval generates a system-wide activity log entry.
        `,
      },
      {
        title: "Activity System",
        slug: "activity-system",
        description: "The internal engine that tracks every action.",
        content: `
          Every mutation in the SDX26 database triggers an Activity Log entry.

          ## Metadata Structure
          Logs aren't just text; they contain JSON metadata like:
          - \`userId\`: Who did it.
          - \`previousStatus\`: What it was.
          - \`newStatus\`: What it is now.
          - \`timestamp\`: Exactly when it happened.
        `,
      },
    ],
  },
  {
    title: "API & System",
    items: [
      {
        title: "Auth Flow",
        slug: "api-auth",
        description: "How SDX26 handles authentication.",
        content: `
          SDX26 uses a dual-auth system:
          - **Agency**: NextAuth.js (Auth.js) for email/password or OAuth.
          - **Client**: Custom JWT-based Magic Link session tracking.

          ## Verifying Magic Link
          \`POST /api/auth/magic-link/verify\`
          
          \`\`\`json
          {
            "token": "..."
          }
          \`\`\`
        `,
      },
      {
        title: "Project APIs",
        slug: "api-projects",
        description: "Technical reference for project endpoints.",
        content: `
          Manage projects programmatically.

          ### List Projects
          \`GET /api/projects\`
          
          ### Create Project
          \`POST /api/projects\`
          
          \`\`\`json
          {
            "name": "Project X",
            "clientEmail": "client@example.com"
          }
          \`\`\`
        `,
      },
      {
        title: "File APIs & Actions",
        slug: "api-files",
        description: "Technical reference for deliverable management, links, and versioning.",
        content: `
          Manage deliverables, external preview links, versions, and review statuses programmatically or via Server Actions.

          ### 1. Upload File or Deliverable Link
          \`uploadFile(projectId, data)\`
          
          \`\`\`typescript
          {
            fileName: "Staging Preview v1",
            fileType: "link/preview", // or "link/figma", "application/pdf", etc.
            url: "https://staging.domain.com",
            fileSizeBytes: 0, // 0 for external links (preserves storage quota)
            milestoneId?: string
          }
          \`\`\`

          ### 2. Publish New Version
          \`addFileVersion(fileId, projectId, data)\`
          
          \`\`\`typescript
          {
            url: "https://staging-v2.domain.com",
            changeNote: "Revised navigation and mobile layout"
          }
          \`\`\`

          ### 3. Update Review Status
          \`updateFileStatus(fileId, projectId, status)\`
          - Status values: \`UPLOADED\`, \`UNDER_REVIEW\`, \`APPROVED\`, \`REVISION_REQUESTED\`

          ### 4. Delete Asset
          \`deleteFile(fileId, projectId)\`
          - Permanently cleans up all child versions and unlinks associated messages.
        `,
      },
      {
        title: "Payment Integration (Polar)",
        slug: "api-payments",
        description: "How we integrate with Polar.sh for global payments.",
        content: `
          We use the @polar-sh/sdk to create ad-hoc checkout sessions for milestones.

          ## Logic
          1. Create a checkout for a specific milestone.
          2. Use metadata to link the Polar \`orderId\` to the SDX26 \`milestoneId\`.
          3. Listen for webhooks to confirm payment.
        `,
      },
      {
        title: "Webhooks",
        slug: "api-webhooks",
        description: "Subscribing to system events.",
        content: `
          SDX26 currently supports inbound webhooks from Polar.sh.

          ## Polar Webhook
          - **Endpoint**: \`/api/webhooks/polar\`
          - **Header**: \`webhook-signature\`
          - **Action**: Updates milestone and payment records on \`order.created\`.
        `,
      },
    ],
  },
];
