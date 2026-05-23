// components/skills-carousel.tsx
'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as Dialog from '@radix-ui/react-dialog';
import { FiX } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Sample SVG skills data – replace with your actual SVGs
const skills = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', description: 'Frontend library for building UI components.' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', description: 'React framework for production.' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', description: 'Typed JavaScript superset.' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', description: 'Utility-first CSS framework.' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', description: 'JavaScript runtime.' },
  { name: 'GSAP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/greensock/greensock-original.svg', description: 'Animation library.' },
];

export default function SkillsCarousel() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="skills-swiper"
        >
          {skills.map((skill, idx) => (
            <SwiperSlide key={idx}>
              <motion.div
                whileHover={{ y: -10 }}
                className="glass-card p-6 text-center cursor-pointer"
                onClick={() => setSelectedSkill(skill)}
              >
                <img src={skill.icon} alt={skill.name} className="w-20 h-20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">{skill.name}</h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal Dialog */}
      <Dialog.Root open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass rounded-2xl p-6 z-[9999]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold gradient-text">{selectedSkill?.name}</h3>
              <button onClick={() => setSelectedSkill(null)} className="text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedSkill?.icon} alt={selectedSkill?.name} className="w-32 h-32 mx-auto my-4" />
            <p className="text-gray-300 text-center">{selectedSkill?.description}</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}