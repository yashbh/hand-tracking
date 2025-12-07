import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveSphere, InteractiveCube, InteractiveTorus } from './InteractiveShapes';
import ObjectSelector from './ObjectSelector';
import PartyEffects from './PartyEffects';
import WelcomeScreen from './WelcomeScreen';
import InstructionText from './InstructionText';
import Fireworks from './Fireworks';
import TrailRenderer from './TrailRenderer';

export default function PartyApp({ onSwitchMode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // State
  const [partyStarted, setPartyStarted] = useState(false);
  const [sphereProps, setSphereProps] = useState({ size: 1.0, color: '#ff00ff' });
  const [selectedShape, setSelectedShape] = useState('sphere');
  const [isDancing, setIsDancing] = useState(true); // Default to Dance Mode
  const [isMuted, setIsMuted] = useState(false); // Default unmuted
  const [isFireworksEnabled, setIsFireworksEnabled] = useState(false); // Default OFF
  const [isDrawingMode, setIsDrawingMode] = useState(false); // NEW: Drawing Mode
  const [status, setStatus] = useState("Initializing...");

  // Drawing State
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);

  // Fireworks State
  const [explosions, setExplosions] = useState([]);
  const explosionIdRef = useRef(0);
  const fireworksEnabledRef = useRef(false);

  // Refs for State Access in Loop
  const isDrawingModeRef = useRef(false);
  const currentStrokeRef = useRef([]);
  const smoothedPosRef = useRef(null); // Smoothing ref

  // Sync Ref with State
  useEffect(() => {
      fireworksEnabledRef.current = isFireworksEnabled;
  }, [isFireworksEnabled]);

  useEffect(() => {
    isDrawingModeRef.current = isDrawingMode;
  }, [isDrawingMode]);

  const triggerExplosion = (position, color) => {
      if (!fireworksEnabledRef.current) return; // Gate
      const id = explosionIdRef.current++;
      setExplosions(prev => [...prev, { id, position, color }]);
  };

  const removeExplosion = (id) => {
      setExplosions(prev => prev.filter(e => e.id !== id));
  };

  // Audio Ref
  const audioRef = useRef(new Audio('/assets/party-music-348444.mp3'));

  // Effect to handle Audio Playback
  useEffect(() => {
      const audio = audioRef.current;
      audio.loop = true;
      audio.volume = 0.5;

      if (isDancing && partyStarted) {
          audio.play().catch(e => console.log("Audio play failed:", e));
      } else {
          audio.pause();
          if (!partyStarted) audio.currentTime = 0;
      }
      return () => {
          audio.pause();
      };
  }, [isDancing, partyStarted]);

  // Effect to handle Mute
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.muted = isMuted;
      }
  }, [isMuted]);

  // Refs for logic
  const lastColorChangeTime = useRef(0);
  const currentSizeRef = useRef(1.0);

  // Gesture Refs (for Pinch Release "Throw")
  const wasPinchedRef = useRef(false);

  // MAIN LOGIC LOOP - Dependent on partyStarted
  useEffect(() => {
    if (!partyStarted) return; // Don't init until started

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    // Safety check just in case refs aren't ready (though they should be if partyStarted is true)
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');

    // Config
    const Hands = window.Hands;
    const Camera = window.Camera;

    // Initialize MediaPipe
    const onResults = (results) => {
        // Clear canvas
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Match dimensions
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Draw Landmarks
        if (results.multiHandLandmarks) {
            if (results.multiHandLandmarks.length > 0) {
                 setStatus("Hands Detected!");
            } else {
                 setStatus("Scanning...");
            }

            for (const landmarks of results.multiHandLandmarks) {
                if (window.drawConnectors) {
                    window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
                    window.drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
                }

                // Interaction Logic
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];
                const dist = Math.sqrt(Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2));
                const isPinched = dist < 0.05;

                // 3D POSITION MAPPING
                const rawX = (indexTip.x - 0.5) * -10;
                const rawY = -(indexTip.y - 0.5) * 8;
                const z = 0; // Flat drawing for now

                // SMOOTHING (LERP)
                // Initialize if first frame
                if (!smoothedPosRef.current) {
                    smoothedPosRef.current = { x: rawX, y: rawY };
                }

                // LERP factor: 0.1 = very smooth/slow, 0.5 = responsive/jittery
                const alpha = 0.2;
                smoothedPosRef.current.x += (rawX - smoothedPosRef.current.x) * alpha;
                smoothedPosRef.current.y += (rawY - smoothedPosRef.current.y) * alpha;

                const x = smoothedPosRef.current.x;
                const y = smoothedPosRef.current.y;

                // --- MODE: DRAWING ---
                if (isDrawingModeRef.current) {
                    if (isPinched) {
                        // Add point
                        const point = [x, y, z];
                        currentStrokeRef.current.push(point);
                        // Real-time update for responsiveness
                        setCurrentStroke([...currentStrokeRef.current]);
                    } else {
                        // Not pinched
                        if (wasPinchedRef.current) {
                            // Just released - Save stroke
                            if (currentStrokeRef.current.length > 1) { // Prevents single-point crash
                                setStrokes(prev => [...prev, currentStrokeRef.current]);
                            }
                            // Always clear
                            currentStrokeRef.current = [];
                            setCurrentStroke([]);
                        }
                    }
                }

                // --- MODE: INTERACTIVE (Default) ---
                else {
                     // Scale Logic
                    let targetSize = 1.0;
                    if (isPinched) targetSize = 0.2;
                    else if (dist > 0.2) targetSize = 2.0;

                    const alpha = 0.1;
                    currentSizeRef.current += (targetSize - currentSizeRef.current) * alpha;

                    // Fireworks Gesture
                    if (wasPinchedRef.current && !isPinched) {
                        const color = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'][Math.floor(Math.random() * 5)];
                        triggerExplosion([x, y, z], color);
                    }

                    // Touch Color
                    const distFromCenter = Math.sqrt(Math.pow(indexTip.x - 0.5, 2) + Math.pow(indexTip.y - 0.5, 2));
                    if (distFromCenter < 0.2) {
                         const now = Date.now();
                         if (now - lastColorChangeTime.current > 500) {
                             const colors = ['#FF00FF', '#00FFFF', '#FF3300', '#39FF14', '#ffff00'];
                             const randomColor = colors[Math.floor(Math.random() * colors.length)];
                             setSphereProps(prev => ({ ...prev, color: randomColor }));
                             lastColorChangeTime.current = now;
                             triggerExplosion([0, 0, 1], randomColor);
                         }
                    }
                }

                wasPinchedRef.current = isPinched;
            }
            if (!isDrawingModeRef.current) {
                setSphereProps(prev => ({ ...prev, size: currentSizeRef.current }));
            }
        }
        canvasCtx.restore();
    };

    if (Hands) {
        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        hands.onResults(onResults);

        if (Camera) {
            const camera = new Camera(videoElement, {
                onFrame: async () => await hands.send({ image: videoElement }),
                width: 1920,
                height: 1080
            });
            camera.start().catch(err => setStatus("Camera Error: " + err.message));
        }
    }

    return () => {
         // Cleanup if component unmounts
         audioRef.current.pause();
    };
  }, [partyStarted]);

  return (
    <div className="party-bg" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

        {!partyStarted && (
            <WelcomeScreen onEnter={() => setPartyStarted(true)} />
        )}

        {/* Webcam Feed (HIDDEN) */}
        <video ref={videoRef} style={{
            position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)',
            opacity: 0,
        }} />

        {/* Canvas Overlay */}
        <canvas ref={canvasRef} style={{
            position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', pointerEvents: 'none',
            zIndex: 1,
            opacity: partyStarted ? 1 : 0 // Hide until started
        }} />

        {/* 3D Scene */}
        {partyStarted && (
            <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
                <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
                    {/* Fog for depth and seamless blend with background */}
                    <fog attach="fog" args={['#1a1a2e', 5, 25]} />

                    <ambientLight intensity={isDancing ? 0.4 : 0.6} color="#b0b0ff" />
                    <pointLight position={[10, 10, 10]} intensity={isDancing ? 0.8 : 1.2} color="#ffddaa" />
                    <pointLight position={[-10, -5, -10]} intensity={0.5} color="#cc00cc" />

                    {!isDrawingMode && selectedShape === 'sphere' && <InteractiveSphere size={sphereProps.size} color={sphereProps.color} />}
                    {!isDrawingMode && selectedShape === 'cube' && <InteractiveCube size={sphereProps.size} color={sphereProps.color} />}
                    {!isDrawingMode && selectedShape === 'torus' && <InteractiveTorus size={sphereProps.size} color={sphereProps.color} />}

                    {isDancing && <PartyEffects />}

                    {/* Instructions - Only in Party Object Mode */}
                    {!isDrawingMode && isDancing && <InstructionText />}

                    <Fireworks explosions={explosions} removeExplosion={removeExplosion} />

                    {/* Drawing */}
                    <TrailRenderer strokes={strokes} currentStroke={currentStroke} />

                </Canvas>
            </div>
        )}

        {/* UI Controls - Only show when started */}
        {partyStarted && (
            <>
                <ObjectSelector
                    current={selectedShape}
                    onSelect={setSelectedShape}
                    isDancing={isDancing}
                    onToggleDance={() => setIsDancing(!isDancing)}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                    isFireworksEnabled={isFireworksEnabled}
                    onToggleFireworks={() => setIsFireworksEnabled(!isFireworksEnabled)}
                    isDrawingMode={isDrawingMode}
                    onToggleDrawing={() => setIsDrawingMode(!isDrawingMode)}
                />

                <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 20, zIndex: 20, fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {isDrawingMode ? "Mode: Drawing (Pinch to Draw)" : status}
                </div>

                {/* Branding */}
                <a
                    href="https://www.linkedin.com/in/yash-bhati-820b35118/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        color: 'white',
                        textDecoration: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '10px 20px',
                        borderRadius: 20,
                        zIndex: 20,
                        fontSize: '0.9rem',
                        letterSpacing: '1px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    Designed by Yash Bhati
                    <span style={{ fontSize: '1.2em' }}>⚡️</span>
                </a>


            </>
        )}
    </div>
  );
}
