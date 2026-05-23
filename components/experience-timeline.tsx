// components/experience-timeline.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import { experienceData } from '@/data/experience';

export default function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate vertical line (desktop + mobile)
      if (timelineLineRef.current) {
        gsap.fromTo(timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 20%',
              scrub: 1,
            },
          }
        );
      }

      // Animate cards
      gsap.fromTo('.timeline-card',
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line - always visible, but different position on mobile vs desktop */}
          <div
            ref={timelineLineRef}
            className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-primary via-accent to-transparent origin-top shadow-lg shadow-primary/30"
          />

          {experienceData.map((exp, idx) => (
            <div
              key={exp.id}
              className={`timeline-card mb-12 relative pl-12 md:pl-0 ${
                idx % 2 === 0 ? 'md:pr-12 md:ml-auto' : 'md:pl-12'
              }`}
              style={{ width: '100%', maxWidth: idx % 2 === 0 ? '100%' : '100%' }}
            >
              {/* Timeline dot - always visible */}
              <div className="absolute left-[22px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-accent shadow-lg shadow-primary/50 z-10 -translate-y-1/2 top-6" />

              {/* Card container */}
              <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="glass-card p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Gradient hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header: title + period */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 text-accent">
                      <FiBriefcase className="w-4 h-4" />
                      <span className="text-base font-semibold">{exp.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs bg-white/10 px-3 py-1 rounded-full">
                      <FiCalendar className="w-3 h-3" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Company name */}
                  <h3 className="text-xl font-bold mb-2">{exp.company}</h3>

                  {/* Optional location (if you add it to data) */}
                  {exp.location && (
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <FiMapPin className="w-3 h-3" />
                      <span>{exp.location}</span>
                    </div>
                  )}

                  {/* Description bullets */}
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-gray-200 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}