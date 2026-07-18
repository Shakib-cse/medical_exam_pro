"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Content */}
        <div className="mx-auto text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Effortless &amp; Compliant Invoicing
            <br />
            for <span className="text-primary">Angolan Businesses</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Create invoices, manage inventory, track customer debts, control
            finances, and grow your business with Angola&apos;s next-generation
            cloud billing platform.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/">Start Free Trial</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link href="/">View Demo</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Image */}
        <div className="mx-auto mt-14 max-w-6xl">
          <div className="overflow-hidden">
            <Image
              src="/images/commonLayout/banner.png"
              alt="Dashboard"
              width={1600}
              height={1000}
              priority
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>14-day free trial</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>No credit card required</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
