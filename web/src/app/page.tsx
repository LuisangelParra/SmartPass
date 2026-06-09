"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { CodeExample } from "@/components/landing/CodeExample";
import { StackStrip } from "@/components/landing/StackStrip";
import { FAQ } from "@/components/landing/FAQ";
import { CTABanner } from "@/components/landing/CTABanner";

export default function LandingPage() {
  useScrollReveal();

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <CodeExample />
      <StackStrip />
      <FAQ />
      <CTABanner />
    </>
  );
}
