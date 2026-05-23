// app/data/experience.ts

export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "New York, NY (Remote)",
    period: "Jan 2023 – Present",
    description: [
      "Lead the development of a React/Next.js dashboard with real-time analytics, serving 10k+ daily users.",
      "Implemented component library using Tailwind CSS and Radix UI, reducing development time by 30%.",
      "Mentored 2 junior developers and conducted code reviews to ensure best practices.",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion"],
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Creative Digital Agency",
    location: "San Francisco, CA",
    period: "Jun 2020 – Dec 2022",
    description: [
      "Built responsive e‑commerce websites with React and Redux Toolkit, improving performance by 40%.",
      "Integrated RESTful APIs and managed state using React Query.",
      "Collaborated with designers to implement pixel-perfect UI/UX designs.",
    ],
    technologies: ["React", "Redux Toolkit", "React Query", "SCSS", "Figma"],
  },
  {
    id: 3,
    title: "Junior Web Developer",
    company: "StartUp Studio",
    location: "Austin, TX",
    period: "Jan 2019 – May 2020",
    description: [
      "Developed landing pages and interactive components using HTML5, CSS3, and vanilla JavaScript.",
      "Optimized website performance, achieving 90+ scores on Lighthouse.",
      "Assisted in migrating legacy jQuery code to modern JavaScript.",
    ],
    technologies: ["JavaScript", "jQuery", "HTML5", "CSS3", "Bootstrap"],
  },
];