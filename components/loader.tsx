'use client';

import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Elegant animated 3D scene
function ElegantLoaderScene() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particleRingRef = useRef<THREE.Points>(null);
  const glowPointsRef = useRef<THREE.Points>(null);

  // Create flowing particle ring (toroidal distribution)
  const particleCount = 3000;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Toroidal distribution: major radius 2.2, minor radius 0.6
    const u = (i / particleCount) * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const R = 2.2;
    const r = 0.5 + Math.random() * 0.4;
    
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const y = (R + r * Math.cos(v)) * Math.sin(u) * 0.6; // flatten vertical
    const z = r * Math.sin(v) * 1.2;
    
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;
    
    // Gradient colors: cyan -> magenta -> gold
    const mixVal = (i / particleCount) * 3;
    let color: THREE.Color;
    if (mixVal < 1) color = new THREE.Color(0x06b6d4); // cyan
    else if (mixVal < 2) color = new THREE.Color(0xd946ef); // fuchsia
    else color = new THREE.Color(0xfbbf24); // amber
    
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  // Glowing star points around the core
  const glowCount = 400;
  const glowPositions = new Float32Array(glowCount * 3);
  for (let i = 0; i < glowCount; i++) {
    const radius = 1.6 + Math.random() * 0.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    glowPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    glowPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    glowPositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate entire group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    
    // Rotate outer ring
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.3;
      outerRingRef.current.rotation.x = Math.sin(t * 0.7) * 0.2;
    }
    
    // Rotate inner ring opposite direction
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * -0.5;
      innerRingRef.current.rotation.y = t * 0.4;
    }
    
    // Pulse core material
    if (coreRef.current && coreRef.current.material) {
      const intensity = 0.7 + Math.sin(t * 4) * 0.3;
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    
    // Rotate particle ring
    if (particleRingRef.current) {
      particleRingRef.current.rotation.y = t * 0.2;
      particleRingRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    
    // Animate glow points rotation
    if (glowPointsRef.current) {
      glowPointsRef.current.rotation.y = t * 0.25;
      glowPointsRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient fill */}
      <ambientLight intensity={0.25} />
      
      {/* Main directional lights with color */}
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-2, 3, 1]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[2, 1, 3]} intensity={1.0} color="#d946ef" />
      <pointLight position={[-2, 2, -3]} intensity={0.6} color="#fbbf24" />
      
      {/* Central crystalline core (dodecahedron with bevel) */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={coreRef}>
          <dodecahedronGeometry args={[0.85, 0]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#c026d3"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.95}
          />
        </mesh>
      </Float>
      
      {/* Inner spinning ring (thin, bright) */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.2, 0.04, 128, 200]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.9} metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Outer wide ring with twist */}
      <mesh ref={outerRingRef}>
        <torusKnotGeometry args={[1.9, 0.06, 180, 24, 2, 3]} />
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.7} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Secondary decorative ring */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[1.5, 0.03, 96, 160]} />
        <meshStandardMaterial color="#d946ef" emissive="#a21caf" emissiveIntensity={0.6} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Floating particle torus */}
      <points ref={particleRingRef} geometry={particleGeometry}>
        <pointsMaterial size={0.025} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
      
      {/* Glowing dust points around core */}
      <points ref={glowPointsRef} geometry={glowGeometry}>
        <pointsMaterial size={0.02} color="#fde047" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </points>
      
      {/* Stars background with slight color */}
      <Stars radius={50} depth={80} count={1500} factor={4} fade speed={0.2} saturation={0.4} />
      
      {/* Environment fog for depth */}
      <fog attach="fog" args={['#020617', 5, 15]} />
    </group>
  );
}

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    const timer = setTimeout(() => setIsLoading(false), 2800);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-gradient-to-br from-[#030712] via-[#0f172a] to-[#1e1b4b] flex items-center justify-center overflow-hidden"
        >
          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 1, 6], fov: 48 }}
              gl={{ alpha: false, antialias: true }}
              style={{ background: '#030712' }}
            >
              <ElegantLoaderScene />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.6}
                enableDamping={false}
              />
            </Canvas>
          </div>
          
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />
          
          {/* Foreground UI */}
          <div className="relative z-10 text-center px-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent tracking-tight"
            >
              Fajkings
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-[2px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500 rounded-full mx-auto max-w-[320px]"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-gray-300 mt-6 text-sm tracking-[0.25em] font-light"
            >
              LOADING EXPERIENCE
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8"
            >
              <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/15 shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-white/80 text-sm font-mono tracking-wider">
                  {progress}% COMPLETE
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-300" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 