import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const NotificationBellButton = () => {
  return (
    <Link href="/dashboard/activity">
      <Button
        variant="ghost"
        size="icon"
        className="text-zinc-500 hover:text-white relative border border-border"
      >
        <Bell className="h-6 w-6" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
      </Button>
    </Link>
  );
};

export default NotificationBellButton;
