import React from 'react';
import { Line } from '@react-three/drei';

const TrailRenderer = ({ strokes, currentStroke }) => {
  return (
    <group>
      {/* Render completed strokes */}
      {/* Render completed strokes */}
      {strokes.map((stroke, i) => (
        stroke.length > 1 && (
        <Line
          key={i}
          points={stroke}
          color="#00ffff"
          lineWidth={3}
          opacity={0.8}
          transparent
          vertexColors={false}
        />
        )
      ))}

      {/* Render current active stroke */}
      {currentStroke.length > 1 && (
        <Line
          points={currentStroke}
          color="#ff00ff"
          lineWidth={4}
          opacity={1}
          transparent
        />
      )}
    </group>
  );
};

export default TrailRenderer;
