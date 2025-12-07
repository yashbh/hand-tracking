import React, { useRef, useState , useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { portfolioData } from '../../data/portfolioData';


const Node = ({ node, onClick, isSelected }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Pulse animation
            const t = state.clock.getElapsedTime();
            const scale = node.size * (1 + Math.sin(t * 3 + node.position[0]) * 0.1);
            const targetScale = hovered || isSelected ? scale * 1.5 : scale;

            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group position={node.position}>
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onClick(node); }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={hovered || isSelected ? 2 : 0.5}
                    toneMapped={false}
                />
            </mesh>

            {/* Label */}
            <Text
                position={[0, 0.8, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {node.label}
            </Text>

            {/* Info Overlay (Only if selected) */}
            {isSelected && (
                <Html position={[0, -0.8, 0]} center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)',
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${node.color}`,
                        color: 'white',
                        width: '150px',
                        textAlign: 'center',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <h4 style={{ margin: '0 0 5px 0', color: node.color }}>{node.label}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem' }}>{node.info}</p>
                    </div>
                </Html>
            )}
        </group>
    );
};

const Connection = ({ start, end }) => {
    // simple line
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.2} linewidth={1} />
        </line>
    );
};

// Internal component to handle R3F hooks
const HandInteraction = ({ handCursor, pinchDistance, activeNodes, expandedNodesRef, setActiveNodes, setActiveLinks }) => {
    useFrame(() => {
        if (!handCursor) return;

        // Check proximity to nodes
        activeNodes.forEach(node => {
            const dx = handCursor[0] - node.position[0];
            const dy = handCursor[1] - node.position[1];
            const dist = Math.sqrt(dx*dx + dy*dy);

            // Interaction Threshold
            if (dist < 1.5) {
                // Expansion Logic based on Pinch/Open
                if (node.children) {
                    const isExpanded = expandedNodesRef.current.has(node.id);
                    const isOpenHand = pinchDistance > 0.1; // Threshold for "Open"

                    if (isOpenHand && !isExpanded) {
                         // EXPAND
                         expandedNodesRef.current.add(node.id);
                         const newNodes = [];
                         const newLinks = [];
                         node.children.forEach((child) => {
                            // Generate surrounding positions
                            const radius = 3.0;
                            const theta = Math.random() * Math.PI * 2;
                            const phi = Math.acos((Math.random() * 2) - 1);
                            const nx = node.position[0] + radius * Math.sin(phi) * Math.cos(theta);
                            const ny = node.position[1] + radius * Math.sin(phi) * Math.sin(theta);
                            const nz = node.position[2] + radius * Math.cos(phi);

                            newNodes.push({ ...child, id: `${node.id}-${child.id}`, size: 0.7, position: [nx, ny, nz] });
                            newLinks.push({ source: node.id, target: `${node.id}-${child.id}` });
                         });
                         setActiveNodes(prev => [...prev, ...newNodes]);
                         setActiveLinks(prev => [...prev, ...newLinks]);
                    } else if (!isOpenHand && isExpanded && pinchDistance < 0.05) {
                        // COLLAPSE (Pinch to Close)
                        expandedNodesRef.current.delete(node.id);
                        // Filter out children
                        const childIds = node.children.map(c => `${node.id}-${c.id}`);
                        setActiveNodes(prev => prev.filter(n => !childIds.includes(n.id)));
                        setActiveLinks(prev => prev.filter(l => !childIds.includes(l.target)));
                    }
                }
            }
        });
    });
    return null;
};

export default function NeuralNetworkScene({ onExit }) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [activeNodes, setActiveNodes] = useState(portfolioData.nodes);
    const [activeLinks, setActiveLinks] = useState(portfolioData.links);
    const expandedNodesRef = useRef(new Set());

    // Hand Tracking State
    const videoRef = useRef(null);
    const [handCursor, setHandCursor] = useState(null); // [x, y, z]
    const [pinchDistance, setPinchDistance] = useState(0);

    // MediaPipe Initialization
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const Hands = window.Hands;
        const Camera = window.Camera;

        if (Hands) {
            const hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });
            hands.setOptions({
                maxNumHands: 1, // Single hand control
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults((results) => {
                if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                    const landmarks = results.multiHandLandmarks[0];
                    const indexTip = landmarks[8];
                    const thumbTip = landmarks[4];

                    // Map to 3D Space (Approximate)
                    const x = (indexTip.x - 0.5) * -15; // Wider range for neural net
                    const y = -(indexTip.y - 0.5) * 12;
                    const z = 2; // Fixed depth for cursor

                    setHandCursor([x, y, z]);

                    // Pinch Distance
                    const dist = Math.sqrt(Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2));
                    setPinchDistance(dist);
                } else {
                    setHandCursor(null);
                }
            });

            if (Camera) {
                const camera = new Camera(videoElement, {
                    onFrame: async () => await hands.send({ image: videoElement }),
                    width: 640,
                    height: 480
                });
                camera.start();
            }
        }
    }, []);

    const handleNodeClick = (node) => {
        setSelectedNode(node);

        // Original expansion logic removed as hand control handles it
        // if (node.children && !expandedNodesRef.current.has(node.id)) {
        //     expandedNodesRef.current.add(node.id); // Mark expanded
        //     // ... (rest of expansion logic)
        // }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#050510' }}>
            {/* Hidden Video for MP */}
            <video ref={videoRef} style={{ display: 'none' }} />

            <Canvas camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <OrbitControls enableZoom={true} autoRotate={!handCursor} autoRotateSpeed={0.5} />

                {/* Hand Logic */}
                <HandInteraction
                    handCursor={handCursor}
                    pinchDistance={pinchDistance}
                    activeNodes={activeNodes}
                    expandedNodesRef={expandedNodesRef}
                    setActiveNodes={setActiveNodes}
                    setActiveLinks={setActiveLinks}
                />

                {/* Hand Cursor */}
                {handCursor && (
                    <mesh position={handCursor}>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshBasicMaterial color={pinchDistance > 0.1 ? "#00ff00" : "#ff0000"} opacity={0.5} transparent />
                    </mesh>
                )}

                {/* Render Links */}
                {activeLinks.map((link, i) => {
                    const startNode = activeNodes.find(n => n.id === link.source);
                    const endNode = activeNodes.find(n => n.id === link.target);
                    // Guard against missing nodes during state updates
                    if (!startNode || !endNode) return null;
                    return <Connection key={i} start={startNode.position} end={endNode.position} />;
                })}

                {/* Render Nodes */}
                {activeNodes.map((node) => (
                    <Node
                        key={node.id}
                        node={node}
                        onClick={setSelectedNode}
                        isSelected={selectedNode?.id === node.id}
                    />
                ))}

                <gridHelper args={[20, 20, 0x222222, 0x111111]} position={[0, -4, 0]} />
            </Canvas>

            {/* Back Button */}
            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    zIndex: 100
                }}
            >
                ← Back to Party
            </button>

            <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center', color: '#666', pointerEvents: 'none' }}>
                Hand Control: Hover & Open Hand to Expand, Pinch to Close
            </div>
        </div>
    );
}
