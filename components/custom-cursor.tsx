// components/custom-cursor.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = cursorRingRef.current;
    const glow = cursorGlowRef.current;
    if (!cursor || !ring || !glow) return;

    const onMouseMove = (e: MouseEvent) => {
      // Core dot: instant position
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power2.out',
      });
      // Outer ring: smooth follow
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out',
      });
      // Glow: even slower for trail effect
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(cursor, { scale: 3.8, backgroundColor: '#ffffff', mixBlendMode: 'difference' });
      gsap.to(ring, { scale: 2.5, borderColor: '#8b5cf6', borderWidth: '2px', opacity: 0.6 });
      gsap.to(glow, { scale: 3, opacity: 0.3 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: '#8b5cf6', mixBlendMode: 'normal' });
      gsap.to(ring, { scale: 1.5, borderColor: 'rgba(139, 92, 246, 0.5)', borderWidth: '1px', opacity: 0.4 });
      gsap.to(glow, { scale: 1, opacity: 0.15 });
    };

    window.addEventListener('mousemove', onMouseMove);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, .cursor-pointer');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Core dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Outer ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9998] opacity-40"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Glow trail */}
      <div
        ref={cursorGlowRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl pointer-events-none z-[9997] opacity-15"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}