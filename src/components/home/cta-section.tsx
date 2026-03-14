import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/design/wrapper";

export default function CTASection() {
  return (
    <section className="py-24">
      <Wrapper>
        <div className="relative rounded-[40px] bg-white text-zinc-950 p-8 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-zinc-100 -skew-x-12 translate-x-1/2" />
          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold ">Ready to stop the email chaos?</h2>
            <p className="text-zinc-600 text-lg md:text-xl">
              Join 500+ modern web agencies delivering better client experiences with Milestack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-lg bg-zinc-950 text-white hover:bg-zinc-800 rounded-full">
                  Create your agency
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-zinc-300 hover:bg-zinc-100 rounded-full">
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
