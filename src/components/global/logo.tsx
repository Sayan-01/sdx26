import Link from "next/link";

export default function Logo({ fullName, className }: { fullName: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 group ${className}`}
    >
      <div className="flex h-7 w-7  items-center justify-center  rounded-md bg-primary text-primary-foreground transition-transform ">
        <svg
          viewBox="0 0 24.25 24.5"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 18 L10 10 L14 14 L20 6" />
        </svg>
        
      </div>
      {fullName && <span className="font-display text-[15px] font-semibold tracking-tight text-foreground group-hover:text-foreground/90 transition-colors">Milestack</span>}
    </Link>
  );
}
