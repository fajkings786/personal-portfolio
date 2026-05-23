// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Poppins, Sora } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider'; // 👈 changed
import ClientOnly from '@/components/client-only';
import CustomCursor from '@/components/custom-cursor';
import ScrollProgress from '@/components/scroll-progress';
import Loader from '@/components/loader';
import CommandMenu from '@/components/command-menu';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'Faisal Javed | Full Stack Developer',
  description: 'Premium full-stack developer portfolio showcasing modern web applications and innovative solutions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${sora.variable} font-sora bg-[#0F172A]`}>
        <ThemeProvider>
          <ClientOnly>
            <Loader />
            <Navbar />
            <CustomCursor />
            <ScrollProgress />
            <CommandMenu />
          </ClientOnly>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}