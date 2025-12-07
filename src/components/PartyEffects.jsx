import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = () => {
  const count = 200;
  const mesh = useRef();

  // Create random particles
  const particles = useRef(new Float32Array(count * 3));
  const colors = useRef(new Float32Array(count * 3));

  if (particles.current[0] === 0) { // Initialize once
      for (let i = 0; i < count; i++) {
        particles.current[i * 3] = (Math.random() - 0.5) * 20; // x
        particles.current[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
        particles.current[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

        // Random colors
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.5);
        colors.current[i * 3] = color.r;
        colors.current[i * 3 + 1] = color.g;
        colors.current[i * 3 + 2] = color.b;
      }
  }

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
      mesh.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const MovingSpotlight = ({ color, offset }) => {
  const light = useRef();
  const target = useRef();

  useFrame((state) => {
    if (light.current && target.current) {
        const t = state.clock.getElapsedTime() + offset;
        // Move light source
        light.current.position.x = Math.sin(t) * 5;
        light.current.position.z = Math.cos(t) * 5;
        light.current.position.y = 5 + Math.sin(t * 2) * 2;

        // Move target roughly opposite
        target.current.position.x = Math.sin(t + Math.PI) * 2;
    }
  });

  return (
    <>
        <spotLight
            ref={light}
            color={color}
            intensity={2}
            angle={0.5}
            penumbra={0.5}
            position={[5, 10, 5]}
            castShadow
        />
        <mesh ref={target} visible={false} />
    </>
  );
};

const PartyEffects = () => {
  return (
    <group>
      {/* Dynamic Lights */}
      <MovingSpotlight color="#ff00ff" offset={0} />
      <MovingSpotlight color="#00ffff" offset={2} />
      <MovingSpotlight color="#ffff00" offset={4} />

      {/* Particles */}
      <ParticleSystem />

      {/* Ambient Atmosphere */}
      <fog attach="fog" args={['#000000', 5, 20]} />
    </group>
  );
};

export default PartyEffects;
