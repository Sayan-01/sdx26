Step 2 — Client Clicks Link
GET https://pixel-studio.milestack.com/portal/abc123xyz

Middleware চলে:
→ host = "pixel-studio.milestack.com"
→ slug = "pixel-studio"
→ fetch /api/internal/resolve-tenant?slug=pixel-studio
→ agencyId = "agency_01"
→ x-agency-id: "agency_01" header set হয়
→ /portal/* route → pass through (NextAuth session লাগে না)

app/(client-portal)/portal/[token]/page.tsx load হয়:
→ "use client" component
→ useEffect → POST /api/auth/magic-link/verify { token: "abc123xyz" }
Step 3 — Token Verify API
POST /api/auth/magic-link/verify
Body: { token: "abc123xyz" }

1. Token খোঁজো:
   → SELECT magic_links WHERE token = "abc123xyz"
     INCLUDE client, project

2. তিনটা check:
   ① না পেলে → 404 "Invalid link"
   ② usedAt IS NOT NULL → 410 "Already used"
   ③ expiresAt < now() → 410 "Expired"

3. সব pass হলে:
   → UPDATE magic_links SET usedAt = now()
     (এটা আগে করো — race condition এড়াতে)

4. Client session JWT বানাও (jose দিয়ে — NextAuth এর বাইরে):
   → payload = {
       clientId:  magic_link.clientId,
       projectId: magic_link.projectId,
       agencyId:  magic_link.agencyId,
       type:      "client_session"
     }
   → sign করো SESSION_SECRET দিয়ে
   → expires: 30 days

5. Cookie set করো:
   → Set-Cookie: client_session={jwt}
     HttpOnly, Secure, SameSite=Lax
     expires: 30 days

6. Activity log:
   → INSERT activity_logs {
       agencyId:      magic_link.agencyId,
       projectId:     magic_link.projectId,
       actorClientId: magic_link.clientId,
       action:        "client.portal_accessed",
       entityType:    "PROJECT"
     }

7. Response: { success: true, projectId, clientId }

Client-side:
→ 200 পেলে → router.replace(/portal/abc123xyz/dashboard)
→ 4xx পেলে → error UI দেখাও
Step 4 — Portal Dashboard Load
GET /portal/abc123xyz/dashboard

app/(client-portal)/portal/[token]/layout.tsx (server component):
→ cookies() দিয়ে client_session পড়ো
→ jwtVerify(cookie, SESSION_SECRET)
→ invalid/expired → redirect /portal/abc123xyz (entry page আবার)
→ valid → session = { clientId, projectId, agencyId }
→ PortalNav render করো
→ children render করো

app/(client-portal)/portal/[token]/dashboard/page.tsx:
→ cookies() থেকে session নাও
→ prisma.project.findFirst({
    where: {
      id:       session.projectId,  ← client এর project
      agencyId: session.agencyId,   ← tenant isolation
      clientId: session.clientId,   ← নিজেরটাই দেখবে
    },
    include: { milestones, onboardingItem, activityLogs }
  })
→ Page render করো
Step 5 — পরের দিন Client আবার ঢোকে
Client browser-এ /portal/abc123xyz বুকমার্ক করেছে
→ সেখানে যায়

portal/[token]/page.tsx load হয়:
→ POST /api/auth/magic-link/verify { token: "abc123xyz" }
→ magic_links.usedAt IS NOT NULL → 410 "Already used"
→ Error UI: "This link has already been used"

কিন্তু! layout.tsx আগেই চেক করেছে:
→ client_session cookie আছে → valid
→ layout redirect করে /portal/abc123xyz/dashboard
→ entry page load-ই হয় না ✅

মানে:
Cookie আছে → dashboard সরাসরি ✅
Cookie নেই → entry page → error (owner-কে জানাও)
Step 6 — Session Expire, নতুন Link দরকার
30 দিন পরে client_session cookie expire হলো

Client /portal/abc123xyz/dashboard এ যায়:
→ layout.tsx: cookie নেই বা expired
→ redirect /portal/abc123xyz

Entry page:
→ POST /api/auth/magic-link/verify { token: "abc123xyz" }
→ usedAt IS NOT NULL → 410 "Already used"
→ UI: "Link already used. Please contact your agency."

Owner → Project → Settings → "Resend Portal Link":
→ POST /api/projects/:id/magic-link
→ নতুন token generate
→ INSERT magic_links (নতুন row, usedAt=null, expiresAt=now+7days)
→ Email পাঠাও নতুন link সহ

পুরনো row থাকে (audit trail) ✅
নতুন row = নতুন access ✅

দুটো Session — Side by Side
NextAuth Session (owner/team):
  cookie name:  next-auth.session-token
  payload:      { id, name, role, agencyId }
  set by:       NextAuth automatically
  read by:      auth() server component, req.auth middleware
  used for:     /dashboard, /projects, /settings, /api/*

Client Session (magic link):
  cookie name:  client_session
  payload:      { clientId, projectId, agencyId, type: "client_session" }
  set by:       /api/auth/magic-link/verify manually (jose)
  read by:      getClientSession() — lib/client-session.ts
  used for:     /portal/*, /api/portal/*

দুটো সম্পূর্ণ আলাদা — conflict নেই।
একজন owner নিজের browser-এ দুটো cookie রাখতে পারবে।