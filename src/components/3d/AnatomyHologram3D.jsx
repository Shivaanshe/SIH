import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const clinicalPoints = [
  { id: 'shiro', label: 'Shiro / Nasya', organ: 'Cranial & Nasal Passage', pos: [0, 1.9, 0.4], skill: 'Panchakarma (Nasya & Shirodhara)', hours: '120 hrs Logged', desc: 'Administration of medicated oils/herbal extracts via nasal route for supraclavicular disorders.' },
  { id: 'urja', label: 'Thoracic / Hridaya', organ: 'Chest & Cardiac Region', pos: [0, 0.8, 0.5], skill: 'Kayachikitsa Differential Diagnosis', hours: '240 hrs Logged', desc: 'Ashtavidha Pariksha, Nadi Pariksha, and constitutional metabolic assessment.' },
  { id: 'basti', label: 'Nabhi / Pakvashaya', organ: 'Umbilical & Pelvic Colon', pos: [0, -0.3, 0.5], skill: 'Anuvasana & Niruha Basti Admin', hours: '180 hrs Logged', desc: 'Colon cleansing & restorative enemas; considered half of all Ayurvedic therapeutics.' },
  { id: 'shalya', label: 'Guda / Para-Surgical', organ: 'Anorectal Surgical Zone', pos: [0, -1.2, 0.4], skill: 'Shalya Tantra Ksharasutra Ligation', hours: '95 hrs Logged', desc: 'Para-surgical management of fistula-in-ano using medicated alkaline Ksharasutra seton.' },
  { id: 'pada', label: 'Pada / Abhyanga', organ: 'Foot & Lower Limbs', pos: [0.4, -2.4, 0.3], skill: 'Padabhyanga & Purvakarma Snehana', hours: '150 hrs Logged', desc: 'Therapeutic oleation and Marma reflexology for autonomic nervous stability.' }
];

function HologramMarker({ point, isSelected, onClick }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const s = isSelected ? 1.4 : 1.0;
      meshRef.current.scale.set(s, s, s);
    }
  });

  const markerColor = isSelected ? '#fbbf24' : '#10b981';

  return (
    <group position={point.pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(point);
        }}
        cursor="pointer"
      >
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={isSelected ? 1.0 : 0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting pulsating ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.28, 24]} />
          <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function WireframeBody() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[0.6, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.32} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.7, 0.55, 2.2, 16]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.26} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 0.8, 16]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.26} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.35, -2.2, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 2.0, 12]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh position={[0.35, -2.2, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 2.0, 12]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

export default function AnatomyHologram3D() {
  const [selectedPoint, setSelectedPoint] = useState(clinicalPoints[0]);
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  return (
    <div style={{ position: 'relative', width: '100%', height: '390px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0.3, 0, 6.2], fov: 48 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070c0e']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
            <WireframeBody />
            <group position={[0.6, 0, 0]}>
              {clinicalPoints.map(point => (
                <HologramMarker
                  key={point.id}
                  point={point}
                  isSelected={selectedPoint?.id === point.id}
                  onClick={setSelectedPoint}
                />
              ))}
            </group>
          </Float>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} />
      </Canvas>

      {/* Interactive Left Legend Menu (Clean 2D list instead of floating cluttered buttons) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxWidth: '220px',
        zIndex: 10
      }}>
        <div className="glass-pill" style={{ background: 'rgba(6, 78, 59, 0.85)', borderColor: '#10b981', marginBottom: '4px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
          <span>Marma & Clinical Checkpoints</span>
        </div>

        {clinicalPoints.map(p => {
          const isSelected = selectedPoint?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPoint(p)}
              style={{
                background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.75)',
                border: `1px solid ${isSelected ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                color: isSelected ? '#fbbf24' : '#e2e8f0',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s'
              }}
            >
              <span>{p.label}</span>
              {isSelected && <span style={{ fontSize: '0.65rem' }}>●</span>}
            </button>
          );
        })}
      </div>

      {/* Selected Point Clinical Spec Panel (Clean Bottom Overlay) */}
      {selectedPoint && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          right: '14px',
          background: 'rgba(13, 21, 25, 0.94)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          gap: '10px',
          zIndex: 10
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fbbf24' }}>📍 {selectedPoint.label}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({selectedPoint.organ})</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px' }}>
              Competency: <strong>{selectedPoint.skill}</strong> • {selectedPoint.desc}
            </div>
          </div>
          <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
            {selectedPoint.hours}
          </span>
        </div>
      )}
    </div>
  );
}
