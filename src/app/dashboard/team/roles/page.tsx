"use client";

import React, { useState } from "react";
import {
  Shield,
  Users,
  CreditCard,
  FolderKanban,
  Settings,
  UserCog,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import DashboardHeading from "../../_components/dashboard-heading";
import Link from "next/link";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type RoleKey = "OWNER" | "ADMIN" | "TEAM";

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface RolePermissions {
  [permissionId: string]: boolean;
}

interface RolesState {
  OWNER: RolePermissions;
  ADMIN: RolePermissions;
  TEAM: RolePermissions;
}

// ── Permission definitions ─────────────────────────────────────────────────────

const PERMISSIONS: Permission[] = [
  {
    id: "view_payments",
    label: "View Payments",
    description: "See payment records, invoices, and revenue data",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "manage_payments",
    label: "Manage Payments",
    description: "Create, edit, and delete payment entries",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "view_clients",
    label: "View Clients",
    description: "Browse and search the client directory",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "manage_clients",
    label: "Manage Clients",
    description: "Add, edit, archive, and delete clients",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "view_projects",
    label: "View Projects",
    description: "See all agency projects and milestones",
    icon: <FolderKanban className="h-4 w-4" />,
  },
  {
    id: "manage_projects",
    label: "Manage Projects",
    description: "Create, update, and close projects",
    icon: <FolderKanban className="h-4 w-4" />,
  },
  {
    id: "view_team",
    label: "View Team",
    description: "See the agency team member list",
    icon: <UserCog className="h-4 w-4" />,
  },
  {
    id: "manage_team",
    label: "Manage Team",
    description: "Invite, edit, and remove team members",
    icon: <UserCog className="h-4 w-4" />,
  },
  {
    id: "agency_settings",
    label: "Agency Settings",
    description: "Access billing, branding, and agency config",
    icon: <Settings className="h-4 w-4" />,
  },
];

// ── Default permission matrix ──────────────────────────────────────────────────

const DEFAULT_ROLES: RolesState = {
  OWNER: {
    view_payments: true,
    manage_payments: true,
    view_clients: true,
    manage_clients: true,
    view_projects: true,
    manage_projects: true,
    view_team: true,
    manage_team: true,
    agency_settings: true,
  },
  ADMIN: {
    view_payments: true,
    manage_payments: true,
    view_clients: true,
    manage_clients: true,
    view_projects: true,
    manage_projects: true,
    view_team: true,
    manage_team: false,
    agency_settings: false,
  },
  TEAM: {
    view_payments: false,
    manage_payments: false,
    view_clients: true,
    manage_clients: false,
    view_projects: true,
    manage_projects: false,
    view_team: true,
    manage_team: false,
    agency_settings: false,
  },
};

// ── Role meta ──────────────────────────────────────────────────────────────────

const ROLE_META: Record<
  RoleKey,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    description: string;
    locked: boolean;
  }
> = {
  OWNER: {
    label: "Owner",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    description: "Full access to everything. Cannot be restricted.",
    locked: true,
  },
  ADMIN: {
    label: "Admin",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    description: "Trusted team leads with broad access.",
    locked: false,
  },
  TEAM: {
    label: "Team Member",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-700",
    description: "Default role for invited staff members.",
    locked: false,
  },
};

const ROLES: RoleKey[] = ["OWNER", "ADMIN", "TEAM"];

// ── Page Component ─────────────────────────────────────────────────────────────

export default function ManageRolesPage() {
  const [roles, setRoles] = useState<RolesState>(DEFAULT_ROLES);
  const [saving, setSaving] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleKey>("ADMIN");

  const toggle = (role: RoleKey, permId: string) => {
    if (ROLE_META[role].locked) return;
    setRoles((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permId]: !prev[role][permId],
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call — replace with real server action when ready
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success("Role permissions saved successfully!");
  };

  const activeCount = Object.values(roles[activeRole]).filter(Boolean).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/team">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <DashboardHeading
            title="Manage Roles"
            description="Define what each role can access within your agency workspace."
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2 h-10"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin inline-block" />
              Saving…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
        <Info className="h-4 w-4 mt-0.5 text-indigo-400 shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Permissions are applied to all team members with the corresponding
          role. Owner permissions are fixed and cannot be changed. Changes take
          effect immediately for all active sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Role selector sidebar */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">
            Roles
          </p>
          {ROLES.map((role) => {
            const meta = ROLE_META[role];
            const count = Object.values(roles[role]).filter(Boolean).length;
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={cn(
                  "w-full text-left rounded-xl border p-4 transition-all duration-200",
                  activeRole === role
                    ? `${meta.bg} ${meta.border}`
                    : "bg-[#19191b] border-dashboard-border hover:bg-zinc-800/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      activeRole === role ? meta.color : "text-zinc-300"
                    )}
                  >
                    {meta.label}
                  </span>
                  {meta.locked && <Lock className="h-3 w-3 text-zinc-600" />}
                </div>
                <p className="text-[11px] text-zinc-500">
                  {count}/{PERMISSIONS.length} permissions
                </p>
              </button>
            );
          })}
        </div>

        {/* Permissions panel */}
        <div className="lg:col-span-3">
          <Card className="bg-[#19191b] border-dashboard-border card_shadow p-0 overflow-hidden group relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-0">
              {/* Panel header */}
              <div className="flex items-center justify-between p-5 border-b border-dashboard-border">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg border flex items-center justify-center",
                      ROLE_META[activeRole].bg,
                      ROLE_META[activeRole].border
                    )}
                  >
                    <Shield
                      className={cn("h-4 w-4", ROLE_META[activeRole].color)}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">
                      {ROLE_META[activeRole].label}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {ROLE_META[activeRole].description}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold border",
                    ROLE_META[activeRole].bg,
                    ROLE_META[activeRole].border,
                    ROLE_META[activeRole].color
                  )}
                >
                  {activeCount} active
                </div>
              </div>

              {/* Permission rows */}
              <div className="divide-y divide-dashboard-border/60">
                {PERMISSIONS.map((perm) => {
                  const isOn = roles[activeRole][perm.id];
                  const isLocked = ROLE_META[activeRole].locked;
                  return (
                    <div
                      key={perm.id}
                      className={cn(
                        "flex items-center justify-between px-5 py-4 transition-colors",
                        !isLocked && "hover:bg-zinc-800/30 cursor-pointer"
                      )}
                      onClick={() => toggle(activeRole, perm.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
                            isOn
                              ? `${ROLE_META[activeRole].bg} ${ROLE_META[activeRole].border} ${ROLE_META[activeRole].color}`
                              : "bg-zinc-800/50 border-dashboard-border/50 text-zinc-600"
                          )}
                        >
                          {perm.icon}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium transition-colors",
                              isOn ? "text-white" : "text-zinc-400"
                            )}
                          >
                            {perm.label}
                          </p>
                          <p className="text-xs text-zinc-600">
                            {perm.description}
                          </p>
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={isOn}
                          disabled={isLocked}
                          onCheckedChange={() => toggle(activeRole, perm.id)}
                          className={cn(
                            "transition-opacity",
                            isLocked && "opacity-40 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Locked notice */}
              {ROLE_META[activeRole].locked && (
                <div className="px-5 py-4 border-t border-dashboard-border bg-zinc-900/40">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Lock className="h-3 w-3" />
                    <span>
                      Owner permissions are locked and cannot be modified.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
