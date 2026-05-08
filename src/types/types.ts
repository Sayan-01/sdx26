import { ProjectStatus } from "@/generated/prisma";

export type ProjectCard = {
  client: {
    name: string;
    email: string;
  }
  _count: {
    projectMembers: number;
  };
  milestones: {
    status: string;
  }[];
  projectMembers: {
    user: {
      name: string | null;
      avatarUrl: string | null;
    }
  }[];
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: ProjectStatus;
  description: string | null;
  deadline: Date | null;
  priority: string;
  progress: number;
  team: number;
  activity: string;
}[]
