import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import WebGLFallback from './WebGLFallback';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Briefcase, Sparkles } from 'lucide-react';

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// Flowing 3D Particle Wave connecting Academia and Industry
function BridgeParticles({ count = 260, domainPack = "ayush" }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorAcademia = domainPack === 'ayush' ? new THREE.Color('#10b981') : new THREE.Color('#06b6d4');
    const colorIndustry = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      const u = i / count;
      const x = (u - 0.5) * 11;
      const y = Math.sin(u * Math.PI) * 1.8 + (Math.random() - 0.5) * 0.6;
      const z = (Math.random() - 0.5) * 1.8;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const lerped = colorAcademia.clone().lerp(colorIndustry, u);
      col[i * 3] = lerped.r;
      col[i * 3 + 1] = lerped.g;
      col[i * 3 + 2] = lerped.b;
    }

    return [pos, col];
  }, [count, domainPack]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const u = i / count;
      const yBase = Math.sin(u * Math.PI) * 1.8;
      posAttr.setY(i, yBase + Math.sin(time * 2.2 + u * 9) * 0.28);
      posAttr.setZ(i, Math.cos(time * 1.8 + u * 7) * 0.5);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Pure 3D Anchor: Academia (Left)
function AcademiaAnchor({ domainPack = "ayush", onHover, isHovered }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const primaryColor = domainPack === 'ayush' ? '#10b981' : '#06b6d4';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.6;
    }
  });

  return (
    <group
      position={[-5.2, 0.3, 0]}
      onPointerOver={() => onHover('academia')}
      onPointerOut={() => onHover(null)}
    >
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        {/* Outer wireframe octahedron */}
        <mesh ref={meshRef} scale={isHovered ? 1.25 : 1.0}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color={primaryColor}
            wireframe
            emissive={primaryColor}
            emissiveIntensity={isHovered ? 0.9 : 0.5}
          />
        </mesh>

        {/* Orbiting Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[1.3, 1.38, 32]} />
          <meshBasicMaterial color={primaryColor} side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Pure 3D Anchor: Industry (Right)
function IndustryAnchor({ onHover, isHovered }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = -t * 0.5;
      meshRef.current.rotation.z = Math.cos(t * 0.4) * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6;
    }
  });

  return (
    <group
      position={[5.2, 0.3, 0]}
      onPointerOver={() => onHover('industry')}
      onPointerOut={() => onHover(null)}
    >
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        {/* Outer wireframe dodecahedron */}
        <mesh ref={meshRef} scale={isHovered ? 1.25 : 1.0}>
          <dodecahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial
            color="#f59e0b"
            wireframe
            emissive="#f59e0b"
            emissiveIntensity={isHovered ? 0.9 : 0.5}
          />
        </mesh>

        {/* Orbiting Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 3, 0, 0]}>
          <ringGeometry args={[1.25, 1.33, 32]} />
          <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Pure 3D Diagnostic Nexus: Center
function DiagnosticNexus({ onHover, isHovered }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.7;
      meshRef.current.rotation.x = t * 0.35;
    }
  });

  return (
    <group
      position={[0, 1.5, 0]}
      onPointerOver={() => onHover('nexus')}
      onPointerOut={() => onHover(null)}
    >
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh ref={meshRef} scale={isHovered ? 1.25 : 1.0}>
          <icosahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            wireframe
            emissive="#38bdf8"
            emissiveIntensity={isHovered ? 1.0 : 0.6}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
        </mesh>
      </Float>
    </group>
  );
}

export default function SkillBridgeCanvas() {
  const { domainPack } = useApp();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  if (!hasWebGL) {
    return <WebGLFallback title="KaushalSetu Skill Bridge" domainPack={domainPack} />;
  }

  return (
    <div className="canvas-container" style={{ height: '360px', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0.8, 9.5], fov: 46 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070c0e']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        <Suspense fallback={null}>
          <AcademiaAnchor domainPack={domainPack} onHover={setHoveredNode} isHovered={hoveredNode === 'academia'} />
          <BridgeParticles count={isMobile ? 160 : 300} domainPack={domainPack} />
          <DiagnosticNexus onHover={setHoveredNode} isHovered={hoveredNode === 'nexus'} />
          <IndustryAnchor onHover={setHoveredNode} isHovered={hoveredNode === 'industry'} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.3}
        />
      </Canvas>

      {/* Sleek, Non-Intrusive HUD Overlay (Fixed at Bottom & Corners) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div className="glass-pill" style={{ background: 'rgba(6, 78, 59, 0.8)', borderColor: '#10b981' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }} />
          <span>KaushalSetu 3D Bridge</span>
          <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>• Drag to Orbit</span>
        </div>
      </div>

      {/* Interactive Bottom Anchor Badges (Clean 2D Overlays that don't block 3D) */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '14px',
        right: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {/* Academia Left Info */}
        <div style={{
          background: 'rgba(6, 78, 59, 0.85)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          transition: 'all 0.2s'
        }}>
          <GraduationCap size={15} color="#34d399" />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ffffff' }}>ACADEMIA (AIIA)</div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Student Competencies & Case Logs</div>
          </div>
        </div>

        {/* KaushalSetu Nexus Center Info */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          <Sparkles size={14} color="#38bdf8" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#38bdf8' }}>AI DIAGNOSTIC NEXUS</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Dynamic Matching & Gap Analysis</div>
          </div>
        </div>

        {/* Industry Right Info */}
        <div style={{
          background: 'rgba(120, 53, 15, 0.85)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          <Briefcase size={15} color="#fbbf24" />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ffffff' }}>INDUSTRY (RECRUITERS)</div>
            <div style={{ fontSize: '0.68rem', color: '#fde68a' }}>Weighted Skills & Role Requirements</div>
          </div>
        </div>
      </div>
    </div>
  );
}
