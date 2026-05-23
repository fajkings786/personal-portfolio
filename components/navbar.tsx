// components/navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUser, FiBriefcase, FiClock, FiMail } from 'react-icons/fi';
import Link from 'next/link';
import gsap from 'gsap';

const navLinks = [
  { name: 'Home', href: '#home', icon: FiHome },
  { name: 'About', href: '#about', icon: FiUser },
  { name: 'Projects', href: '#projects', icon: FiBriefcase },
  { name: 'Experience', href: '#experience', icon: FiClock },
  { name: 'Contact', href: '#contact', icon: FiMail },
];

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const logoContainerRef = useRef<HTMLAnchorElement>(null);
  const logoSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSidebarOpen && sidebarRef.current) {
      gsap.set(linkRefs.current, { autoAlpha: 0, x: 50 });
      const tl = gsap.timeline();
      tl.to(linkRefs.current, {
        autoAlpha: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(0.6)',
      });
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const handleLinkClick = (href: string) => {
    setIsSidebarOpen(false);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Magnetic effect: logo moves towards mouse ---
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!logoContainerRef.current || !logoSpanRef.current) return;
    const rect = logoContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Distance from center of logo to mouse (normalized)
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    // Max movement: 8px in X, 4px in Y
    const moveX = deltaX * 8;
    const moveY = deltaY * 4;

    gsap.to(logoSpanRef.current, {
      x: moveX,
      y: moveY,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  const handleLogoMouseLeave = () => {
    if (!logoSpanRef.current) return;
    gsap.to(logoSpanRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${scrolled
            ? 'bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 shadow-xl'
            : 'bg-[#0F172A]/40 backdrop-blur-md border-b border-white/5'
          }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo with magnetic mouse follow */}
        {/* // Inside the navbar <div className="container..."> */}
            <Link
              href="/"
              ref={logoContainerRef}
              onMouseMove={handleLogoMouseMove}
              onMouseLeave={handleLogoMouseLeave}
              className="inline-block p-4 -my-2"  // ← padding increases hit area
            >
              <span
                ref={logoSpanRef}
                className="inline-block will-change-transform text-2xl font-bold gradient-text"
              >
                Fajkings
              </span>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="relative text-gray-300 hover:text-primary transition group text-sm font-medium"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-2xl text-white hover:text-primary transition p-2 rounded-full glass"
            >
              <FiMenu />
            </button>
          </div>
      </motion.nav>

      {/* Sidebar (same as before) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] md:hidden overflow-hidden"
            >
              <div className="stars-container absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="star"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      width: `${Math.random() * 3 + 1}px`,
                      height: `${Math.random() * 3 + 1}px`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              ref={sidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm glass backdrop-blur-xl border-l border-white/20 shadow-2xl z-[9999] md:hidden"
            >
              <div className="flex justify-end p-5">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-3xl text-gray-300 hover:text-primary transition p-2 rounded-full bg-white/5 hover:bg-white/10"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex flex-col items-start gap-8 mt-8 px-8">
                {navLinks.map((link, idx) => (
                  <button
                    key={link.name}
                    ref={(el) => { linkRefs.current[idx] = el; }}
                    onClick={() => handleLinkClick(link.href)}
                    className="group relative flex items-center gap-5 text-gray-300 hover:text-primary transition text-3xl md:text-4xl font-bold"
                  >
                    <link.icon className="w-8 h-8 md:w-9 md:h-9" />
                    {link.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 3s infinite alternate;
        }
        @keyframes twinkle {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        .group {
          position: relative;
        }
        .group::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, #8b5cf6, #06b6d4);
          transition: width 0.3s ease;
        }
        .group:hover::after {
          width: 100%;
        }
      `}</style>
    </>
  );
}