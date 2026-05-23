// app/data/skills.ts
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGit, SiDocker, SiFigma, SiAdobephotoshop } from 'react-icons/si';

export const skillsData = [
  {
    name: 'Frontend',
    icon: SiReact,
    skills: [
      { name: 'React / Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Framer Motion', level: 80 },
    ],
  },
  {
    name: 'Backend',
    icon: SiNodedotjs,
    skills: [
      { name: 'Node.js / Express', level: 85 },
      { name: 'Python', level: 75 },
      { name: 'REST APIs', level: 90 },
      { name: 'GraphQL', level: 70 },
    ],
  },
  {
    name: 'Databases & Tools',
    icon: SiMongodb,
    skills: [
      { name: 'MongoDB', level: 85 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Git / GitHub', level: 90 },
      { name: 'Docker', level: 70 },
    ],
  },
];