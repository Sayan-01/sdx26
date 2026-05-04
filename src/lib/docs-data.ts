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
        description: "Welcome to Milestack, the ultimate collaboration workspace for modern agencies.",
        content: `
          Milestack is a specialized client collaboration hub designed to bridge the gap between web agencies and their clients. It centralizes project management, approvals, files, and feedback into a single, professional, and branded workspace.

          ## Why Milestack?
          In a world of scattered email threads, WhatsApp messages, and "final_v2_ACTUAL" file chaos, Milestack provides a single source of truth.

          ### Core Pillars
          - **Transparency**: Clients see exactly what you are working on.
          - **Alignment**: Approvals are tracked with a clear audit trail.
          - **Efficiency**: Milestone-linked payments ensure you get paid on time.
          - **Branding**: A professional portal that makes your agency look world-class.
        `,
      },
      {
        title: "Why Choose Milestack",
        slug: "why-milestack",
        description: "Understand the competitive edge Milestack gives to your agency.",
        content: `
          Milestack isn't just another project management tool like ClickUp or Trello. It's built specifically for the **agency-client relationship**.

          ## Solving Real Problems
          
          | Problem | Milestack Solution |
          | --- | --- |
          | **Onboarding Friction** | Structured checklists for asset collection. |
          | **Approval Failures** | Formal approval flow with versioning. |
          | **Payment Lag** | Automated Polar.sh integration for milestones. |
          | **Scope Creep** | Dedicated Change Request Log. |

          ## Human API Syndrome
          Agency owners often act as "Human APIs," manually transferring data between clients and teams. Milestack automates this flow, letting your team focus on creation while the platform handles the coordination.
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
          Creating a project in Milestack is designed to be lightning-fast.

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
        description: "Master the deliverable review process with version control.",
        content: `
          Milestack eliminates the "which version is this?" problem with a robust file versioning and approval system.

          ## The Review Flow
          1. **Upload**: Agency uploads a deliverable (PDF, Image, Figma link) to a milestone.
          2. **Review**: Client receives a notification to review the file.
          3. **Action**: Client can **Approve**, **Request Changes**, or **Comment**.
          4. **Revision**: If changes are requested, the agency uploads a new version.

          ### Versioning
          Each file upload creates a version history. Clients are always shown the latest version by default but can browse previous versions for context.
          
          ### Auto-Approval Timer
          Agencies can set a 48-hour auto-approval window. If the client doesn't provide feedback within the window, the deliverable is automatically marked as approved.
        `,
      },
      {
        title: "Onboarding System",
        slug: "onboarding-system",
        description: "Collect logos, credentials, and content without the chase.",
        content: `
          The Onboarding Checklist is the first thing a client sees. It ensures you have everything you need to start the project.

          ## Setup
          When a project is created, Milestack generates a default checklist:
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
          Milestack supports multi-user collaboration with granular roles.

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
          Milestack integrates with **Polar.sh** to handle payments seamlessly.

          ## Financial Tracking
          The Finance tab shows:
          - **Total Value**: The sum of all milestones.
          - **Amount Settled**: Funds already received.
          - **Pending Balance**: Invoiced but not yet paid.

          ### Polar Integration
          When a milestone is approved, a payment link is automatically generated via Polar.sh. Once the client pays, Milestack receives a webhook and automatically marks the milestone as **PAID**.
        `,
      },
      {
        title: "Scope Creep Protection",
        slug: "scope-creep",
        description: "Handle out-of-scope requests without losing revenue.",
        content: `
          Scope creep is the #1 killer of agency profit margins. Milestack helps you manage it professionally.

          ## The Change Request Log
          When a client asks for something "extra":
          1. Log it in the **Scope Log**.
          2. Set an estimated cost and time.
          3. Send it to the client for approval.
          4. Once approved, it automatically converts into a new Milestone or Task.

          > [!NOTE]
          > This keeps the original project scope clean and ensures you are compensated for additional work.
        `,
      },
      {
        title: "Sending Magic Link",
        slug: "magic-link-sending",
        description: "How to invite clients and manage their access.",
        content: `
          Milestack uses Magic Links for a frictionless client experience. No passwords required.

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
        title: "Reviewing Files",
        slug: "client-file-review",
        description: "The process for clients to give feedback on deliverables.",
        content: `
          Clients can review work directly in the portal.

          ## Feedback Actions
          - **View**: Inspect high-res versions of designs or documents.
          - **Approve**: Confirm the version is final.
          - **Request Change**: Open a feedback thread to request adjustments.
          - **Comment**: General questions or context.
        `,
      },
      {
        title: "Approvals & Feedback",
        slug: "client-approvals",
        description: "Formalizing the sign-off process.",
        content: `
          Approvals in Milestack are legally binding in the context of the project contract.

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
          4. Upon completion, they are redirected back to Milestack, and their status is updated instantly.
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
        description: "Understanding access levels in Milestack.",
        content: `
          Milestack uses a hybrid Role-Based Access Control (RBAC) system.

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
        description: "How Milestack handles revisions and file history.",
        content: `
          Milestack solves the "v2_final" problem by grouping all revisions under a single file entity.

          ## How Versioning Works
          - Each upload to a file slot creates a new version (v1, v2, v3...).
          - The latest version is always the "Active" one.
          - Comments are linked to the specific version they were made on.
          - If a client approves v3, it is clearly marked as the approved version.
        `,
      },
      {
        title: "Approval Workflow",
        slug: "approval-workflow",
        description: "The logic behind the Milestack sign-off engine.",
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
          Every mutation in the Milestack database triggers an Activity Log entry.

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
        description: "How Milestack handles authentication.",
        content: `
          Milestack uses a dual-auth system:
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
        title: "File APIs",
        slug: "api-files",
        description: "Technical reference for file management.",
        content: `
          Handle uploads and status changes.

          ### Upload File
          \`POST /api/projects/:id/files\`
          
          ### Update Status
          \`PATCH /api/projects/:id/files/:fileId\`
          
          \`\`\`json
          {
            "status": "APPROVED"
          }
          \`\`\`
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
          2. Use metadata to link the Polar \`orderId\` to the Milestack \`milestoneId\`.
          3. Listen for webhooks to confirm payment.
        `,
      },
      {
        title: "Webhooks",
        slug: "api-webhooks",
        description: "Subscribing to system events.",
        content: `
          Milestack currently supports inbound webhooks from Polar.sh.

          ## Polar Webhook
          - **Endpoint**: \`/api/webhooks/polar\`
          - **Header**: \`webhook-signature\`
          - **Action**: Updates milestone and payment records on \`order.created\`.
        `,
      },
    ],
  },
];
