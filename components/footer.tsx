// components/footer.tsx
'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMail, FiArrowUp } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import Link from 'next/link';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-8 glass border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Fajkings</h3>
            <p className="text-gray-400 text-sm">
              Crafting premium digital experiences with cutting-edge technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="hover:text-primary transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Technologies</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['React/Next.js', 'TypeScript', 'Node.js', 'Laravel'].map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Me</h4>
            <div className="flex gap-4">
              {[FaGithub, FaLinkedin, FaTwitter, FiMail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="p-2 rounded-full glass hover:bg-primary/20 transition"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            © 2024 Fajkings. Made with <AiFillHeart className="w-3 h-3 text-red-500" /> in Pakistan
          </p>
          
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            className="p-3 rounded-full glass hover:bg-primary/20 transition group"
          >
            <FiArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition" />
          </motion.button>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </footer>
  );
}