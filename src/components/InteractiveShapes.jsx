import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Reusable behavior hook
const useContinuousRotation = (ref) => {
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.003;
      ref.current.rotation.y += 0.008;
    }
  });
};

export const InteractiveSphere = ({ size, color }) => {
  const meshRef = useRef();
  useContinuousRotation(meshRef);

  return (
    <group ref={meshRef} scale={[size, size, size]}>
        <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={color} transparent={true} opacity={0.5} />
        </mesh>
        <mesh>
             <sphereGeometry args={[2, 32, 32]} />
             <meshBasicMaterial color="white" wireframe={true} />
        </mesh>
    </group>
  );
};

export const InteractiveCube = ({ size, color }) => {
  const meshRef = useRef();
  useContinuousRotation(meshRef);

  return (
    <group ref={meshRef} scale={[size, size, size]}>
        <mesh>
            <boxGeometry args={[3, 3, 3]} />
            <meshBasicMaterial color={color} transparent={true} opacity={0.5} />
        </mesh>
        <mesh>
             <boxGeometry args={[3, 3, 3]} />
             <meshBasicMaterial color="white" wireframe={true} />
        </mesh>
    </group>
  );
};

export const InteractiveTorus = ({ size, color }) => {
  const meshRef = useRef();
  useContinuousRotation(meshRef);

  return (
    <group ref={meshRef} scale={[size, size, size]}>
        <mesh>
            <torusGeometry args={[1.5, 0.5, 16, 100]} />
            <meshBasicMaterial color={color} transparent={true} opacity={0.5} />
        </mesh>
        <mesh>
             <torusGeometry args={[1.5, 0.5, 16, 100]} />
             <meshBasicMaterial color="white" wireframe={true} />
        </mesh>
    </group>
  );
};
