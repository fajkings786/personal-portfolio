'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  Environment,
  RoundedBox,
  Float,
  Sparkles,
  Text,
  Torus,
  MeshReflectorMaterial,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import * as THREE from 'three';
import { projectsData, Project } from '@/data/projects';

// ----------------------------------------------------------------------
// Helper: Reset Camera
// ----------------------------------------------------------------------
function CameraReset({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 14);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera, controlsRef]);

  return null;
}

// ----------------------------------------------------------------------
// Central Glowing Orb that reacts to active project
// ----------------------------------------------------------------------
function CentralOrb({ activeIndex }: { activeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'];
    return colors[activeIndex % colors.length];
  }, [activeIndex]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.95}
      />
      <pointLight intensity={1.2} distance={8} color={color} />
    </mesh>
  );
}

// ----------------------------------------------------------------------
// Floating Particles / Stars Field
// ----------------------------------------------------------------------
function ParticleField() {
  const particleCount = 1200;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25 - 10;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    // subtle rotation handled by group or individually
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.6} />
    </points>
  );
}

// ----------------------------------------------------------------------
// Decorative Rings
// ----------------------------------------------------------------------
function DecorativeRings() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <group>
      <Torus args={[3.8, 0.08, 64, 200]} position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} metalness={0.9} />
      </Torus>
      <Torus args={[4.8, 0.05, 64, 200]} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.2} metalness={0.8} />
      </Torus>
      <Torus ref={ringRef} args={[5.8, 0.06, 64, 200]} position={[0, 0.2, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.2} metalness={0.7} />
      </Torus>
    </group>
  );
}

// ----------------------------------------------------------------------
// Enhanced Project Card with better spacing, glass material, and glow
// ----------------------------------------------------------------------
function ProjectCard({
  project,
  position,
  rotationY,
  isActive,
  onClick,
}: {
  project: Project;
  position: [number, number, number];
  rotationY: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Floating animation for hover & active state
  useFrame(({ clock }) => {
    if (groupRef.current && hovered && !isActive) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 4) * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 2.5) * 0.04;
      groupRef.current.rotation.z = Math.cos(t * 2.5) * 0.04;
    } else if (groupRef.current && !hovered && !isActive) {
      groupRef.current.position.y = position[1];
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
    }
    if (glowRef.current && isActive) {
      const intensity = 0.5 + Math.sin(clock.getElapsedTime() * 5) * 0.2;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  // Scale based on active or hover
  const scale = isActive ? 1.15 : hovered ? 1.08 : 1;

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Outer glow ring for active card */}
      {isActive && (
        <mesh position={[0, 0, -0.1]} ref={glowRef}>
          <ringGeometry args={[1.2, 1.45, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.7}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main card - RoundedBox with premium glass material */}
      <RoundedBox
        args={[2.2, 3.8, 0.15]}
        radius={0.16}
        smoothness={8}
        bevelSegments={6}
        creaseAngle={0.4}
      >
        <meshPhysicalMaterial
          color={isActive ? '#3b82f6' : '#1e293b'}
          metalness={0.85}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.15}
          transparent
          opacity={0.94}
          emissive={isActive ? '#3b82f6' : hovered ? '#1e40af' : '#000000'}
          emissiveIntensity={isActive ? 0.45 : hovered ? 0.2 : 0}
        />
      </RoundedBox>

      {/* Inner glass reflection layer */}
      <RoundedBox
        args={[2.1, 3.68, 0.13]}
        radius={0.14}
        smoothness={8}
        position={[0, 0, 0.02]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.08}
          transparent
          opacity={0.12}
          clearcoat={1}
        />
      </RoundedBox>

      {/* HTML Content with larger dimensions for better readability */}
      <Html transform position={[0, 0, 0.12]} className="pointer-events-auto">
        <div
          className={`
            w-56 h-96 rounded-2xl overflow-hidden
            transition-all duration-400 cursor-pointer
            backdrop-blur-md
            ${isActive 
              ? 'ring-2 ring-blue-400 shadow-xl shadow-blue-500/50' 
              : 'ring-1 ring-white/25 hover:ring-white/40'
            }
          `}
          style={{ fontFamily: 'system-ui', backgroundColor: 'rgba(10, 20, 35, 0.85)' }}
        >
          {/* Image with enhanced overlay */}
          <div className="relative h-44 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
            {isActive && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                ACTIVE
              </div>
            )}
          </div>

          {/* Content with improved typography */}
          <div className="p-4 h-52 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1.5 line-clamp-1">
                {project.title}
              </h3>
              <p className="text-gray-300 text-xs mb-3 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-700/80 text-gray-200 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons with animations */}
            {(hovered || isActive) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5 mt-2"
              >
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                  >
                    <FaGithub className="w-4 h-4 text-white" />
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  >
                    <FiExternalLink className="w-4 h-4 text-white" />
                  </a>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ----------------------------------------------------------------------
// Carousel Group – circular arrangement with increased radius and spacing
// ----------------------------------------------------------------------
function CarouselGroup({
  projects,
  onCardClick,
  currentIndex,
  setCurrentIndex,
}: {
  projects: Project[];
  onCardClick: (index: number) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 6.2; // Increased radius for better card separation
  const [targetRotation, setTargetRotation] = useState(0);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.08;
    }
  });

  const rotateToIndex = (index: number) => {
    const anglePerCard = (Math.PI * 2) / projects.length;
    const targetAngle = -index * anglePerCard;
    setTargetRotation(targetAngle);
  };

  // Update target rotation when currentIndex changes
  useEffect(() => {
    rotateToIndex(currentIndex);
  }, [currentIndex]);

  const cards = projects.map((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const rotationY = angle;
    const isActive = index === currentIndex;

    return (
      <ProjectCard
        key={project.title}
        project={project}
        position={[x, 0, z]}
        rotationY={rotationY}
        isActive={isActive}
        onClick={() => onCardClick(index)}
      />
    );
  });

  return (
    <group ref={groupRef}>
      {cards}
      <CentralOrb activeIndex={currentIndex} />
    </group>
  );
}

// ----------------------------------------------------------------------
// Ground Reflection / Floor
// ----------------------------------------------------------------------
function ReflectiveGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <circleGeometry args={[12, 32]} />
      <MeshReflectorMaterial
        blur={[512, 512]}
        resolution={1024}
        mixBlur={1}
        mixStrength={1.5}
        roughness={0.3}
        metalness={0.8}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0f1a"
        mirror={0.5}
      />
    </mesh>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ProjectsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controlsRef = useRef<any>(null);

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % projectsData.length);
  };

  // Auto-rotate every 6 seconds (stops on drag)
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isDragging]);

  return (
    <section className="py-28 relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-sm text-blue-400 text-sm font-semibold border border-blue-500/20">
              MY PORTFOLIO
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mt-6 mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Explore my latest work in an immersive 3D experience — each card tells a unique story
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <div className="relative h-[650px] w-full overflow-x-hidden">
          <Canvas
            camera={{ position: [0, 1.5, 14], fov: 45 }}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setTimeout(() => setIsDragging(false), 200)}
            style={{ display: 'block', maxWidth: '100%' }}
            shadows
          >
            {/* Enhanced lighting system */}
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[8, 12, 6]}
              intensity={1.2}
              castShadow
              shadow-mapSize={1024}
              shadow-bias={-0.0001}
            />
            <pointLight position={[-6, 4, 6]} intensity={0.8} color="#3b82f6" />
            <pointLight position={[6, 3, -7]} intensity={0.7} color="#8b5cf6" />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#ec4899" />
            <spotLight position={[0, 6, 2]} angle={0.6} penumbra={0.8} intensity={0.6} castShadow />

            {/* Main carousel group */}
            <CarouselGroup
              projects={projectsData}
              onCardClick={handleCardClick}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />

            {/* Decorative elements */}
            <ParticleField />
            <DecorativeRings />
            <ReflectiveGround />

            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={false}
              autoRotate={false}
              enableDamping={true}
              dampingFactor={0.06}
              rotateSpeed={1.0}
              zoomSpeed={0.8}
              minDistance={6}
              maxDistance={18}
              onStart={() => setIsDragging(true)}
              onEnd={() => setIsDragging(false)}
            />

            {/* Environment map for reflections */}
            <Environment preset="city" background={false} />

            {/* Reset camera on mount */}
            <CameraReset controlsRef={controlsRef} />

            {/* Subtle fog for depth */}
            <fog attach="fog" args={['#050a14', 12, 25]} />
          </Canvas>

          {/* Current project title (animated) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-black/60 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl"
            >
              <span className="text-white/70 text-sm font-medium">Currently viewing</span>
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {projectsData[currentIndex].title}
              </h3>
            </motion.div>
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-8 right-8 z-20 flex gap-2">
            {projectsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}