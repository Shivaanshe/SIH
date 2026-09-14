import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';

function ConstellationNode({ position, skill, isSelected, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  const nodeColor = isSelected ? '#fbbf24' : hovered ? '#38bdf8' : '#10b981';
  const label = skill.name.split(' ')[0];

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(skill);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={isSelected ? 1.35 : hovered ? 1.2 : 1.0}
      >
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={isSelected ? 0.9 : hovered ? 0.7 : 0.4}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.62, 32]} />
          <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Sleek WebGL 3D Native Text (Never collides with HTML or covers the UI) */}
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.28}
        color={isSelected ? '#fbbf24' : '#ffffff'}
        anchorX="center"
        anchorY="top"
        fillOpacity={isSelected ? 1 : 0.85}
      >
        {label}
      </Text>
    </group>
  );
}

function ConstellationLines({ nodes }) {
  const linePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < 4.2) {
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
      <lineBasicMaterial color="#10b981" transparent opacity={0.28} />
    </lineSegments>
  );
}

export default function SkillConstellation3D({ onSelectSkill }) {
  const { domainPack } = useApp();
  const { activeTaxonomy } = useData();
  const [selectedSkill, setSelectedSkill] = useState(activeTaxonomy[0] || null);

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  // Position nodes comfortably in upper hemisphere
  const nodes = useMemo(() => {
    const radius = 3.2;
    return activeTaxonomy.map((skill, index) => {
      const phi = Math.acos(-1 + (2 * index) / activeTaxonomy.length);
      const theta = Math.sqrt(activeTaxonomy.length * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi) * 0.65 + 0.5; // Offset upwards
      const z = radius * Math.cos(phi) * 0.7;
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
    <div style={{ position: 'relative', width: '100%', height: '390px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0.4, 7.8], fov: 46 }}
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
            />
          ))}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.35}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Floating HUD instructions */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        pointerEvents: 'none'
      }}>
        <div className="glass-pill" style={{ background: 'rgba(6, 78, 59, 0.8)', borderColor: '#10b981' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
          <span>Click any 3D node to inspect competency</span>
        </div>
      </div>

      {/* Clean Bottom Inspector Panel (Well below 3D nodes) */}
      {selectedSkill && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          right: '14px',
          background: 'rgba(13, 21, 25, 0.94)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
              <h4 style={{ fontSize: '0.94rem', color: '#ffffff' }}>{selectedSkill.name}</h4>
              <span className="glass-pill" style={{ fontSize: '0.7rem' }}>{selectedSkill.category}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '650px' }}>
              {selectedSkill.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
              {selectedSkill.resources?.length || 2} Curated Modules
            </span>
            <span className="glass-pill badge-amber" style={{ fontSize: '0.72rem' }}>
              Verified Taxonomy Node
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
