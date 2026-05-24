// components/about-section.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // ✅ FIXED: Framer Motion's useInView takes a ref as the first argument, 
  // and returns a boolean. We also use `once` instead of `triggerOnce` 
  // and `amount` instead of `threshold`.
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.2 });

  // Mouse tilt values (for image)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Parallax effect for image
      gsap.context(() => {
        gsap.to(imageContainerRef.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }, sectionRef);

      // Stagger reveal for text lines
      const lines = document.querySelectorAll('.about-text-line');
      gsap.fromTo(lines,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, []);

  const stats = [
    { label: 'Projects Completed', value: 50 },
    { label: 'Years Experience', value: 2 },
    { label: 'Happy Clients', value: 30 },
    { label: 'Tech Stacks', value: 15 },
  ];

  // Floating animation for stats (framer-motion)
  const statsVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 100 },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      onMouseMove={(e) => {
        const rect = imageContainerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          mouseX.set(x);
          mouseY.set(y);
        }
      }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header with glitch effect */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
            About{" "}
            <span className="gradient-text relative inline-block glitch" data-text="Me">
              Me
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with 3D tilt and parallax */}
          <motion.div
            ref={imageContainerRef}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative perspective-800"
          >
            <div className="glass-card p-2 rounded-3xl shadow-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=800&fit=crop"
                alt="Developer workspace"
                width={600}
                height={800}
                className="rounded-2xl object-cover w-full h-auto"
              />
            </div>
            {/* Glow orb that follows mouse */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
          </motion.div>

          {/* Text content */}
          <div ref={textRef}>
            <div className="about-text-line overflow-hidden">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                I'm <span className="gradient-text">Faisal Javed</span> from Pakistan
              </h3>
            </div>
            <div className="about-text-line overflow-hidden mt-4">
              <p className="text-gray-300 leading-relaxed">
                A passionate Full Stack Developer with over 2 years of experience building robust and scalable web applications. 
                I specialize in modern JavaScript frameworks and have a strong background in both frontend and backend development.
              </p>
            </div>
            <div className="about-text-line overflow-hidden mt-6">
              <p className="text-gray-300 leading-relaxed">
                My journey in tech started with digital marketing, which gave me a unique perspective on user behavior and business needs. 
                I combine technical excellence with strategic thinking to deliver solutions that drive real results.
              </p>
            </div>

            {/* Stats with floating animation */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-6 mt-12"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={statsVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-card p-5 text-center transition-all duration-300 border border-white/10 hover:border-primary/30"
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.value}+
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for glitch effect */}
      <style jsx>{`
        .glitch {
          position: relative;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .glitch::before {
          color: #ff00c1;
          z-index: -1;
          animation: glitch-effect 0.3s infinite;
        }
        .glitch::after {
          color: #00fff9;
          z-index: -2;
          animation: glitch-effect 0.3s infinite reverse;
        }
        @keyframes glitch-effect {
          0% { clip-path: inset(0 0 0 0); transform: translate(0); }
          20% { clip-path: inset(20% 0 30% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(50% 0 20% 0); transform: translate(2px, -2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(-1px, 1px); }
          80% { clip-path: inset(10% 0 60% 0); transform: translate(1px, -1px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        }
        .perspective-800 {
          perspective: 800px;
        }
      `}</style>
    </section>
  );
}