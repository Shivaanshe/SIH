import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const clinicalPoints = [
  { id: 'shiro', name: 'Shiro / Nasya (Cranial Cleansing)', pos: [0, 2.2, 0.4], skill: 'Panchakarma (Nasya & Shirodhara)', hours: '120 hrs Logged' },
  { id: 'urja', name: 'Thoracic / Hridaya (Kayachikitsa)', pos: [0, 1.1, 0.5], skill: 'Kayachikitsa Differential Diagnosis', hours: '240 hrs Logged' },
  { id: 'basti', name: 'Nabhi / Pakvashaya (Basti Therapy)', pos: [0, -0.2, 0.5], skill: 'Anuvasana & Niruha Basti Admin', hours: '180 hrs Logged' },
  { id: 'shalya', name: 'Guda Marma (Shalya / Ksharasutra)', pos: [0, -1.2, 0.4], skill: 'Shalya Tantra Ksharasutra Ligation', hours: '95 hrs Logged' },
  { id: 'pada', name: 'Pada / Abhyanga Reflexology', pos: [0.6, -2.8, 0.3], skill: 'Padabhyanga & Purvakarma Snehana', hours: '150 hrs Logged' }
];

function HologramMarker({ point, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={point.pos}>
      <mesh
        onClick={() => onClick(point)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isSelected ? 1.5 : hovered ? 1.3 : 1.0}
      >
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#fbbf24' : hovered ? '#38bdf8' : '#10b981'}
          emissive={isSelected ? '#fbbf24' : hovered ? '#38bdf8' : '#10b981'}
          emissiveIntensity={0.8}
        />
      </mesh>

      <Html position={[0, 0.35, 0]} center distanceFactor={10}>
        <div
          onClick={() => onClick(point)}
          style={{
            background: isSelected ? 'rgba(245, 158, 11, 0.9)' : 'rgba(7, 12, 14, 0.85)',
            border: `1px solid ${isSelected ? '#fbbf24' : '#10b981'}`,
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '9px',
            fontWeight: 'bold',
            color: isSelected ? '#000000' : '#ffffff',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
        >
          {point.name.split(' ')[0]}
        </div>
      </Html>
    </group>
  );
}

function WireframeBody() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.65, 2.4, 16]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.65, 0.55, 0.9, 16]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.45, -2.4, 0]}>
        <cylinderGeometry args={[0.25, 0.18, 2.2, 12]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh position={[0.45, -2.4, 0]}>
        <cylinderGeometry args={[0.25, 0.18, 2.2, 12]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function AnatomyHologram3D() {
  const [selectedPoint, setSelectedPoint] = useState(clinicalPoints[0]);
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  return (
    <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 48 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070c0e']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <WireframeBody />
            {clinicalPoints.map(point => (
              <HologramMarker
                key={point.id}
                point={point}
                isSelected={selectedPoint?.id === point.id}
                onClick={setSelectedPoint}
              />
            ))}
          </Float>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>

      {/* Selected Point Clinical Spec Panel */}
      {selectedPoint && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          background: 'rgba(13, 21, 25, 0.92)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f1f5f9' }}>
              📍 {selectedPoint.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '2px' }}>
              Mapped Competency: {selectedPoint.skill}
            </div>
          </div>
          <span className="glass-pill badge-emerald">
            {selectedPoint.hours}
          </span>
        </div>
      )}
    </div>
  );
}
