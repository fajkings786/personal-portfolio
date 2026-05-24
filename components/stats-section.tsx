// components/stats-section.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { statsData } from '@/data/stats'; // adjust path if needed

export default function StatsSection() {
const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    if (!inView) return;

    const duration = 2000; // milliseconds
    const intervalTime = 20; // update every 20ms
    const steps = duration / intervalTime;
    const increments = statsData.map((stat) => stat.value / steps);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCounts(statsData.map((stat) => stat.value));
        clearInterval(interval);
      } else {
        setCounts((prev) => prev.map((val, i) => Math.min(val + increments[i], statsData[i].value)));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [inView, statsData]);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {statsData.map((stat, idx) => (
            <div key={idx} className="glass-card p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {Math.floor(counts[idx])}{stat.suffix || ''}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}