import { cn } from "@/lib/utils";
import { Instrument_Serif } from "next/font/google";

const instrumentalSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
})

export default function Italic({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={cn(instrumentalSerif.className, "text-foreground/95 !tracking-tight", className)}>{children}</span>;
}