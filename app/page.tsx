// app/page.tsx
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import SkillsSection from '@/components/skills-section';
import ProjectsSection from '@/components/projects-section';
import ExperienceTimeline from '@/components/experience-timeline';
import TestimonialsSection from '@/components/testimonials-section';
import ServicesSection from '@/components/services-section';
import StatsSection from '@/components/stats-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';
import SkillsSlider from '@/components/skills-slider';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceTimeline />
      <TestimonialsSection />
      <ServicesSection />
      <StatsSection />
      <SkillsSlider />

      <ContactSection />
      <Footer />
    </main>
  );
}