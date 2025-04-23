import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
// @ts-ignore - Skypack CDN module
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Improve renderer quality settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      precision: 'highp',
      powerPreference: 'high-performance'
    });
    
    // Set pixel ratio for higher resolution
    renderer.setPixelRatio(window.devicePixelRatio || 2);
    
    // Enable shadow mapping for better quality
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Make canvas responsive
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    // Create a group to hold the disco ball
    const discoBallGroup = new THREE.Group();
    scene.add(discoBallGroup);
    
    // Comment out or remove these two lines to hide the axes helper
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    
    // Load the GLTF model
    const loader = new GLTFLoader();
    setLoadingStatus('Loading model...');
    
    // Try different paths if the model isn't loading
    const modelPaths = [
      '/disco_ball/scene.gltf',
      './disco_ball/scene.gltf',
      'disco_ball/scene.gltf',
      '/public/disco_ball/scene.gltf',
      '../public/disco_ball/scene.gltf'
    ];
    
    let modelLoaded = false;
    
    const tryLoadModel = (pathIndex = 0) => {
      if (pathIndex >= modelPaths.length) {
        setLoadingStatus('Failed to load model after trying all paths');
        return;
      }
      
      const path = modelPaths[pathIndex];
      setLoadingStatus(`Trying path: ${path}`);
      
      loader.load(
        path,
        (gltf: { scene: { scale: { set: (arg0: number, arg1: number, arg2: number) => void; }; traverse: (arg0: (child: any) => void) => void; }; animations: string | any[]; }) => {
          // Model loaded successfully
          modelLoaded = true;
          setLoadingStatus('Model loaded successfully!');
          
          // Scale the model to appropriate size - increased scale to make the ball bigger
          gltf.scene.scale.set(7, 7, 7);
          
          // Improve material quality
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              // Enhance material properties for better quality
              if (child.material) {
                // Enable high quality settings for all materials
                child.material.precision = 'highp';
                child.material.needsUpdate = true;
                
                // If it's a standard material, improve its properties
                if (child.material.metalness !== undefined) {
                  child.material.roughness = Math.max(0.1, child.material.roughness || 0.5);
                  child.material.envMapIntensity = 1.5;
                }
                
                // Enable better texture filtering if textures exist
                if (child.material.map) {
                  child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  child.material.map.minFilter = THREE.LinearFilter;
                  child.material.map.magFilter = THREE.LinearFilter;
                  child.material.map.needsUpdate = true;
                }
                
                // Improve normal maps if they exist
                if (child.material.normalMap) {
                  child.material.normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  child.material.normalScale.set(1.5, 1.5);
                  child.material.normalMap.needsUpdate = true;
                }
              }
              
              // Enable shadows for better quality
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // Add the model to our group
          discoBallGroup.add(gltf.scene);
          
          // Position the model at the center of the scene
          gltf.scene.position.set(0, 0, 0);
          
          // Check if the model has animations
          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
            
            // Update the mixer in the animation loop
            const clock = new THREE.Clock();
            const animateWithMixer = () => {
              requestAnimationFrame(animateWithMixer);
              
              const delta = clock.getDelta();
              mixer.update(delta);
              
              // Rotate the entire disco ball group
              discoBallGroup.rotation.y += 0.003;
              
              renderer.render(scene, camera);
            };
            
            animateWithMixer();
          } else {
            // If no animations, just rotate the model
            const animate = () => {
              requestAnimationFrame(animate);
              
              discoBallGroup.rotation.x += 0.002;
              discoBallGroup.rotation.y += 0.003;
              
              renderer.render(scene, camera);
            };
            
            animate();
          }
        },
        (xhr: { loaded: number; total: number; }) => {
          // Loading progress
          const progressPercent = Math.round(xhr.loaded / xhr.total * 100);
          setLoadingStatus(`Loading: ${progressPercent}%`);
        },
        (error: any) => {
          // Error handling
          console.error(`Error loading model from ${path}:`, error);
          setLoadingStatus(`Error loading from ${path}`);
          
          // Try the next path
          setTimeout(() => {
            tryLoadModel(pathIndex + 1);
          }, 1000);
        }
      );
    };
    
    tryLoadModel();
    
    // Add lights - make them brighter and closer
    // Create higher quality lights
    const pointLight1 = new THREE.PointLight(0x4a6bff, 5, 100);
    pointLight1.position.set(5, 5, 5);
    pointLight1.castShadow = true;
    // Improve shadow quality
    pointLight1.shadow.mapSize.width = 1024;
    pointLight1.shadow.mapSize.height = 1024;
    pointLight1.shadow.bias = -0.001;
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff5ea2, 5, 100);
    pointLight2.position.set(-5, -5, 5);
    pointLight2.castShadow = true;
    pointLight2.shadow.mapSize.width = 1024;
    pointLight2.shadow.mapSize.height = 1024;
    pointLight2.shadow.bias = -0.001;
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x38eeff, 5, 100);
    pointLight3.position.set(0, 5, -5);
    pointLight3.castShadow = true;
    pointLight3.shadow.mapSize.width = 1024;
    pointLight3.shadow.mapSize.height = 1024;
    pointLight3.shadow.bias = -0.001;
    scene.add(pointLight3);
    
    // Add ambient light to ensure the model is visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Position camera - moved closer
    camera.position.z = 10;
    
    // Initial render
    renderer.render(scene, camera);
    
    // Animation loop to ensure continuous rendering
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateSize);
      // Clean up Three.js resources
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Three.js container */}
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        {/* Debug info */}
        {loadingStatus && (
          <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded">
            {loadingStatus}
          </div>
        )}
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-950/80 via-gray-900/60 to-gray-950/90 z-10"></div>
      
      {/* Content */}
      <div className="container-custom relative z-20 pt-20 pb-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
            Turn interactions into income
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
            Engage clients. Expand revenue.
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-300">
            Ditch the siloed, SaaS tools.
            <span className="block mt-2">The AI-native platform to power inbound-led growth for your professional services.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#book-call" 
              className="btn-primary"
            >
              Book Your Demo
            </a>
            <a 
              href="#use-cases" 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-200 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              Explore Use Cases
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;