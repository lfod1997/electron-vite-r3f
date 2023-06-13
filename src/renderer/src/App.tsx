import Versions from './components/Versions';
import { useRef } from 'react';
import { Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, useFrame, extend, useThree, Node } from '@react-three/fiber';

// Use `extend` utility function to generate corresponding JSX tag
extend({ OrbitControls });

// Inject into `ThreeElements` interface to support static typing in JSX
declare module '@react-three/fiber' {
  // noinspection JSUnusedGlobalSymbols
  interface ThreeElements {
    orbitControls: Node<OrbitControls, typeof OrbitControls>;
  }
}

const Scene = () => {
  const meshRef = useRef<Mesh>(null);
  const { camera, gl: { domElement } } = useThree();

  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.5;
    }
  });

  return (
    <>
      <orbitControls args={[camera, domElement]} />
      <directionalLight intensity={0.4} />
      <ambientLight intensity={0.5} />
      <group>
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1.625, 0.5, 96, 16]} />
          <meshStandardMaterial color={'cyan'} wireframe={true} />
        </mesh>
      </group>
    </>
  );
};

const App = () => {
  return (
    <>
      <header className='titlebar draggable'>
        <div className='centered'>
          <p>Simple Electron App</p>
        </div>
      </header>
      <main className='container'>
        <h2 className='hero-text draggable'>Three.js</h2>
        <div style={{ height: '80vh' }}>
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        <Versions></Versions>
      </main>
    </>
  );
};

export default App;
