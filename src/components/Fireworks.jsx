import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Explosion = ({ position, color, onComplete }) => {
  const count = 50;
  const mesh = useRef();

  // Init particles
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.05 + Math.random() * 0.05;
        data.push({
            vx: Math.sin(phi) * Math.cos(theta) * speed,
            vy: Math.sin(phi) * Math.sin(theta) * speed,
            vz: Math.cos(phi) * speed,
            x: 0,
            y: 0,
            z: 0,
            life: 1.0
        });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    let alive = false;

    // Update active particles (using a simple mesh for now, optimization: instanced mesh)
    // Actually for 50 particles/explosion, simple points geometry update is fine or InstancedMesh?
    // Let's use Points with BufferAttribute update for "trails" look.
    // Simpler: Just render active particles.
  });

  // Re-thinking: InstancedMesh is overly complex for a quick "Glitter" effect.
  // Let's use a simple Group of small Meshes for maximum compatibility and ease, or Points.
  // Points is best.

  const geoRef = useRef();

  useFrame(() => {
     if (geoRef.current) {
         const activeParticles = particles;
         const positions = geoRef.current.attributes.position.array;
         const opacities = geoRef.current.attributes.opacity?.array; // Custom attr if shader, or just scale/color

         let anyAlive = false;

         for(let i=0; i<count; i++) {
             const p = activeParticles[i];
             if(p.life > 0) {
                 p.x += p.vx;
                 p.y += p.vy;
                 p.z += p.vz;
                 p.life -= 0.02; // Fade speed
                 p.vy -= 0.002; // Gravity

                 anyAlive = true;
             }

             positions[i*3] = p.x;
             positions[i*3+1] = p.y;
             positions[i*3+2] = p.z;
         }

         geoRef.current.attributes.position.needsUpdate = true;

         if(!anyAlive) {
             onComplete();
         }
     }
  });

  return (
      <points position={position}>
          <bufferGeometry ref={geoRef}>
              <bufferAttribute
                  attach="attributes-position"
                  count={count}
                  itemSize={3}
                  array={new Float32Array(count * 3)}
              />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={0.1}
            transparent
            opacity={1}
            sizeAttenuation={true}
          />
      </points>
  );
};

// Manager Component
const Fireworks = ({ explosions, removeExplosion }) => {
  return (
    <group>
      {explosions.map((exp) => (
        <Explosion
            key={exp.id}
            position={exp.position}
            color={exp.color}
            onComplete={() => removeExplosion(exp.id)}
        />
      ))}
    </group>
  );
};

export default Fireworks;
