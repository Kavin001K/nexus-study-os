import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

const subjectColors: Record<string, string> = {
  physics: '#3b82f6',
  chemistry: '#22c55e',
  biology: '#a855f7',
  math: '#f59e0b',
  history: '#ef4444',
  polity: '#ec4899',
  economics: '#14b8a6',
  geography: '#8b5cf6',
};

function KnowledgeNode({
  node,
  isHovered,
  onHover
}: {
  node: any;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = subjectColors[node.subject] || '#60a5fa';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      if (isHovered) {
        meshRef.current.scale.setScalar(1.3);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={node.position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => onHover(node.id)}
          onPointerOut={() => onHover(null)}
        >
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={isHovered ? 1 : 0.85}
          />
        </mesh>

        {/* Glow sphere */}
        <mesh scale={isHovered ? 1.8 : 1.2}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isHovered ? 0.15 : 0.05}
          />
        </mesh>

        {/* Label */}
        <Text
          position={[0, -0.9, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>

        {/* Content count badge */}
        {isHovered && (
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.15}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {node.contentCount} resources
          </Text>
        )}
      </group>
    </Float>
  );
}

function ConnectionLines({ nodes }: { nodes: any[] }) {
  const lines = useMemo(() => {
    const result: { start: [number, number, number]; end: [number, number, number] }[] = [];
    const processed = new Set<string>();

    nodes.forEach(node => {
      node.connections.forEach((connId: string) => {
        const key = [node.id, connId].sort().join('-');
        if (!processed.has(key)) {
          const connNode = nodes.find(n => n.id === connId);
          if (connNode) {
            result.push({
              start: node.position,
              end: connNode.position,
            });
            processed.add(key);
          }
        }
      });
    });

    return result;
  }, [nodes]);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#3b82f6"
          lineWidth={1}
          transparent
          opacity={0.3}
          dashed
          dashScale={2}
          dashSize={0.2}
          dashOffset={0}
        />
      ))}
    </>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0002;
      particlesRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

import { useNodes } from '@/hooks/queries';

function Scene() {
  const { data: knowledgeNodes = [] } = useNodes();
  const { hoveredNode, setHoveredNode } = useAppStore();

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

      <ParticleField />
      <ConnectionLines nodes={knowledgeNodes} />

      {knowledgeNodes.map((node) => (
        <KnowledgeNode
          key={node.id}
          node={node}
          isHovered={hoveredNode === node.id}
          onHover={setHoveredNode}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export function KnowledgeGraph() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
