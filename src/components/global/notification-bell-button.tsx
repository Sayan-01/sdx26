import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const NotificationBellButton = () => {
  return (
    <Link href="/dashboard/activity">
      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#19191b] border border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all relative">
        <Bell className="h-4 w-4" />
        <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500 border-2 border-[#151518]" />
      </button>
    </Link>
  );
};

export default NotificationBellButton;
