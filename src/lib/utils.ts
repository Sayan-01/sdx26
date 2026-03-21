import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePriority(deadline: Date | string | null): "High" | "Medium" | "Low" {
  if (!deadline) return "Low";
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 10) return "High";
  if (diffDays <= 20) return "Medium";
  return "Low";
}

export function dayAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffTime = now.getTime() - pastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
