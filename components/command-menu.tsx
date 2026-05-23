// components/command-menu.tsx
'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog'; // 👈 import as namespace
import { FiSearch, FiMail, FiHome, FiUser, FiBriefcase, FiPhone } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function CommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const actions = [
    { icon: FiHome, label: 'Home', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: FiUser, label: 'About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: FiBriefcase, label: 'Projects', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: FiPhone, label: 'Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: FaGithub, label: 'GitHub', action: () => window.open('https://github.com', '_blank') },
    { icon: FaLinkedin, label: 'LinkedIn', action: () => window.open('https://linkedin.com', '_blank') },
    { icon: FiMail, label: 'Email', action: () => window.location.href = 'mailto:faisal@fajkings.com' },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />
        <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[9999]">
          <Command className="glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="flex items-center border-b border-white/10 px-4">
              <FiSearch className="w-5 h-5 text-gray-400" />
              <Command.Input
                placeholder="Type a command or search..."
                className="flex-1 px-4 py-4 bg-transparent outline-none text-white"
              />
            </div>
            <Command.List className="max-h-96 overflow-y-auto p-2">
              <Command.Empty className="p-4 text-center text-gray-400">No results found.</Command.Empty>
              {actions.map((action, i) => (
                <Command.Item
                  key={i}
                  onSelect={() => {
                    action.action();
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
                >
                  <action.icon className="w-4 h-4 text-primary" />
                  <span>{action.label}</span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}