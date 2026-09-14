import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import WebGLFallback from './WebGLFallback';
import { useApp } from '../../context/AppContext';

// Check WebGL availability
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// Interactive Particle Bridge Connecting Academia & Industry
function BridgeParticles({ count = 280, domainPack = "ayush" }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorAcademia = domainPack === 'ayush' ? new THREE.Color('#10b981') : new THREE.Color('#06b6d4');
    const colorIndustry = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      // Curve along X axis from -6 to 6
      const u = (i / count);
      const x = (u - 0.5) * 12;
      const y = Math.sin(u * Math.PI) * 2.2 + (Math.random() - 0.5) * 0.8;
      const z = (Math.random() - 0.5) * 2.5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color lerp from Academia (left) to Industry (right)
      const lerpedColor = colorAcademia.clone().lerp(colorIndustry, u);
      col[i * 3] = lerpedColor.r;
      col[i * 3 + 1] = lerpedColor.g;
      col[i * 3 + 2] = lerpedColor.b;
    }

    return [pos, col];
  }, [count, domainPack]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const u = i / count;
      const yBase = Math.sin(u * Math.PI) * 2.2;
      // Add dynamic wave ripple
      positionAttr.setY(i, yBase + Math.sin(time * 2 + u * 10) * 0.35);
      positionAttr.setZ(i, Math.cos(time * 1.5 + u * 8) * 0.6);
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Interactive Left Anchor Node: Academia (Institutes & Students)
function AcademiaAnchor({ domainPack = "ayush" }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  const primaryColor = domainPack === 'ayush' ? '#10b981' : '#06b6d4';

  return (
    <group position={[-5.5, 0.4, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color={primaryColor}
            wireframe
            emissive={primaryColor}
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      </Float>

      <Html position={[0, -1.8, 0]} center distanceFactor={12}>
        <div style={{
          background: 'rgba(6, 78, 59, 0.85)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: '8px',
          padding: '4px 10px',
          whiteSpace: 'nowrap',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
        }}>
          🎓 ACADEMIA (AIIA)
          <div style={{ fontSize: '9px', opacity: 0.85, fontWeight: 'normal' }}>Curriculum & Student Profiles</div>
        </div>
      </Html>
    </group>
  );
}

// Interactive Right Anchor Node: Industry (Employers & Job Postings)
function IndustryAnchor() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group position={[5.5, 0.4, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color="#f59e0b"
            wireframe
            emissive="#f59e0b"
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      </Float>

      <Html position={[0, -1.8, 0]} center distanceFactor={12}>
        <div style={{
          background: 'rgba(120, 53, 15, 0.85)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '8px',
          padding: '4px 10px',
          whiteSpace: 'nowrap',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
        }}>
          🏢 INDUSTRY (RECRUITERS)
          <div style={{ fontSize: '9px', opacity: 0.85, fontWeight: 'normal' }}>Weighted Skills & Hiring Demands</div>
        </div>
      </Html>
    </group>
  );
}

// Central Skill Intelligence Diagnostic Nexus
function DiagnosticNexus({ domainPack = "ayush" }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      <Float speed={3} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            wireframe
            emissive="#38bdf8"
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>

      <Html position={[0, -1.2, 0]} center distanceFactor={12}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.5)',
          borderRadius: '8px',
          padding: '4px 8px',
          whiteSpace: 'nowrap',
          color: '#38bdf8',
          fontSize: '10px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.35)'
        }}>
          ✨ KAUSHALSETU AI ENGINE
          <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 'normal' }}>
            Explainable Match % & Gap Radar
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function SkillBridgeCanvas() {
  const { domainPack } = useApp();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  if (!hasWebGL) {
    return <WebGLFallback title="KaushalSetu Skill Bridge" domainPack={domainPack} />;
  }

  return (
    <div className="canvas-container" style={{ height: '380px', width: '100%', position: 'relative' }}>
      {/* 3D Canvas Viewport */}
      <Canvas
        camera={{ position: [0, 1.2, 10], fov: 45 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070c0e']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        <Suspense fallback={null}>
          <AcademiaAnchor domainPack={domainPack} />
          <BridgeParticles count={isMobile ? 160 : 320} domainPack={domainPack} />
          <DiagnosticNexus domainPack={domainPack} />
          <IndustryAnchor />
        </Suspense>

        {/* OrbitControls with isolated zoom to prevent stealing page scroll */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Floating HUD Badges on Top */}
      <div className="canvas-hud">
        <div className="glass-pill" style={{ background: 'rgba(6, 78, 59, 0.75)', borderColor: '#10b981' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }} />
          <span>SIH26044 3D Dynamic Skill Bridge</span>
          <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>• Drag to Orbit</span>
        </div>
      </div>
    </div>
  );
}
