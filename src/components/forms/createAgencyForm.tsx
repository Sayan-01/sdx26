"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layers, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createAgency } from "@/lib/queries";

export default function CreateAgencyForm() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [agencyName, setAgencyName] = useState("");
  const [agencyLogo, setAgencyLogo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName) return setError("Agency name is required");

    setLoading(true);
    const result = await createAgency({
      name: agencyName,
      logoUrl: agencyLogo || null,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // ✅ Update the session so the dashboard knows about the new agency
    if (result.agency) {
      await update({
        agencyId: result.agency.id,
        agencySlug: result.agency.slug,
      });
    }

    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="z-20 max-w-[300px]">
      <div className="flex flex-col items-center gap-4 text-center mb-6">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950"
        >
          <Layers className="h-7 w-7" />
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Setup your agency</h1>
          <p className="text-zinc-400">Tell us a bit about your agency to get start your journey.</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 ml-1">Agency Name</label>
          <Input
            placeholder="Pixel Perfect Studio"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            className=" bg-zinc-900 border border-zinc-800 placeholder:opacity-40 mt-1"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 ml-1">
            Agency Logo URL <span className="text-zinc-600">(optional)</span>
          </label>
          <Input
            placeholder="https://example.com/logo.png"
            value={agencyLogo}
            onChange={(e) => setAgencyLogo(e.target.value)}
            className=" bg-zinc-900 border border-zinc-800 placeholder:opacity-40 mt-1"
          />
        </div>

        {error && <p className="text-red-500 text-[0.8rem] font-medium">{error}</p>}
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1.5px] w-full" />

        <Button
          type="submit"
          className="w-full h-10 bg-white text-zinc-950 hover:bg-zinc-200 mt-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Finish Setup <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
