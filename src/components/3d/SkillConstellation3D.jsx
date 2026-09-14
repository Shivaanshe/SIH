import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';

function ConstellationNode({ position, skill, isSelected, onClick, isMobile }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  const nodeColor = isSelected ? '#fbbf24' : hovered ? '#38bdf8' : '#10b981';

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(skill);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isSelected ? 1.4 : hovered ? 1.25 : 1.0}
      >
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={isSelected ? 0.9 : hovered ? 0.7 : 0.4}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Orbiting wireframe ring for selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.78, 32]} />
          <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 3D Label */}
      <Html position={[0, -0.65, 0]} center distanceFactor={14}>
        <div
          onClick={() => onClick(skill)}
          style={{
            background: isSelected ? 'rgba(245, 158, 11, 0.92)' : 'rgba(7, 12, 14, 0.85)',
            color: isSelected ? '#000000' : '#ffffff',
            border: `1px solid ${isSelected ? '#fbbf24' : 'rgba(52, 211, 153, 0.3)'}`,
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s'
          }}
        >
          {skill.name.split(' ')[0]}
        </div>
      </Html>
    </group>
  );
}

// 3D Connecting Lines between related skills
function ConstellationLines({ nodes }) {
  const linePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // connect adjacent or related skills
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < 4.5) {
          points.push(nodes[i].pos);
          points.push(nodes[j].pos);
        }
      }
    }
    return points;
  }, [nodes]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#10b981" transparent opacity={0.25} />
    </lineSegments>
  );
}

export default function SkillConstellation3D({ onSelectSkill }) {
  const { domainPack } = useApp();
  const { activeTaxonomy, batchCurriculumGaps } = useData();
  const [selectedSkill, setSelectedSkill] = useState(activeTaxonomy[0] || null);

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  // Position skills on a 3D hemisphere
  const nodes = useMemo(() => {
    const radius = 3.8;
    return activeTaxonomy.map((skill, index) => {
      const phi = Math.acos(-1 + (2 * index) / activeTaxonomy.length);
      const theta = Math.sqrt(activeTaxonomy.length * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi) * 0.75;
      const z = radius * Math.cos(phi) * 0.8;
      return {
        skill,
        pos: new THREE.Vector3(x, y, z)
      };
    });
  }, [activeTaxonomy]);

  const handleNodeClick = (skill) => {
    setSelectedSkill(skill);
    if (onSelectSkill) onSelectSkill(skill);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070c0e']} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />

        <Suspense fallback={null}>
          <ConstellationLines nodes={nodes} />
          {nodes.map(({ skill, pos }) => (
            <ConstellationNode
              key={skill.id}
              position={pos}
              skill={skill}
              isSelected={selectedSkill?.id === skill.id}
              onClick={handleNodeClick}
              isMobile={isMobile}
            />
          ))}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.4}
        />
      </Canvas>

      {/* Floating Interactive Inspector Panel for Selected Node */}
      {selectedSkill && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          background: 'rgba(13, 21, 25, 0.92)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
              <h4 style={{ fontSize: '0.92rem', color: '#ffffff' }}>{selectedSkill.name}</h4>
              <span className="glass-pill" style={{ fontSize: '0.7rem' }}>{selectedSkill.category}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '600px' }}>
              {selectedSkill.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="glass-pill badge-emerald">
              {selectedSkill.resources?.length || 2} Learning Curations
            </span>
            <span className="glass-pill badge-amber">
              Verified Taxonomy Node
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
