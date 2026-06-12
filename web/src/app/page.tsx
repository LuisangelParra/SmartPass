"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Hero } from "@/components/landing/Hero";
import { StackStrip } from "@/components/landing/StackStrip";
import { Problem } from "@/components/landing/Problem";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Views } from "@/components/landing/Views";
import { Developers } from "@/components/landing/Developers";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function LandingPage() {
  useScrollReveal();

  return (
    <>
      <Hero />
      <StackStrip />
      <Problem />
      <Features />
      <HowItWorks />
      <Views />
      <Developers />
      <FinalCTA />
    </>
  );
}
