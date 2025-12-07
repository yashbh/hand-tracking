import React, { useState, useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const MESSAGES = [
  "Put your hands up! 🙌",
  "Pinch the shape! 👌",
  "Touch the center! 👆",
  "Move in the rhythm! 💃",
  "Party Time! 🎉"
];

const InstructionText = () => {
  const [index, setIndex] = useState(0);
  const textRef = useRef();

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Animation
  useFrame(({ clock }) => {
    if (textRef.current) {
      const t = clock.getElapsedTime();
      // Bob up and down
      textRef.current.position.y = 2.5 + Math.sin(t * 2) * 0.2;
      // Slight rotation wobble
      textRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      // Scale pulse
      const scale = 1 + Math.sin(t * 4) * 0.05;
      textRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Text
      ref={textRef}
      position={[0, 2.5, 0]}
      fontSize={0.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#ff00ff"
    >
      {MESSAGES[index]}
    </Text>
  );
};

export default InstructionText;
