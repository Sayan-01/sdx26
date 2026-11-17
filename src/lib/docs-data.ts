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
        description: "Welcome to SDX26, the modern collaboration workspace and client portal for agencies.",
        content: `
          SDX26 is a specialized client collaboration hub designed to bridge the gap between creative/software agencies and their clients. It centralizes project management, deliverables, versioning, onboarding checklists, formal change requests, milestone-linked payments, and real-time activity auditing into a single branded portal.

          ## Why SDX26?
          In a world of scattered email threads, frantic WhatsApp messages, disputed verbal sign-offs, and "final_v2_ACTUAL.png" file chaos, SDX26 provides a single source of truth for both agencies and their clients.

          ### Core Pillars
          - **Transparency**: Clients see live milestone timelines, approved deliverables, and upcoming work with zero login friction.
          - **Alignment**: Approvals and change requests are recorded with a legally verifiable audit trail.
          - **Cashflow Security**: Automated milestone-linked checkouts powered by Polar ensure agencies get paid before deliverables unlock.
          - **Professional Authority**: A sleek, dark-mode, white-label client portal that elevates agency reputation and commands premium rates.
          - **Tenant Isolation**: Strict multi-tenant data boundaries protecting internal team chatter, developer margins, and agency financials from client visibility.

          ## Who is SDX26 for?
          - **Web & Mobile Development Agencies**: Shipping staging URLs, GitHub PR previews, and production builds with milestone sign-offs.
          - **UI/UX & Product Design Studios**: Sharing interactive Figma prototypes, versioned artboards, and design system specs.
          - **Branding & Marketing Agencies**: Collecting client brand assets, logos, and copy without chasing via email.
          - **Freelancers & Independent Creators**: Delivering client projects with professional white-label portals, structured onboarding, formal scope protection, and milestone-linked checkouts.
        `,
      },
      {
        title: "Why Choose SDX26",
        slug: "why-SDX26",
        description: "Understand the competitive edge SDX26 gives to modern agencies.",
        content: `
          SDX26 isn't just another internal task tracker like ClickUp, Asana, or Trello. It is purpose-built to solve the fragile, high-stakes **agency-client relationship**.

          Most agencies lose 15-25% of their billable hours and profit margins not on design or code, but on communication friction, lost files, payment delays, and scope creep.

          ## Solving Real Agency Problems

          | Operational Challenge | The Status Quo Chaos | The SDX26 Solution |
          | --- | --- | --- |
          | **Onboarding Delays** | Endless back-and-forth emails chasing logos, brand guidelines, and copy. | Interactive client onboarding checklists with structured upload slots and instant validation. |
          | **Version Control Nightmares** | Confusion over "final_v2_FINAL_actual.png" scattered across Drive and WeTransfer. | Automated version numbering (v1, v2, v3) with unified file history and review statuses. |
          | **Informal Approval Disputes** | Casual "Looks good!" texts on WhatsApp, followed weeks later by disputed sign-offs. | Formal 1-click approvals with timestamped audit trails and actionable revision requests. |
          | **Uncontrolled Scope Creep** | "Can you just tweak this one small thing?" eating into profit margins. | Dedicated Change Request Log that quantifies cost and timeline impacts and converts extras into paid milestones. |
          | **Late Payments & Cashflow Lag** | Waiting 30-60 days for invoices to clear or releasing work before getting paid. | Milestone-linked automated checkouts (Polar.sh) that secure payments before deliverables are unlocked. |
          | **Fragmented Communication** | Critical feedback buried across email threads, Slack DMs, WhatsApp, and Zoom notes. | Contextual discussions pinned directly to specific deliverables, milestones, and project files. |
          | **Client Login Friction** | Clients forgetting passwords, abandoning complex dashboards, and reverting to email. | Frictionless Magic Link authentication—clients log in securely with a single click from their inbox. |
          | **Progress Uncertainty & Anxiety** | Clients frantically calling or texting "What's the status on our project?" | Transparent client portals with live progress bars, upcoming milestones, and real-time activity feeds. |
          | **Amateur Multi-Tool Jumble** | Cobbling together 6+ disconnected tools (Notion + Drive + Stripe + DocuSign) that look unprofessional. | A single, branded, white-label client portal that elevates agency authority and commands premium rates. |
          | **Accidental Information Leaks** | Clients accidentally seeing internal team margins, developer rants, or subcontractor rates. | Strict dual-sided permission boundaries separating internal agency boards from curated client portal views. |

          ## Deep Dive: The Core Operational Pillars

          ### 1. Eliminating Asset Collection Bottlenecks
          Every agency knows the feeling of a kickoff meeting that is immediately followed by three weeks of silence while waiting for client assets. SDX26 replaces vague email requests with clear, itemized onboarding checklists. Clients see exactly what files, dimensions, and credentials are required, complete with status tags ([STATUS:PENDING], [STATUS:IN_REVIEW], [STATUS:APPROVED]).

          ### 2. Bulletproof Version Control & Contextual Review
          When feedback is scattered across email replies, designers waste hours wondering if they are addressing feedback on the latest revision. With SDX26, every upload creates an immutable version history. Threaded discussions remain permanently attached to the specific asset version, eliminating confusion once and for all.

          ### 3. Defeating Scope Creep with Formal Change Requests
          Small unbilled favors are the silent killer of agency profitability. SDX26 gives project managers a formal Change Request system. When a client requests features outside the agreed-upon scope, the agency logs the estimated cost and timeline impact. Once the client approves, it automatically converts into a new payable milestone.

          ### 4. Milestone-Linked Cashflow Automation
          Cash flow is the lifeblood of any growing agency. Traditional net-30 terms create unnecessary financial risk. SDX26 links delivery milestones directly to payment releases. Clients can review progress and settle invoices through modern, global payment methods before final code or master assets are handed over.

          ### 5. Passwordless Client Portals via Magic Links
          The #1 reason clients stop using traditional project portals is password friction. Forcing busy clients to remember a 16-character password or undergo multi-step resets leads them straight back to emailing attachments. SDX26 uses secure, time-sensitive Magic Links: clients click directly from their notification email and are instantly logged into their dedicated workspace without ever typing a password.

          ## The "Human API" Syndrome
          Agency founders and senior project managers frequently find themselves acting as "Human APIs"—spending 60% of their workday manually moving messages, files, and updates between clients and internal team members.

          SDX26 acts as your automated operating system:
          - Automatically updates clients when files are uploaded or revised.
          - Keeps internal teams informed when approvals are granted or feedback is posted.
          - Logs every action into a transparent real-time activity feed.
          - Frees agency leadership to focus on high-value creative strategy and business growth.
        `,
      },
      {
        title: "Quickstart Guide",
        slug: "quickstart-guide",
        description: "Zero to client-ready in 5 minutes: set up your agency, create a project, and invite your first client.",
        content: `
          Follow this fast-track guide to get your agency fully operational with SDX26 in under 5 minutes.

          ## Step 1: Create Your Agency Workspace
          1. Sign up or log in via email/password or OAuth (Google / GitHub).
          2. When prompted, enter your **Agency Name** (e.g. *Acme Digital Studio*) and choose your unique **Workspace Slug** (e.g. *acme-digital*).
          3. Upload your agency logo to white-label your workspace and outgoing client portals.

          ## Step 2: Create Your First Project
          1. Navigate to the **Projects** tab from your Agency Dashboard.
          2. Click the **"New Project"** button in the top right.
          3. Fill in the project essentials:
             - **Project Name**: e.g., *SaaS Landing Page Redesign*
             - **Focus Area & Description**: e.g. Strategy, UI/UX and Asset Delivery.
             - **Client Name & Email**: Primary client stakeholder contact details.
          4. Click **Create Project**. A secure client portal Magic Link is automatically sent to the client's email address, and a default onboarding checklist is created.

          ## Step 3: Define Milestones & Internal Tasks
          1. In your new project, navigate to the **Milestones** tab.
          2. Click **"Add Milestone"** to structure the project phases:
             - Phase 1: *Discovery & Brand Guidelines* ($1,500)
             - Phase 2: *High-Fidelity Figma Prototypes* ($3,000)
             - Phase 3: *Next.js Frontend & Production Launch* ($4,500)
          3. Under each milestone, add internal tasks (e.g. *Setup Tailwind theme*, *Implement auth flow*) and assign them to specific agency team members.

          ## Step 4: Configure Onboarding Items
          1. Open the **Onboarding** tab within the project.
          2. Review the default asset checklist or add custom upload items:
             - Vector SVG Logo & Favicon
             - Typography & Brand Color Palette
             - Staging Server & Hosting Credentials
             - Approved Marketing Copy / Content Deck
          3. Clients will be prompted to submit these assets the moment they log in.

          ## Step 5: Add Team Members & Assign Project Collaborators
          1. Head to the **Team** section in your dashboard (\`/dashboard/team/invite\`) to invite agency colleagues by name, email, role (\`TEAM\` or \`OWNER\`), and designation (\`DEVELOPER\`, \`DESIGNER\`, \`PROJECT_MANAGER\`, etc.).
          2. Open the specific project and navigate to the **Members** tab (\`/dashboard/projects/[id]/members\`).
          3. Click **"Add Member"**, choose a colleague from your agency roster, and select their project role (\`OWNER\`, \`MEMBER\`, or \`VIEWER\`).
          4. Assigned team members can now access the project, view their assigned milestone tasks, and collaborate on deliverables.

          > [!TIP]
          > The client portal invitation link has already been sent automatically to the client's email upon project creation (valid for 7 days). If the link expires or needs rotation, the Agency Owner can regenerate and resend a new link at any time from the project's **Portal** tab (\`/dashboard/projects/[id]/portal\`). You can also click **"Preview Portal"** to inspect the live client view.
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
        description: "Manage all your clients, active projects, team activities, and financial health from a single command center.",
        content: `
          The Agency Dashboard is your command center. It provides an immediate overview of active project workloads, pending client sign-offs, milestone completion velocity, and outstanding client payments.

          ## Key Metric Cards
          - **Active Projects**: Total count of client projects currently in progress ([STATUS:ACTIVE]).
          - **Pending Approvals**: Milestones with deliverables currently queued for client review and sign-off ([STATUS:IN_REVIEW]).
          - **Completed Milestones**: Total milestones across all projects that have been successfully accepted and finished ([STATUS:APPROVED] or [STATUS:PAID]).
          - **Payment Pending**: Real-time dollar amount of unpaid milestone balances awaiting client checkout.
            > [!NOTE]
            > For agency team members (non-owners), this fourth card automatically adapts to display **My Tasks Due**, tracking unfinished internal tasks assigned to them.

          ## Project Statuses
          Projects transition through five distinct states:
          1. [STATUS:PENDING]: Newly created project awaiting client onboarding or kickoff.
          2. [STATUS:ACTIVE]: Work is actively underway; milestones and deliverables in progress.
          3. [STATUS:ON_HOLD]: Temporarily paused pending client feedback, asset submissions, or invoice clearance.
          4. [STATUS:COMPLETED]: All milestones delivered, fully paid, and accepted by the client.
          5. [STATUS:ARCHIVED]: Read-only historical record retained for reference and portfolio auditing.

          ## Dashboard Sections
          - **Header & Quick Actions**: Shows personalized greeting, user role, and **+ New Project** button.
          - **Recent Projects**: Quick access to active workspaces with client details, live progress bars, and status badges.
          - **Recent Activity**: Live audit stream of the latest 5 agency/client actions (logins, scope changes, updates) with a link to full activity history.
        `,
      },
      {
        title: "Projects Management",
        slug: "projects-management",
        description: "How to create, configure, filter, and manage project workflows.",
        content: `
          Creating and managing projects in SDX26 is optimized for agency velocity.

          ## Creating a New Project
          1. Click **"New Project"** on the dashboard.
          2. Enter the **Project Name** and optional **Description**.
          3. Select or invite the **Client** (Name, Company, and Email).
          4. Set a **Target Delivery Date**.
          5. Save to automatically generate a dedicated project workspace, client portal token, and default onboarding checklist.

          ## Project Tabs
          Inside any project view, agencies have access to six dedicated sub-tabs:
          - **Overview**: High-level timeline, next milestones, and recent client activity.
          - **Milestones & Tasks**: Structured phases, deliverables, internal task lists, and contextual comments.
          - **Files & Links**: Central asset repository supporting binary files, Figma embeds, staging links, and semantic version history.
          - **Scope (Change Requests)**: Bi-directional log of scope adjustments, pricing proposals, and client approvals.
          - **Onboarding**: Dynamic checklist of prerequisite client assets and review statuses.
          - **Members**: Assign agency team members, designate project roles, and manage access privileges.
          - **Portal**: Manage client access, view login activity, and generate or revoke Magic Links.
        `,
      },
      {
        title: "Milestones",
        slug: "milestones",
        description: "Breaking down complex projects into achievable, payable delivery phases.",
        content: `
          Milestones are the structural backbone of every project in SDX26. Each milestone represents a major contract phase (e.g., Discovery, Wireframes, Alpha Development, Production Launch).

          ## Milestone Structure
          - **Title & Description**: Detailed breakdown of scope and client deliverables for this phase.
          - **Target Due Date**: Expected delivery date rendered on the client portal roadmap.
          - **Linked Payout Amount**: The dollar amount tied to milestone sign-off.
          - **Internal Tasks**: Granular team tasks required to complete the milestone.
          - **Contextual Discussions**: Pinned threaded messaging between agency staff and clients.

          ## Milestone Status Lifecycle
          Every milestone progresses through five automated states:
          1. [STATUS:PENDING]: Scheduled phase not yet started.
          2. [STATUS:IN_PROGRESS]: Agency team is actively working on internal tasks and deliverables.
          3. [STATUS:IN_REVIEW]: Deliverables uploaded; awaiting formal client review and sign-off.
          4. [STATUS:APPROVED]: Client has approved deliverables and signed off on the milestone phase.
          5. [STATUS:PAID]: Milestone payment settled via Polar.sh checkout or marked as paid.

          > [!TIP]
          > Always specify a linked amount for major milestones. This creates clear financial expectations and prevents clients from requesting work beyond their current payment phase.
        `,
      },
      {
        title: "Milestones, Tasks & Discussions",
        slug: "milestone-tasks",
        description: "Manage milestone deliverables, internal actionable tasks, progress velocity, and contextual discussions in one unified hub.",
        content: `
          The **Milestones, Tasks & Discussions** view (\`/dashboard/projects/[id]/milestones\`) is your agency's sprint execution center. It unifies milestone deliverables, team tasks, budget tracking, and real-time feedback.

          ## Top Overview Metrics
          - **Milestones**: Ratio of completed phases versus total planned milestones (e.g., *0/1 completed*).
          - **Work Breakdown**: Real-time count of finished tasks versus active sprint tasks (e.g., *1/1 tasks done*).
          - **Total Phase Budget**: Cumulative dollar allocation linked to the defined project milestones.
          - **Discussions**: Total volume of client and team comments logged across milestones.

          ## 1. Actionable Tasks Tab
          Internal tasks break down high-level milestones into manageable engineering and design steps:
          - **Task Title & Description**: Clear scope for individual deliverables.
          - **Priority Levels**:
            - 🟢 \`LOW\`: Minor tweaks and secondary polish.
            - 🟡 \`MEDIUM\`: Standard sprint tasks and features.
            - 🔴 \`HIGH\`: Critical blockers and prerequisite architecture.
          - **Status Workflow**: Checkbox toggles between [STATUS:PENDING], [STATUS:IN_PROGRESS], and [STATUS:COMPLETED].
          - **Assignees**: Assign tasks to specific project members with avatar indicators.
          - **Task Progress Bar**: Visual completion percentage dynamically updated as tasks are checked off.

          ## 2. Discussion & Feedback Tab
          Every milestone contains a dedicated discussion channel attached directly to the work:
          - **Contextual Communication**: Eliminates scattered Slack messages, WhatsApp texts, or email threads by keeping feedback anchored to the exact milestone.
          - **Author Badges & Timestamps**: Messages display author avatars, role badges (\`OWNER\`, \`TEAM\`), and relative timestamps (e.g., *less than a minute ago*).
          - **Inline Composer**: Quickly compose feedback or milestone updates with keyboard shortcut support (\`Ctrl + Enter\` to send).
          - **Cross-Sync**: Comments posted here sync directly with the client portal's milestone discussion tab for transparent client-agency alignment.

          ## Separation of Concerns: Internal vs. Client View
          - **Internal Tasks** remain private to agency team members to prevent information leaks (e.g., developer bugs or internal debate).
          - **Milestone Discussions** keep stakeholders aligned on high-level progress and deliverables.
        `,
      },
      {
        title: "Project Team & Collaborators",
        slug: "project-team-assignment",
        description: "Assign specific agency team members to projects and configure granular project roles.",
        content: `
          Keep team member dashboards clean and secure by assigning staff only to the projects they are actively working on.

          ## Agency Staff vs. Project Members
          - **Agency Team**: The global roster of employees and subcontractors in your agency workspace (\`/dashboard/team\`).
          - **Project Members**: The curated sub-team assigned to execute a specific project (\`/dashboard/projects/[id]/members\`).

          ## Project Roles & Permissions
          When adding an agency member to a project, you can assign them one of three project roles:
          - **Project Owner**: Full control over project milestones, change requests, files, onboarding items, and client settings.
          - **Project Member**: Can create and update tasks, upload deliverables, publish new file versions, and participate in client discussions.
          - **Project Viewer**: Read-only access to milestones, files, and activity logs. Ideal for external contractors or senior leadership oversight.

          ## Professional Designations
          SDX26 supports clear designations to clarify roles to your team:
          - \`FOUNDER\`: Agency principal or executive sponsor.
          - \`PROJECT_MANAGER\`: Client liaison and timeline owner.
          - \`DEVELOPER\`: Fullstack, frontend, or backend engineer.
          - \`DESIGNER\`: UI/UX, product, or visual designer.
          - \`HR\`: Talent or resource manager.
          - \`OTHER\`: Custom specialist (Copywriter, QA, SEO).

          > [!NOTE]
          > Team members only see assigned projects in their dashboard project list. Agency Owners always retain master visibility over all agency projects.
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
        `,
      },
      {
        title: "Onboarding System",
        slug: "onboarding-system",
        description: "Collect logos, credentials, copy, and brand assets without the endless email chase.",
        content: `
          The Onboarding Checklist is the first experience a client has upon entering their portal. It ensures your agency receives prerequisite materials before billable kickoff commences.

          ## Default Asset Requirements
          When a project is created, SDX26 populates a recommended onboarding template:
          - Vector Logo (.SVG or .AI master files)
          - Brand Style Guide & Color Palette
          - DNS / Domain Registrar & Hosting Credentials
          - Approved Website Copy or Product Architecture Brief

          ## Managing Checklist Items
          Agency managers can easily customize checklist items from \`/dashboard/projects/[id]/onboarding\`:
          - **Add Custom Item**: Click **"Add Requirement"** to specify bespoke assets (e.g., *Stripe API Test Keys*, *Product Photography Pack*).
          - **Review Submissions**: When a client uploads a file or shares a credential link, the item updates to [STATUS:UPLOADED].
          - **Approval / Rejection Loop**:
            - Click **Approve** to mark the requirement as fulfilled ([STATUS:APPROVED]).
            - Click **Reject** if the asset fails quality checks (e.g., low-resolution JPG instead of vector SVG), with an optional guidance note prompting the client to re-upload.
          - **Kickoff Progress Bar**: Both agency and client views feature a real-time completion bar showing exact onboarding readiness (e.g., *3/4 Items Approved - 75%*).
        `,
      },
      {
        title: "Team Management",
        slug: "team-management",
        description: "Organize your agency staff, audit member statuses, and export team rosters.",
        content: `
          Manage your agency roster across projects from the centralized Team hub (\`/dashboard/team\`).

          ## Agency Member Roles
          - **Owner**: Complete administrative control over agency billing, Polar subscriptions, plan upgrades, workspace settings, project deletion, and team invitations.
          - **Team Member**: Access to assigned projects, milestones, tasks, deliverable uploads, and client messaging. Cannot modify agency billing or delete the workspace.

          ## Key Team Features
          - **Unified Member Table**: View member avatars, names, emails, roles, professional designations, joined dates, and invitation statuses.
          - **Instant Member Search**: Live filter team members by name or email.
          - **Permissions Dialog**: Modify any member's role (\`OWNER\` vs \`TEAM\`) and designation with immediate session sync.
          - **Profile Editing**: Update team member display names and details.
          - **Export to CSV**: Download a clean CSV report of all agency personnel for internal HR and payroll audits.
          - **Remove Member**: Safely revoke agency access and reassign project tasks.
        `,
      },
      {
        title: "Team Invitations & Onboarding Flow",
        slug: "team-invitations",
        description: "Invite colleagues with seat limits enforcement, 7-day token security, and dual-onboarding paths.",
        content: `
          Inviting colleagues into your SDX26 workspace is fast, secure, and governed by your agency's subscription plan seat limits.

          ## Sending an Invitation
          1. Navigate to **Team** ➔ click **"Invite Member"** (\`/dashboard/team/invite\`).
          2. Enter the member's **Full Name**, **Work Email**, **Role** (\`TEAM\` or \`OWNER\`), and **Designation** (\`DESIGNER\`, \`DEVELOPER\`, \`PROJECT_MANAGER\`, etc.).
          3. Click **"Send Invitation"**.

          ## Plan Seat Enforcement
          SDX26 automatically queries \`getAgencyLimits(agencyId)\` before sending:
          - **Basic Plan**: 1 seat (Owner only). Attempting to invite prompts an upgrade modal.
          - **Starter Plan**: 1 seat (Solo founder).
          - **Pro Plan**: 5 seats. Additional invites require an Enterprise tier or seat expansion.
          - **Enterprise Plan**: Unlimited team seats.

          ## Cryptographic Token Security
          - Each invitation generates a cryptographically secure 32-byte hex token.
          - Invitations expire automatically after **7 days** if unaccepted.
          - Existing pending invitations for the same email are cleanly rotated to avoid database conflicts.
          - An audit entry is logged to the agency's Activity Feed.

          ## The Dual Acceptance Path at /invite/[token]
          When the invited colleague clicks their link:
          1. **Existing SDX26 User**: If the user already has an SDX26 account under that email, the system automatically links them to the new agency and redirects them to login.
          2. **New Team Member**: If they are new to the platform, a sleek **Setup Password Form** prompts them to configure their account credentials, instantly authenticates them, and opens their agency dashboard.
        `,
      },
      {
        title: "Activity Feed & Audit Log",
        slug: "activity-feed",
        description: "A complete immutable audit trail of every interaction across projects, deliverables, and payments.",
        content: `
          The Activity Feed provides an immutable chronological log of every mutation in your agency workspace.

          ## Tracked System Events
          - **Asset Lifecycle**: File uploads, new versions published (v1 ➔ v2), review status changes, asset deletions.
          - **Milestones**: Status advances ([STATUS:IN_PROGRESS] ➔ [STATUS:IN_REVIEW] ➔ [STATUS:APPROVED] ➔ [STATUS:PAID]).
          - **Scope & Change Requests**: Proposals logged, client decisions (Approve, Reject, Needs Revision), and milestone auto-conversions.
          - **Client Onboarding**: Requirement submissions, asset approvals, and revision requests.
          - **Communications**: Threaded comments posted on milestones.
          - **Payments**: Checkout sessions initiated, order completions, and webhook verifications.
          - **Security & Access**: Client Magic Link logins, token regenerations, and team invitations.

          ## Dual-Actor Identification
          Every log entry records the specific actor entity:
          - \`actorUserId\`: Logged when an agency team member performs an action.
          - \`actorClientId\`: Logged when a client interacts via their Magic Link session.

          ### Accountability & Dispute Resolution
          If a client ever questions when an asset was shared or whether a deliverable was signed off, the Activity Feed provides an unambiguous audit trail with exact timestamps, previous states, and actor records.
        `,
      },
      // {
      //   title: "Payments & Financials",
      //   slug: "agency-payments",
      //   description: "Track invoices, milestone settlements, and automated checkouts powered by Polar.sh.",
      //   content: `
      //     SDX26 integrates natively with **Polar.sh** to deliver frictionless milestone-linked checkouts and automated cashflow reconciliation.

      //     ## Financial Tracking Tab
      //     In \`/dashboard/projects/[id]\`, the Financials view highlights:
      //     - **Total Contract Value**: Sum of all defined project milestones.
      //     - **Settled Revenue**: Cleared payments received directly through Polar.
      //     - **Pending Balance**: Approved milestones waiting for client checkout.

      //     ## How Milestone Billing Works
      //     1. **Milestone Approval**: When a client approves a milestone, a checkout link is generated via Polar SDK.
      //     2. **Ad-Hoc Checkout**: The client pays with modern global payment options (Credit Card, Apple Pay, Google Pay).
      //     3. **Webhook Reconciliation**: Polar triggers a secure webhook to \`/api/webhook/polar\`, validating the transaction and automatically updating the milestone status to [STATUS:PAID].
      //     4. **Deliverable Unlocking**: Source code, high-resolution production assets, or final deliverables are unlocked immediately upon settlement.
      //   `,
      // },
      {
        title: "Scope Creep Protection",
        slug: "scope-creep",
        description: "Handle out-of-scope requests with transparent cost & timeline proposals that auto-convert into paid milestones.",
        content: `
          Scope creep is the #1 killer of agency profit margins. "Can you just tweak this one small thing?" quickly compounds into weeks of unbilled labor. SDX26 resolves this with an audit-backed Change Request engine.

          ## Bi-Directional Initiation

          ### Case A: Client Requests Out-of-Scope Work
          1. **Submission**: The client submits a change request from their portal at \`/portal/[token]/scope\` (e.g., *"Add Stripe multi-currency checkout and discount code engine"*). Status: [STATUS:SUBMITTED].
          2. **Agency Review**: Agency assesses the request in \`/dashboard/projects/[id]/scope\`, flags it as \`NEW_REQUEST\` or \`IN_SCOPE\`, and defines the proposed cost (e.g., *$1,200*) and timeline impact (e.g., *+4 business days*).
          3. **Client Decision**: The proposal updates on the client portal to [STATUS:PENDING_CLIENT_APPROVAL]. The client can **Approve**, **Reject**, or **Request Revision**.
          4. **Auto-Conversion**: Upon approval, SDX26 automatically creates a new Milestone with the agreed amount and updates the request to [STATUS:CONVERTED].

          ### Case B: Agency Proposes Feature Upsell
          1. **Agency Proposal**: Agency identifies a valuable upgrade (e.g., *"Automated Email Marketing Sequences"*).
          2. **Official Proposal**: Agency logs the proposal with proposed price and timeline directly to the client portal.
          3. **Client Sign-off**: The client accepts in 1 click, generating a new payable project milestone instantly.

          ## Change Request Statuses
          - [STATUS:SUBMITTED]: Client-submitted request awaiting Agency proposal.
          - [STATUS:PENDING_CLIENT_APPROVAL]: Agency proposed official pricing & timeline; awaiting client response.
          - [STATUS:NEEDS_REVISION]: Client requested adjustments to proposed pricing or timeline.
          - [STATUS:CONVERTED]: Approved by client and auto-converted into an active project milestone.
          - [STATUS:REJECTED]: Declined by client (no work or fee created).
          - [STATUS:CANCELLED]: Withdrawn before formal approval.

          > [!IMPORTANT]
          > Work is never initiated for out-of-scope tasks until the client explicitly signs off on the proposed cost and timeline in their portal.
        `,
      },
      {
        title: "Agency Settings & Custom Branding",
        slug: "agency-settings",
        description: "Customize your agency profile, workspace slug, logo, and white-label portal branding.",
        content: `
          Configure your agency identity and white-label client portal appearances from \`/dashboard/settings\`.

          ## Agency Profile & Branding
          - **Agency Name**: Displayed on all outgoing client notifications, emails, and portal headers.
          - **Workspace Slug**: Your unique subdomain identifier (e.g. *acme-studio* in *acme-studio.milestack.com*).
          - **Logo & Avatar Management**: Upload your agency logo or provide a custom image URL. The interactive preview dialog lets you inspect the rendering before saving.
          - **White-Label Portal Theme**: Portals automatically inherit your agency's branding, establishing a polished, premium aesthetic for your clients.

          ## Account & Security Settings
          - **Personal Profile**: Update your First Name, Last Name, and Contact Email.
          - **Password Management**: Securely update account passwords with real-time validation.
          - **Role Badge**: View your active administrative role (\`OWNER\` vs \`TEAM\`).
        `,
      },
      {
        title: "Sending Magic Links",
        slug: "magic-link-sending",
        description: "How to invite clients, deliver portal access, and regenerate links securely.",
        content: `
          SDX26 eliminates client password fatigue by utilizing secure, cryptographic Magic Links.

          ## How to Invite a Client
          1. Open the project in your Agency Dashboard.
          2. Navigate to the **Portal** tab.
          3. Click **"Send Invite"** (or **"Resend Portal Link"**).
          4. The client receives a branded email containing their unique access button.

          ## Link Regeneration & Access Revocation
          If a client misplaces their email or you need to rotate access credentials:
          1. Navigate to \`/dashboard/projects/[id]/portal\`.
          2. Click **"Regenerate Link"**.
          3. The previous token is immediately invalidated in the database.
          4. A new 32-byte secure token is generated and emailed to the client stakeholder.
          5. Historical access logs are preserved for audit compliance.
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
        description: "The professional, zero-friction portal for clients to track progress, review assets, and pay invoices.",
        content: `
          The Client Portal is a high-fidelity, distraction-free environment tailored specifically for client stakeholders and executives.

          ## What Clients See
          - **Project Progress Bar**: Clear percentage-complete indicator calculated from completed milestones.
          - **Action Center**: Prominently highlights items requiring immediate attention (e.g. *Pending Onboarding Assets*, *Deliverables Awaiting Review*, *Invoices Due*).
          - **Milestone Timeline**: Chronological roadmap of past, active, and upcoming project sprints.
          - **Deliverable Repository**: Instant 1-click access to staging websites, Figma prototypes, and downloadable files.
          - **Scope Tab**: A clean interface to request new features or review agency pricing proposals.
          - **Payment Invoices**: Simple checkout flow to settle approved milestone payments.
        `,
      },
      {
        title: "Magic Link Access",
        slug: "client-access",
        description: "Frictionless, passwordless authentication for busy clients.",
        content: `
          Clients should never have to remember a 16-character password or perform multi-factor resets just to inspect a staging link.

          ## How Authentication Works
          1. The agency sends an invite from the project dashboard.
          2. The client clicks **"Access Project Portal"** directly in their email.
          3. The endpoint \`/api/auth/magic-link/verify\` validates the cryptographic token, flags the token as used, and signs a secure 30-day JWT cookie (\`client_session\`).
          4. The client lands straight on their dashboard (\`/portal/[token]/dashboard\`).

          ## Persistent 30-Day Sessions
          Clients can bookmark their portal URL. As long as their 30-day session cookie remains valid, returning visits automatically bypass verification and load the portal instantly.

          ## Enterprise Security
          - One-time token verification prevents replay attacks.
          - Session cookies are \`HttpOnly\`, \`Secure\`, and \`SameSite=Lax\`.
          - Client sessions are cryptographically isolated to their assigned project and agency.
        `,
      },
      {
        title: "Onboarding Upload",
        slug: "client-onboarding",
        description: "How clients submit prerequisite brand guidelines, assets, and credentials.",
        content: `
          When clients first access their portal, the Onboarding tab guides them through required asset submissions.

          ## Submission Process
          1. The client opens \`/portal/[token]/onboarding\`.
          2. They see an itemized checklist (e.g. *Logo Files*, *Brand Guidelines*, *Hosting Logins*).
          3. For each item, they can drag-and-drop binary files or paste external links (Google Drive, Notion, Figma).
          4. Submitting updates the status to [STATUS:UPLOADED].
          5. Once the agency reviews and approves the item, it marks as [STATUS:APPROVED] and advances the Kickoff Progress Bar.
        `,
      },
      {
        title: "Reviewing Files & Deliverables",
        slug: "client-file-review",
        description: "How clients inspect assets, preview staging environments, and verify versions.",
        content: `
          Clients review all shared deliverables in \`/portal/[token]/files\`.

          ## Deliverable Capabilities
          - **Live 1-Click Previews**: Open interactive staging deployments, Loom video walkthroughs, or Figma design systems in a new tab with zero authentication friction.
          - **Direct Asset Downloads**: Download high-resolution PNGs, SVGs, documents, and ZIP source archives.
          - **Version Badges & History**: Click version pills (e.g. \`v1\`, \`v2\`) to view change logs detailing exactly what was updated in each iteration.
          - **Milestone Filtering**: Filter deliverables by sprint phase to inspect assets in their project context.
          - **Status Transparency**: Clearly view whether an asset is [STATUS:UPLOADED], [STATUS:UNDER_REVIEW], [STATUS:APPROVED], or has a [STATUS:REVISION_REQUESTED].
        `,
      },
      {
        title: "Approvals & Feedback",
        slug: "client-approvals",
        description: "Formal sign-offs that protect both agency and client.",
        content: `
          Formal sign-offs prevent scope disputes and keep projects moving forward smoothly.

          ## Milestone Sign-off Workflow
          1. The agency delivers the files or staging links linked to a milestone.
          2. The client inspects the deliverables in their portal.
          3. When satisfied, the client clicks **"Approve Milestone"**.
          4. The sign-off is permanently recorded in the project's Activity Feed with a timestamp and the client stakeholder's ID.
          5. If linked to an invoice, the milestone automatically transitions to payment checkout.
        `,
      },
      {
        title: "Client Change Requests",
        slug: "client-scope-requests",
        description: "How clients request new features or modifications outside original contract scope.",
        content: `
          Clients frequently think of exciting new ideas or additional features mid-project. Instead of burying these in informal emails or text messages, clients use the dedicated **Scope** tab (\`/portal/[token]/scope\`).

          ## Submitting a New Request
          1. Navigate to the **Scope** tab in the client portal.
          2. Click **"Request New Feature / Change"**.
          3. Provide a clear title (e.g. *Add Stripe Apple Pay integration*) and optional description.
          4. Click **Submit Request**. The status becomes [STATUS:SUBMITTED].

          ## Reviewing the Agency's Proposal
          Once the agency evaluates the request, the portal updates with the official proposal:
          - **Cost Impact**: Clear upfront pricing (e.g. *$600.00*).
          - **Timeline Impact**: Impact on the project delivery date (e.g. *+3 business days*).
          - **Agency Notes**: Scope boundaries and technical considerations.

          ## 1-Click Client Response
          The client has three simple options:
          - 🟢 **Approve**: Accepts the cost and timeline. SDX26 automatically creates a new project milestone linked to this price.
          - 🟡 **Request Revision**: Leaves a note to adjust requirements, timeline, or scope.
          - 🔴 **Decline**: Rejects the proposal. No extra work or cost is incurred.
        `,
      },
      {
        title: "Milestone Feedback & Discussions",
        slug: "client-milestone-discussions",
        description: "Contextual feedback threads pinned directly to milestones.",
        content: `
          SDX26 eliminates messy email chains by attaching discussions directly to the milestone they concern.

          ## Threaded Milestone Comments
          1. In \`/portal/[token]/milestones\`, expand any active milestone.
          2. The **Discussion Thread** displays chronological messages from both the agency team and client stakeholders.
          3. Type feedback or questions and click **Send**.
          4. The comment is saved instantly, updates the live UI via optimistic caching, and logs an entry in the project's audit stream.
        `,
      },
      {
        title: "Milestone Tracking",
        slug: "client-milestones",
        description: "Complete visibility into project roadmap, past deliveries, and future sprints.",
        content: `
          Clients can see the entire project roadmap from Day 1.

          ## The Timeline
          - **Past Phases**: Completed and paid milestones, complete with archived deliverables.
          - **Active Phase**: The current milestone under review or development.
          - **Upcoming Phases**: Future phases, estimated delivery dates, and planned scope.

          This complete visibility drastically reduces "where are we?" inquiry emails and builds high client trust.
        `,
      },
      {
        title: "Payments & Invoices",
        slug: "client-payments",
        description: "Secure, global milestone payments powered by Polar.sh.",
        content: `
          Clients can review and pay for approved milestones directly through their portal (\`/portal/[token]/payments\`).

          ## Checkout Flow
          1. Once a milestone is approved, click **"Pay Now"**.
          2. The client is redirected to a secure Polar.sh checkout session.
          3. Supported payment methods include Credit Cards, Debit Cards, Apple Pay, and Google Pay.
          4. Upon completion, the client is redirected back to \`/portal/[token]/payments/success\`, and the invoice updates to [STATUS:PAID] immediately.
          5. Downloadable receipts and invoices are retained permanently in the client portal for accounting records.
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
        description: "Comprehensive breakdown of agency-wide, per-project, and client permission hierarchies.",
        content: `
          SDX26 employs a hybrid Role-Based Access Control (RBAC) architecture separating agency management from project execution and client boundaries.

          ## Permission Matrix

          | Capability | Agency Owner | Agency Member | Project Member | Client |
          | --- | --- | --- | --- | --- |
          | **Manage Agency Billing & Plans** | ✅ Full | ❌ No | ❌ No | ❌ No |
          | **Invite / Remove Team Members** | ✅ Full | ❌ No | ❌ No | ❌ No |
          | **Update Agency Branding & Slug** | ✅ Full | ❌ No | ❌ No | ❌ No |
          | **Create New Projects** | ✅ Full | ❌ No | ❌ No | ❌ No |
          | **View All Agency Projects** | ✅ Full | ❌ Assigned Only | ❌ Assigned Only | ❌ Own Project Only |
          | **Manage Milestones & Tasks** | ✅ Full | ✅ In Assigned | ✅ In Assigned | ❌ View / Approve Only |
          | **Upload Assets & Version Links** | ✅ Full | ✅ In Assigned | ✅ In Assigned | ❌ Onboarding / Scope Only |
          | **Review Client Scope Requests** | ✅ Full | ✅ In Assigned | ✅ In Assigned | ❌ Initiate Only |
          | **Approve Milestones & Pay** | ❌ Agency Side | ❌ Agency Side | ❌ Agency Side | ✅ Full |
        `,
      },
      {
        title: "Project Lifecycle",
        slug: "project-lifecycle",
        description: "The complete journey of a project from onboarding to final delivery and archiving.",
        content: `
          Every project in SDX26 follows a structured 5-phase operational lifecycle:

          ## 1. Onboarding Phase
          - Project created; client invited via Magic Link.
          - Client uploads vector logos, brand assets, and hosting credentials.
          - Agency reviews and approves onboarding items.

          ## 2. Iterative Sprint & Execution
          - Agency team works through chronological milestones.
          - Internal tasks are tracked, prioritized, and assigned to team members.
          - Contextual messaging keeps feedback focused on specific milestones.

          ## 3. Deliverables & Versioning
          - Staging links (Vercel, Netlify) or design prototypes (Figma) are published.
          - Revisions are added in-place (v1 ➔ v2 ➔ v3) with change notes.
          - Zero duplicate asset clutter.

          ## 4. Scope Management & Adjustment
          - Out-of-scope client requests are captured in the Scope tab.
          - Agency defines official cost and timeline impact.
          - Client approval auto-converts requests into new payable milestones.

          ## 5. Settlement, Delivery & Archiving
          - Client formally approves milestone deliverables.
          - Automated checkout settles milestone payouts via Polar.sh.
          - Project moves to [STATUS:COMPLETED] and is archived for long-term reference.
        `,
      },
      {
        title: "File Versioning System",
        slug: "versioning-system",
        description: "In-place semantic versioning for binary assets and live preview links.",
        content: `
          SDX26 eliminates "final_v2_FINAL_ACTUAL" confusion by managing revisions under a single persistent deliverable entity.

          ## Versioning Principles
          - **Dual Support**: Works identically for binary files (PDFs, ZIPs, PNGs) and external links (Figma, Staging previews, Loom).
          - **In-Place Increments**: Releasing an update increments the semantic version (\`v1\` ➔ \`v2\` ➔ \`v3\`) without generating duplicate rows.
          - **Mandatory Change Notes**: Each release includes a concise explanation of modifications.
          - **Full Audit Trail**: Clicking the version pill badge displays the complete history of previous versions, author tags, and past links.
          - **Quota Efficiency**: External preview links consume 0 MB of agency storage.
        `,
      },
      {
        title: "Plan Limits & Storage Quotas",
        slug: "plan-limits-quotas",
        description: "Understanding agency subscription tiers, project limits, team seat allocations, and storage enforcement.",
        content: `
          SDX26 enforces automated limits based on your agency's active subscription tier.

          ## Tier Matrix

          | Feature | Basic | Starter | Pro | Enterprise |
          | --- | --- | --- | --- | --- |
          | **Monthly Price** | Free | $29/mo | $79/mo | Custom |
          | **Max Active Projects** | 0 (Explore only) | 5 Projects | Unlimited | Unlimited |
          | **Team Member Seats** | 1 (Owner only) | 1 (Solo) | 5 Seats | Unlimited |
          | **Cloud Storage** | 0 GB | 1 GB | 20 GB | Unlimited |
          | **External Staging & Figma Links**| Unlimited | Unlimited | Unlimited | Unlimited |
          | **Polar Milestone Checkouts** | Enabled | Enabled | Enabled | Enabled |

          ## Automated Storage Metering
          Storage consumption is calculated dynamically via \`getAgencyStorageUsed(agencyId)\`, aggregating the \`fileSizeBytes\` of all uploaded \`FileVersion\` records.

          ### Zero-Storage Links
          Agencies delivering live websites, Vercel deployments, Figma canvases, GitHub pull requests, or Loom walkthroughs consume **0 bytes** of storage quota, allowing even Starter plans to manage dozens of deliverables without hitting limits.
        `,
      },
      {
        title: "Multi-Tenancy & Subdomain Routing",
        slug: "multi-tenancy-architecture",
        description: "Enterprise tenant isolation, custom subdomain routing, and database security.",
        content: `
          SDX26 is built on a multi-tenant architecture designed to keep every agency and client strictly isolated.

          ## Dynamic Subdomain Routing
          - Each agency claims a unique slug during onboarding (e.g. \`pixel-studio\`).
          - Incoming requests to \`pixel-studio.milestack.com\` are processed by root middleware.
          - The middleware resolves the agency ID via \`/api/internal/resolve-tenant\` and injects the \`x-agency-id\` header.
          - Custom domains (e.g. \`portal.pixelstudio.agency\`) map cleanly to the same tenant resolution pipeline.

          ## Database Isolation
          Every database query across projects, milestones, files, change requests, and notifications includes strict composite tenant filters (\`where: { agencyId, projectId }\`), ensuring zero data leakage across workspaces.
        `,
      },
      {
        title: "Dual-Session Authentication Architecture",
        slug: "dual-session-system",
        description: "How NextAuth agency sessions and Jose JWT client sessions coexist side-by-side without collision.",
        content: `
          Agencies and their clients have fundamentally different authentication requirements. SDX26 solves this with a robust dual-session architecture.

          ## 1. Agency Session (NextAuth.js)
          - **Cookie**: \`next-auth.session-token\`
          - **Identity**: Agency Owners and Team Members.
          - **Auth Flow**: Email/Password or OAuth (Google, GitHub).
          - **Protected Routes**: \`/dashboard/*\`, \`/api/agency/*\`, \`/api/team-member/*\`.

          ## 2. Client Portal Session (Jose JWT)
          - **Cookie**: \`client_session\`
          - **Identity**: Client stakeholders.
          - **Auth Flow**: Tokenized Magic Links delivered via email.
          - **Protected Routes**: \`/portal/*\`.
          - **Lifespan**: 30 days of persistent access.

          ## Side-by-Side Coexistence
          Because the two systems use completely separate cookies and validation logic, an agency owner can inspect their client's portal in the same browser session without logging out of their agency dashboard.
        `,
      },
      {
        title: "Approval Workflow Logic",
        slug: "approval-workflow",
        description: "The engine that ensures deliverables are signed off before milestones can be paid.",
        content: `
          The approval workflow enforces healthy agency delivery discipline:
          - A Milestone cannot transition to [STATUS:APPROVED] until deliverables are shared and accepted.
          - Milestone payout checkout links are generated only after approval (unless manually triggered).
          - Every approval triggers an immutable, timestamped entry in the Activity Feed.
        `,
      },
      {
        title: "Activity Logging Engine",
        slug: "activity-system",
        description: "Technical reference for the internal audit engine tracking every mutation.",
        content: `
          Every significant mutation in SDX26 logs to the \`ActivityLog\` database table.

          ## Metadata Structure
          Each log entry includes:
          - \`agencyId\` & \`projectId\`: Strict tenant context.
          - \`actorUserId\` / \`actorClientId\`: Who performed the mutation.
          - \`action\`: Human-readable summary (e.g. *"approved change request: 'Add Stripe Checkout'"*).
          - \`entityType\`: \`PROJECT\`, \`MILESTONE\`, \`FILE\`, \`MESSAGE\`, \`CHANGE_REQUEST\`, \`ONBOARDING\`.
          - \`metadata\`: JSON payload capturing old and new values.
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
        description: "Technical reference for agency NextAuth sessions and client Magic Link verification.",
        content: `
          SDX26 exposes endpoints for authenticating both agency personnel and portal clients.

          ## Verifying Client Magic Links
          \`POST /api/auth/magic-link/verify\`

          ### Request Body
          \`\`\`json
          {
            "token": "a1b2c3d4e5f6..."
          }
          \`\`\`

          ### Response (200 OK)
          \`\`\`json
          {
            "success": true,
            "projectId": "clx...",
            "clientId": "clx..."
          }
          \`\`\`
          *Sets an HttpOnly \`client_session\` cookie valid for 30 days.*
        `,
      },
      {
        title: "Project APIs & Actions",
        slug: "api-projects",
        description: "Technical reference for managing projects programmatically.",
        content: `
          Manage projects via Server Actions or REST endpoints.

          ### Create Project Action
          \`createProject(data)\`

          \`\`\`typescript
          const result = await createProject({
            projectName: "Mobile App Redesign",
            projectDescription: "iOS and Android Figma redesign and React Native build",
            clientName: "Sarah Connor",
            clientEmail: "sarah@cyberdyne.io"
          });
          \`\`\`

          ### Fetch Projects
          \`getAllProjects()\` returns all projects the authenticated agency member is authorized to see.
        `,
      },
      {
        title: "File & Deliverable Actions",
        slug: "api-files",
        description: "Technical reference for deliverable uploads, external preview links, and versioning.",
        content: `
          Manage deliverables, preview links, and semantic versions via Server Actions in \`server/projects.ts\`.

          ### 1. Upload File or Deliverable Link
          \`uploadFile(projectId, data)\`
          
          \`\`\`typescript
          await uploadFile(projectId, {
            fileName: "Staging Preview v1",
            fileType: "link/preview", // or "link/figma", "application/pdf"
            url: "https://staging.domain.com",
            fileSizeBytes: 0, // 0 for external links (preserves storage quota)
            milestoneId: "milestone_123"
          });
          \`\`\`

          ### 2. Publish New Version
          \`addFileVersion(fileId, projectId, data)\`
          
          \`\`\`typescript
          await addFileVersion(fileId, projectId, {
            url: "https://staging-v2.domain.com",
            changeNote: "Updated dark mode checkout and responsive mobile navbar"
          });
          \`\`\`

          ### 3. Update Review Status
          \`updateFileStatus(fileId, projectId, status)\`
          - Allowed values: \`UPLOADED\`, \`UNDER_REVIEW\`, \`APPROVED\`, \`REVISION_REQUESTED\`.
        `,
      },
      {
        title: "Scope & Change Request Actions",
        slug: "api-scope",
        description: "Technical reference for bi-directional scope proposals, approvals, and milestone auto-conversion.",
        content: `
          The Change Request system in \`server/scope.ts\` manages out-of-scope adjustments.

          ### 1. Client Submits Request
          \`createClientChangeRequest(data)\`
          \`\`\`typescript
          await createClientChangeRequest({
            projectId: "clx_project",
            title: "Add Coupon & Discount System",
            description: "Support percentage and flat-rate discount codes at checkout"
          });
          \`\`\`

          ### 2. Agency Reviews & Proposes Cost/Timeline
          \`reviewChangeRequestByAgency(data)\`
          \`\`\`typescript
          await reviewChangeRequestByAgency({
            requestId: "req_123",
            scopeType: "NEW_REQUEST",
            costImpact: 850,
            timelineImpact: "+3 business days",
            agencyNote: "Includes admin discount creator and validation logic"
          });
          \`\`\`

          ### 3. Client Responds (Approve / Reject / Needs Revision)
          \`respondToChangeRequestByClient(data)\`
          \`\`\`typescript
          await respondToChangeRequestByClient({
            requestId: "req_123",
            decision: "APPROVE", // or "REJECT", "NEEDS_REVISION"
            clientNote: "Approved! Excited to launch this."
          });
          \`\`\`
          *Approving automatically runs a Prisma transaction that creates a new Milestone and sets request status to \`CONVERTED\`.*
        `,
      },
      {
        title: "Milestones & Tasks Actions",
        slug: "api-milestone-tasks",
        description: "Technical reference for milestone tasks, assignees, and threaded messaging.",
        content: `
          Manage milestone tasks and contextual discussions via Server Actions.

          ### 1. Create Internal Task
          \`createTask(projectId, milestoneId, data)\`
          \`\`\`typescript
          await createTask(projectId, milestoneId, {
            title: "Implement Prisma schema migration",
            description: "Add ChangeRequest and FileVersion tables",
            priority: "HIGH", // "LOW", "MEDIUM", "HIGH"
            assigneeId: "user_developer_123"
          });
          \`\`\`

          ### 2. Update Task Status
          \`updateTaskStatus(projectId, taskId, status)\`
          - Status values: \`PENDING\`, \`IN_PROGRESS\`, \`COMPLETED\`.

          ### 3. Milestone Messaging
          \`createMilestoneMessage(projectId, milestoneId, content)\`
          - Attaches threaded feedback to the milestone and notifies participants.
        `,
      },
      {
        title: "Team & Invitation APIs",
        slug: "api-team",
        description: "Technical reference for team invitations, seat limit verification, and token onboarding.",
        content: `
          Manage agency staff and invitations programmatically.

          ### 1. Send Invitation Endpoint
          \`POST /api/team-member\`

          \`\`\`json
          {
            "name": "Alex Rivera",
            "email": "alex@studio.com",
            "role": "TEAM",
            "designation": "DEVELOPER"
          }
          \`\`\`
          *Validates active plan seat limits via \`getAgencyLimits(agencyId)\`, creates an invitation record with a 7-day token, and sends an invite email.*

          ### 2. Fetch Active Plan
          \`GET /api/agency/plan\`
          - Returns current active plan (\`basic\`, \`starter\`, \`pro\`, \`enterprise\`).
        `,
      },
      {
        title: "Internal Tenant Resolution API",
        slug: "api-tenant",
        description: "Technical reference for middleware subdomain routing and tenant resolution.",
        content: `
          \`GET /api/internal/resolve-tenant?slug=[slug]\`

          Protected by an internal shared secret header:
          - **Header**: \`x-internal-secret: process.env.INTERNAL_SECRET\`

          ### Response
          \`\`\`json
          {
            "agencyId": "agency_cuid_123"
          }
          \`\`\`
          Used by Next.js edge middleware to map subdomain requests (\`slug.milestack.com\`) to their tenant database ID.
        `,
      },
      {
        title: "Payment Integration (Polar)",
        slug: "api-payments",
        description: "How SDX26 integrates with Polar.sh for ad-hoc milestone checkout sessions.",
        content: `
          We use \`@polar-sh/sdk\` to generate ad-hoc checkout sessions for approved milestones.

          ## Checkout Session Creation
          \`createPortalCheckout({ amount, milestoneId, title })\`

          \`\`\`typescript
          const checkout = await polar.checkouts.create({
            projectName: "Milestone: " + title,
            successUrl: ".../portal/[token]/payments/success?milestoneId=" + milestoneId,
            prices: [{ type: "fixed", priceAmount: Math.round(amount * 100), priceCurrency: "usd" }],
            metadata: { milestoneId, projectId, agencyId, clientId }
          });
          \`\`\`
        `,
      },
      {
        title: "Webhooks",
        slug: "api-webhooks",
        description: "Inbound webhook processing for automated payment reconciliation.",
        content: `
          SDX26 handles inbound webhooks from Polar.sh at \`/api/webhook/polar\`.

          ## Webhook Payload Processing
          - Listens for \`order.created\` events.
          - Extracts \`milestoneId\` and \`projectId\` from checkout metadata.
          - Updates the \`Milestone\` status to \`PAID\`.
          - Creates a confirmed \`Payment\` record and logs an activity audit entry.
        `,
      },
    ],
  },
  {
    title: "Roadmap & Future",
    items: [
      {
        title: "AI Copilot & Automation",
        slug: "ai-roadmap",
        description: "Upcoming intelligent features: smart onboarding, automated status reports, and predictive delay detection.",
        content: `
          SDX26 is architected to support an intelligent AI Copilot layer to further reduce agency overhead.

          ## Planned AI Capabilities

          ### 1. AI Smart-Onboarding Chatbot
          An embedded conversational assistant in the Client Portal that walks clients through asset requirements, answers agency workflow FAQs, and checks uploaded files for required specifications.

          ### 2. Automated Weekly Status Reports
          AI action that digests completed milestone tasks, newly published deliverables, and client change requests over the past 7 days into a polished executive summary emailed directly to client stakeholders.

          ### 3. Smart Task & Milestone Suggester
          Analyzes project briefs or client intake forms during kickoff and recommends recommended milestone breakdowns and internal task checklists based on proven agency templates.

          ### 4. Asset Quality Inspector
          Automated inspection of client uploads: checks logo resolutions, verifies vector formats (.SVG / .EPS), and inspects copy completeness.

          ### 5. Predictive Delay Detection
          Monitors historical response times on client reviews and checklist submissions, flagging potential delivery bottlenecks before deadlines are compromised.
        `,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Contact",
        slug: "contact",
        description: "Get in touch with the SDX26 team for technical support, onboarding assistance, and feedback.",
        content: `
          We're here to assist you with onboarding, custom domain setups, and answering any questions about SDX26.

          ## Contact Channels
          - **Email**: Reach us directly at [support@sdx26.com](mailto:support@sdx26.com) for inquiries, assistance, or enterprise questions.
          - **Early Access Feedback**: Have feedback or suggestions? Submit your thoughts through our [Early Access Feedback Form](https://forms.gle/ttHKzCp3gVMwNt7J7).
          - **Response Time**: We usually respond within 24 hours on business days.

          ## Enterprise & Agency Migration
          Need help setting up custom domains, expanding team seats, or migrating client data from legacy portals? Email our team with your agency details and we'll help get you set up.
        `,
      },
    ],
  },
];
