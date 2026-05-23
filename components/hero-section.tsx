// components/hero-section.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiDownload, FiChevronRight, FiCode, FiServer, FiDatabase, FiPenTool } from 'react-icons/fi';
import Image from 'next/image';

const roles = ['Full Stack Developer', 'Digital Marketer', 'Tech Enthusiast', 'Problem Solver'];

export default function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const typingSpeed = 100;
  const deleteSpeed = 50;
  const pauseTime = 1500;

  // Typing effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentRole) {
      // Pause before deleting
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === '') {
      // Move to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      // Type or delete one character
      const speed = isDeleting ? deleteSpeed : typingSpeed;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? prev.slice(0, -1)
            : currentRole.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  // GSAP floating icons animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.floating-icon',
        { y: 0, opacity: 0, scale: 0.8 },
        {
          y: -20,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const floatingIcons = [FiCode, FiServer, FiDatabase, FiPenTool];

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [null, -100], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium">Available for work</span>
            </motion.div>

            <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="gradient-text">Faisal Javed</span>
            </h1>
            
            <div className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 h-24">
              <span className="text-white/70">I'm a </span>
              <span className="gradient-text inline-block min-w-[280px]">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            <p className="text-gray-300 text-lg max-w-xl mb-8">
              Crafting premium digital experiences with cutting-edge technologies. 
              2+ years of turning ideas into exceptional web applications.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Projects <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition duration-300" />
              </motion.button>
            </div>

            <div className="flex gap-4 mt-8 justify-center lg:justify-start">
              {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="p-3 rounded-full glass hover:bg-primary/20 transition"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full neon-glow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin-slow" style={{ padding: '3px' }}>
                <div className="w-full h-full rounded-full bg-[#0F172A] p-1">
                  <Image
                    src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=400&fit=crop"
                    alt="Faisal Javed"
                    width={400}
                    height={400}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Floating icons */}
            {floatingIcons.map((Icon, i) => (
              <motion.div
                key={i}
                className="floating-icon absolute glass p-3 rounded-xl"
                style={{
                  top: `${20 + i * 25}%`,
                  left: i % 2 === 0 ? '-20px' : 'auto',
                  right: i % 2 === 1 ? '-20px' : 'auto',
                }}
              >
                <Icon className="w-6 h-6 text-primary" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}