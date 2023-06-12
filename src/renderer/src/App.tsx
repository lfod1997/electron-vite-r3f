import Versions from './components/Versions';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const Scene = () => {
  const meshRef = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.5, 64, 16]} />
        <meshBasicMaterial color={'cyan'} wireframe={true} />
      </mesh>
    </group>
  );
};

const App = () => {
  return (
    <>
      <header className='titlebar'>
        <div className='centered'>
          <p>Simple Electron App</p>
        </div>
      </header>
      <main className='container'>
        <h2 className='hero-text'>Three.js</h2>
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
