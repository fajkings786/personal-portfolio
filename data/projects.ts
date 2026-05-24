// data/projects.ts

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;   // Changed from githubUrl
  live?: string;     // Changed from liveUrl
}

export const projectsData: Project[] = [
  {
    title: 'Gleads CRM',
    description: 'Enterprise-grade customer relationship management system with advanced analytics.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB'],
    live: '#',
    github: '#',
  },
  {
    title: 'Admin Dashboard',
    description: 'Modern admin panel with real-time data visualization and user management.',
    image: 'https://cdn.dribbble.com/userupload/44048704/file/original-ae5e63e5bd1cb69da4369675b350dc5e.png?format=webp&resize=640x480&vertical=center',
    tags: ['Next.js', 'Tailwind', 'Chart.js'],
    live: '#',
    github: '#',
  },
  {
    title: 'Chat Application',
    description: 'Real-time messaging platform with WebSocket integration.',
    image: 'https://cdn.dribbble.com/userupload/41609194/file/original-f368d50e09748f533bd06e39b7cc0493.png?format=webp&resize=640x480&vertical=center',
    tags: ['Socket.io', 'Express', 'React'],
    live: '#',
    github: '#',
  },
  {
    title: 'AI Assistant',
    description: 'Smart AI-powered virtual assistant for productivity tasks.',
    image: 'https://cdn.dribbble.com/userupload/44771752/file/still-a0bdf3ad8fd55a445a03908360c9fd15.png?format=webp&resize=640x480&vertical=center',
    tags: ['OpenAI', 'Python', 'FastAPI'],
    live: '#',
    github: '#',
  },
  {
    title: 'Typing Speed Game',
    description: 'Interactive typing test game with real-time feedback.',
    image: 'https://cdn.dribbble.com/userupload/8437727/file/still-944d846b3c29ca918abcfb0cd78404c1.png?format=webp&resize=640x480&vertical=center',
    tags: ['JavaScript', 'CSS3', 'HTML5'],
    live: '#',
    github: '#',
  },
];