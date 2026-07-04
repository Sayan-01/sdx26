

import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  Activity, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal, 
  Grid, 
  List 
} from "lucide-react";

export function DashboardMock() {
  return (
    <div className="grid grid-cols-12 gap-0 text-[12px] text-foreground bg-background w-[1000px] select-none pointer-events-none">
      {/* Sidebar */}
      <div className="col-span-2 border-r border-border/60 p-4 flex flex-col justify-between min-h-[500px] bg-[#13151b]">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18 L10 10 L14 14 L20 6" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-foreground leading-none">Milestack.</div>
              <div className="text-[8px] text-muted-foreground mt-0.5">For Modern Agencies</div>
            </div>
          </div>
          
          {/* Menu */}
          <div className="mt-8">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">
              Menu
            </div>
            <div className="space-y-1">
              {[
                { label: "Dashboard", icon: LayoutDashboard },
                { label: "Projects", icon: Folder, active: true },
                { label: "Team", icon: Users },
                { label: "Activity", icon: Activity },
                { label: "Settings", icon: Settings },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 ${
                    item.active 
                      ? "bg-secondary text-secondary-foreground font-medium" 
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-[11px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Callout */}
        <div className="space-y-4 mt-auto">
          <div className="rounded-lg border border-border bg-surface p-3 text-[10px]">
            <div className="font-semibold text-foreground">Upgrade to Agency</div>
            <p className="text-muted-foreground mt-1 leading-normal">
              Upgrade to our Agency plan and get access to all features.
            </p>
            <button className="mt-2 w-full rounded-md bg-primary py-1 text-center font-medium text-primary-foreground text-[9px]">
              Try it out
            </button>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="text-[11px]">Help & Support</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" />
              <span className="text-[11px]">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-9 p-5 flex flex-col justify-between min-h-[500px] bg-[#13151b]/70">
        {/* Header row */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
            <span>Home</span>
            <span>&gt;</span>
            <span>...</span>
            <span>&gt;</span>
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-foreground font-medium">Projects</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                disabled
                className="w-32 rounded-md border border-border bg-surface pl-8 pr-3 py-1 text-[10px] focus:outline-none"
              />
            </div>
            <button className="h-6 w-6 rounded-md border border-border bg-surface flex items-center justify-center text-muted-foreground">
              <Bell className="h-3 w-3" />
            </button>
            <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/30" />
          </div>
        </div>

        {/* Title row */}
        <div className="mt-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground tracking-tight">
              Projects
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 max-w-md">
              Manage and track your agency's creative projects and client delivery.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[10px] font-medium text-primary-foreground shadow-soft">
            + New Project
          </button>
        </div>

        {/* Stat cards grid */}
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { label: "Total Projects", icon: Folder, color: "text-blue-500 bg-blue-500/10" },
            { label: "Active Now", icon: Activity, color: "text-purple-500 bg-purple-500/10" },
            { label: "On Hold", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
            { label: "Completed", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-wider text-muted-foreground leading-none">{card.label}</div>
                <div className="h-1.5 w-10 bg-muted rounded mt-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters bar */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              disabled
              className="w-full rounded-md border border-border bg-surface pl-8 pr-3 py-1 text-[10px] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium text-foreground">
              <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
              Filters
            </button>
            <div className="flex items-center border border-border bg-surface rounded-md p-0.5">
              <button className="h-5 w-5 rounded bg-secondary flex items-center justify-center text-foreground">
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground">
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Project grid skeleton */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card p-3.5 flex flex-col justify-between h-28">
              <div className="flex items-start justify-between">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <div className="h-3.5 w-3.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                </div>
              </div>
              
              <div className="mt-2.5">
                <div className="h-2.5 w-16 bg-muted rounded" />
                <div className="h-1.5 w-24 bg-muted/60 rounded mt-1.5" />
              </div>

              <div className="mt-auto pt-2 flex justify-between items-center">
                <div className="flex -space-x-1">
                  <div className="h-3.5 w-3.5 rounded-full bg-accent/30 border border-card" />
                  <div className="h-3.5 w-3.5 rounded-full bg-primary/20 border border-card" />
                  <div className="h-3.5 w-3.5 rounded-full bg-muted border border-card" />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
