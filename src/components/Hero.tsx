import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
// @ts-ignore - Skypack CDN module allows this import type
import { GLTFLoader, GLTF } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

const Hero: React.FC = () => {
  // Refs for DOM elements and Three.js objects
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesContainerRef = useRef<HTMLDivElement>(null); // Container for floating shapes
  const shapesRef = useRef<HTMLDivElement[]>([]); // Array to hold shape elements
  const gltfSceneRef = useRef<THREE.Group | null>(null); // Ref to loaded GLTF scene for cleanup
  const animationFrameIdRef = useRef<number | null>(null); // Ref for the main Three.js animation frame

  // State variables
  const [loadingStatus, setLoadingStatus] = useState<string>(''); // GLTF loading status
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // GLTF loading complete flag
  const [showModal, setShowModal] = useState<boolean>(false); // Demo booking modal visibility
  const [formData, setFormData] = useState({ // Form data
    name: '',
    organization: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Form submission status
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false); // Form submission success
  const [submitError, setSubmitError] = useState<string>(''); // Form submission error

  // --- Form Handlers (Keep as is) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwRHKPNxsqSszKAe-3eiyZKgSUcOJ4Cy9vPjZ45YETBxbY-MqQ42ezYpjagdB_H-uQr/exec';
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('organization', formData.organization);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('sheetUrl', 'https://docs.google.com/spreadsheets/d/1S6XqHAwBj6NvZzkm9gSaWsY6qzPZf5Q_yHB9wXvA3_8/edit?usp=sharing');

      const response = await fetch(scriptURL, { method: 'POST', body: formDataToSend });
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', organization: '', phone: '', email: '' });
        setTimeout(() => { setShowModal(false); setSubmitSuccess(false); }, 3000);
      } else { throw new Error('Network response was not ok'); }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your information. Please try again.');
    } finally { setIsSubmitting(false); }
  };
  // --- End Form Handlers ---

  // --- Function to create floating shapes (Keep as is) ---
  const createFloatingShapes = useCallback(() => {
      if (!shapesContainerRef.current) {
          console.warn("Shapes container ref not available.");
          return;
      }
      console.log("Creating floating Tetris shapes...");

      // Cleanup existing shapes
      shapesRef.current.forEach(shape => {
          if (shape.dataset.animationId) cancelAnimationFrame(parseInt(shape.dataset.animationId));
          if (shape.parentNode === shapesContainerRef.current) shapesContainerRef.current.removeChild(shape);
      });
      shapesRef.current = [];

      // Shape types
      const shapeTypes = [
          'L-shape', 'T-shape', 'square', 'line', 'Z-shape', 'circle', 'plus'
      ];
      const sizes = ['small', 'medium', 'large'];
      const colors = ['mint', 'cyan', 'purple', 'pink', 'blue', 'amber'];
      const numShapes = Math.floor(Math.random() * 6) + 15; // 15-20 shapes
      const containerWidth = shapesContainerRef.current.clientWidth;
      const containerHeight = shapesContainerRef.current.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) console.warn("Shapes container has zero dimensions.");

      const performance = window.performance;

      // Grid system for distribution (optional)
      const gridCols = 5; const gridRows = 4;
      const cellWidth = containerWidth / gridCols;
      const cellHeight = containerHeight / gridRows;
      const occupiedCells = new Set();

      for (let i = 0; i < numShapes; i++) {
          const shape = document.createElement('div');
          const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
          const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          shape.className = `floating-shape ${shapeType} ${sizeClass} ${color}`;

          let shapeDim = 70;
          if (sizeClass === 'small') shapeDim = 40;
          else if (sizeClass === 'large') shapeDim = 130;
          if (shapeType === 'line') shapeDim *= 1.5;

          // Animation Parameters
          const maxAmplitude = 80;
          const ampX = Math.random() * maxAmplitude + 20;
          const ampY = Math.random() * maxAmplitude + 20;
          const freqX = Math.random() * 0.15 + 0.05;
          const freqY = Math.random() * 0.15 + 0.05;
          const phaseX = Math.random() * Math.PI * 2;
          const phaseY = Math.random() * Math.PI * 2;

          // Position calculation (using grid)
          let gridCol, gridRow, cellKey;
          let attempts = 0; const maxAttempts = gridCols * gridRows;
          do {
              gridCol = Math.floor(Math.random() * gridCols);
              gridRow = Math.floor(Math.random() * gridRows);
              cellKey = `${gridCol}-${gridRow}`; attempts++;
              if (attempts > maxAttempts) break;
          } while (occupiedCells.has(cellKey));
          occupiedCells.add(cellKey);
          const cellX = gridCol * cellWidth; const cellY = gridRow * cellHeight;
          const startX = cellX + (Math.random() * 0.6 + 0.2) * (cellWidth - shapeDim - 2 * ampX);
          const startY = cellY + (Math.random() * 0.6 + 0.2) * (cellHeight - shapeDim - 2 * ampY);

          const initialRotation = Math.random() * 360;
          shape.style.left = `${Math.max(0, startX)}px`;
          shape.style.top = `${Math.max(0, startY)}px`;
          shape.style.transform = `rotate(${initialRotation}deg)`;

          shapesContainerRef.current.appendChild(shape);
          shapesRef.current.push(shape);

          let currentRotation = initialRotation;
          const startTime = performance.now();

          // Animation Loop for each shape
          const animateShape = (now: number) => {
              if (!shape.parentNode) return;

              const elapsedTime = (now - startTime) * 0.001;
              const offsetX = Math.sin(elapsedTime * freqX + phaseX) * ampX;
              const offsetY = Math.cos(elapsedTime * freqY + phaseY) * ampY;
              const newLeft = startX + offsetX;
              const newTop = startY + offsetY;

              shape.style.left = `${newLeft}px`;
              shape.style.top = `${newTop}px`;

              currentRotation += (Math.random() * 1.0 - 0.5) * 0.4;
              shape.style.transform = `rotate(${currentRotation}deg)`;

              const animationId = requestAnimationFrame(animateShape);
              shape.dataset.animationId = animationId.toString();
          };
          setTimeout(() => requestAnimationFrame(animateShape), Math.random() * 100);
      }
      console.log(`Created ${shapesRef.current.length} shapes.`);
  }, []);
  // --- End shape creation ---


  // --- Main useEffect for Three.js & triggering shapes (Keep as is) ---
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    console.log("Hero useEffect running.");
    let isMounted = true;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true, precision: 'highp', powerPreference: 'high-performance' });
    renderer.setPixelRatio(window.devicePixelRatio || 2);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth; const height = containerRef.current.clientHeight;
      if (width > 0 && height > 0) { renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    const discoBallGroup = new THREE.Group();
    scene.add(discoBallGroup);
    // --- End Three.js Setup ---


    // --- GLTF Loading ---
    const loader = new GLTFLoader();
    setLoadingStatus('Loading model...');
    const modelPaths = ['/disco_ball/scene.gltf', 'disco_ball/scene.gltf', './disco_ball/scene.gltf', '../disco_ball/scene.gltf'];
    let modelLoaded = false;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();
    const tryLoadModel = (pathIndex = 0) => {
      if (!isMounted || pathIndex >= modelPaths.length) { if (isMounted && !modelLoaded) setLoadingStatus('Failed to load model.'); return; }
      const path = modelPaths[pathIndex]; setLoadingStatus(`Trying path: ${path}`);
      loader.load(path, (gltf: GLTF) => {
        if (!isMounted) return; console.log(`Model loaded successfully from ${path}`); modelLoaded = true; gltfSceneRef.current = gltf.scene;
        setTimeout(() => { if (isMounted) { setIsLoaded(true); setLoadingStatus(''); } }, 500);
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) { /* Material enhancements */ child.material.precision = 'highp'; if (child.material.metalness !== undefined) { child.material.roughness = Math.max(0.1, child.material.roughness || 0.5); child.material.envMapIntensity = 1.5; } if (child.material.map) { child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy(); child.material.map.minFilter = THREE.LinearFilter; child.material.map.magFilter = THREE.LinearFilter; } if (child.material.normalMap) { child.material.normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy(); child.material.normalScale?.set(1.5, 1.5); } child.material.needsUpdate = true; }
            child.castShadow = true; child.receiveShadow = true; /* Shadows */
          }
        });
        discoBallGroup.add(gltf.scene); gltf.scene.position.set(0, 0, 0);
        if (gltf.animations && gltf.animations.length) { mixer = new THREE.AnimationMixer(gltf.scene); const action = mixer.clipAction(gltf.animations[0]); action.play(); console.log("Playing model animation."); } else { console.log("Model has no animations."); }
        createFloatingShapes(); // Create shapes after model load
      }, (xhr) => { if (isMounted) setLoadingStatus(`Loading: ${Math.round(xhr.loaded / xhr.total * 100)}%`); }, (error) => { console.error(`Error loading model from ${path}:`, error); if (isMounted) tryLoadModel(pathIndex + 1); });
    };
    tryLoadModel();
    // --- End GLTF Loading ---


    // --- Lights Setup (Keep as is) ---
    const pointLight1 = new THREE.PointLight(0x4a6bff, 5, 100); pointLight1.position.set(5, 5, 5); pointLight1.castShadow = true; pointLight1.shadow.mapSize.width = 1024; pointLight1.shadow.mapSize.height = 1024; pointLight1.shadow.bias = -0.001; scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xff5ea2, 5, 100); pointLight2.position.set(-5, -5, 5); pointLight2.castShadow = true; pointLight2.shadow.mapSize.width = 1024; pointLight2.shadow.mapSize.height = 1024; pointLight2.shadow.bias = -0.001; scene.add(pointLight2);
    const pointLight3 = new THREE.PointLight(0x38eeff, 5, 100); pointLight3.position.set(0, 5, -5); pointLight3.castShadow = true; pointLight3.shadow.mapSize.width = 1024; pointLight3.shadow.mapSize.height = 1024; pointLight3.shadow.bias = -0.001; scene.add(pointLight3);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
    camera.position.z = 10;
    // --- End Lights Setup ---


    // --- Main Animation Loop (Three.js) (Keep as is) ---
    const animate = () => {
      if (!isMounted) return;
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      if (modelLoaded) discoBallGroup.rotation.y += 0.003;
      if (modelLoaded && !mixer) discoBallGroup.rotation.x += 0.002;
      renderer.render(scene, camera);
    };
    animate();
    // --- End Animation Loop ---


    // --- Cleanup Function (Keep as is) ---
    return () => {
      isMounted = false;
      console.log("Cleaning up Hero component...");
      window.removeEventListener('resize', updateSize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

      // Cleanup floating shapes
      console.log(`Cleaning up ${shapesRef.current.length} floating shapes.`);
       if (shapesContainerRef.current) { shapesRef.current.forEach(shape => { if (shape.dataset.animationId) cancelAnimationFrame(parseInt(shape.dataset.animationId)); if (shape.parentNode === shapesContainerRef.current) shapesContainerRef.current.removeChild(shape); }); } shapesRef.current = [];

      // Cleanup Three.js resources
      scene.remove(discoBallGroup);
       if (gltfSceneRef.current) {
           gltfSceneRef.current.traverse((child: any) => {
               if (child.isMesh) {
                   child.geometry?.dispose();
                   if (child.material) {
                       if (Array.isArray(child.material)) { child.material.forEach(mat => { Object.values(mat).forEach((value: any) => { if (value && typeof value.dispose === 'function' && value.isTexture) value.dispose(); }); mat.dispose(); }); }
                       else { Object.values(child.material).forEach((value: any) => { if (value && typeof value.dispose === 'function' && value.isTexture) value.dispose(); }); child.material.dispose(); }
                   }
               }
           });
       }
      renderer.dispose();
      console.log("Three.js cleanup complete.");
    };
  }, [createFloatingShapes]);
  // --- End Main useEffect ---

  // --- JSX Return (Keep as is) ---
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-950">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
           <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md relative animate-fadeIn">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close modal"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> </button>
            <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500"> Book Your Demo </h2>
            {submitSuccess ? ( <div className="text-center py-8"> <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4"> <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> </div> <h3 className="text-xl font-bold mb-2 text-white">Thank You!</h3> <p className="text-gray-300">Your demo request has been submitted successfully. We'll contact you soon.</p> </div> ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div> <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label> <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input" placeholder="John Smith"/> </div>
                 <div> <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-1">Organization *</label> <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input" placeholder="Company Name"/> </div>
                 <div> <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label> <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input" placeholder="+1 (555) 123-4567"/> </div>
                 <div> <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label> <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input" placeholder="john@company.com"/> </div>
                 {submitError && <div className="text-red-500 text-sm py-2">{submitError}</div>}
                 <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-transparent rounded-md shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-70"> {isSubmitting ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting... </> ) : ( 'Submit Request' )} </button>
              </form>
            )}
           </div>
        </div>
      )}

      {/* Shapes Container */}
      <div ref={shapesContainerRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" aria-hidden="true"></div>

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full z-5">
        <canvas ref={canvasRef} className="w-full h-full" aria-label="Disco ball animation background" />
        {loadingStatus && ( <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded z-40" role="status">{loadingStatus}</div> )}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-950/70 via-gray-900/50 to-gray-950/80 z-10 pointer-events-none" aria-hidden="true"></div>

      {/* Main Content */}
      <div className="container-custom relative z-30 pt-0 pb-16 text-center">
         <div className="max-w-4xl mx-auto">
           <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"> Turn interactions into income </h1>
           <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-200"> Unify. Amplify. Grow. </h2>
           <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300"> AI-powered growth for pros—ditch the SaaS sprawl. </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button onClick={() => setShowModal(true)} className="btn-primary bg-gradient-to-r from-indigo-500 via-pink-500 hover:from-indigo-600 hover:via-purple-600"> Book Your Demo </button>
             <a href="#use-cases" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-200 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"> Explore Use Cases </a>
           </div>
         </div>
      </div>

      {/* --- UPDATED CSS STYLES --- */}
      <style>{`
        /* Base style for all floating shapes */
        .floating-shape {
          position: absolute;
          z-index: 1;
          opacity: 0;
          pointer-events: none;
          transform-origin: center;
          border: 1px solid rgba(255, 255, 255, 0.35);
          transition: opacity 0.5s ease-in-out;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          /* Base shadow - will be overridden by color class */
          box-shadow: 0 0 25px rgba(150, 150, 255, 0.4);
          will-change: transform, opacity, box-shadow; /* Add box-shadow to will-change */
          transform: translate3d(0, 0, 0);
          /* Apply fade-in and pulse-glow animations */
          animation: pulse-glow 5s infinite ease-in-out, fadeInShape 1s ease forwards;
          border-radius: 4px; /* Default */
        }
        /* Fade in animation */
        @keyframes fadeInShape { to { opacity: 0.9; } }

        /* Size variants */
        .floating-shape.small { width: 40px; height: 40px; }
        .floating-shape.medium { width: 70px; height: 70px; }
        .floating-shape.large { width: 130px; height: 130px; }

        /* Shape Type Styles */
        .floating-shape.circle { border-radius: 50%; }
        .floating-shape.plus { clip-path: polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%); border-radius: 4px; }
        .floating-shape.square { border-radius: 6px; }
        .floating-shape.line.small { width: 60px; height: 20px; }
        .floating-shape.line.medium { width: 100px; height: 35px; }
        .floating-shape.line.large { width: 180px; height: 60px; }
        .floating-shape.line { border-radius: 4px; }
        .floating-shape.L-shape { clip-path: polygon(0% 0%, 33.3% 0%, 33.3% 66.6%, 100% 66.6%, 100% 100%, 0% 100%); border-radius: 4px; }
        .floating-shape.T-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 33.3%, 66.6% 33.3%, 66.6% 100%, 33.3% 100%, 33.3% 33.3%, 0% 33.3%); border-radius: 4px; }
        .floating-shape.Z-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 33.3%, 66.6% 33.3%, 66.6% 66.6%, 100% 66.6%, 100% 100%, 0% 100%, 0% 66.6%, 33.3% 66.6%, 33.3% 33.3%, 0% 33.3%); border-radius: 4px; }

        /* Neon Glow Effects - Pseudo-elements for enhancement */
        /* Inner gradient/shadow */
        .floating-shape::after {
            content: ''; position: absolute; inset: 0;
            border-radius: inherit; clip-path: inherit;
            opacity: 0.95;
            box-shadow: 0 0 15px rgba(220, 220, 255, 0.6) inset; /* Keep inner shadow */
            /* Removed background gradient from here */
        }
        /* Outer subtle blur */
        .floating-shape::before {
            content: ''; position: absolute; inset: -2px;
            border-radius: inherit; clip-path: inherit;
            opacity: 0.6; /* Reduced opacity for subtlety */
            z-index: -1;
            filter: blur(4px); /* Slightly reduced blur */
            /* Background color set by color class below */
        }

        /* --- Color Variants --- */
        /* Apply main colored box-shadow here and background to ::before */
        .floating-shape.mint { box-shadow: 0 0 25px rgba(19, 206, 102, 0.7); }
        .floating-shape.mint::before { background: rgba(19, 206, 102, 0.5); }
        .floating-shape.mint::after { background: linear-gradient(135deg, rgba(19, 206, 102, 0.4) 0%, rgba(19, 206, 102, 0.6) 100%); }

        .floating-shape.cyan { box-shadow: 0 0 25px rgba(6, 182, 212, 0.7); }
        .floating-shape.cyan::before { background: rgba(6, 182, 212, 0.5); }
        .floating-shape.cyan::after { background: linear-gradient(135deg, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0.6) 100%); }

        .floating-shape.purple { box-shadow: 0 0 25px rgba(147, 51, 234, 0.7); }
        .floating-shape.purple::before { background: rgba(147, 51, 234, 0.5); }
        .floating-shape.purple::after { background: linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(147, 51, 234, 0.45) 100%); }

        .floating-shape.pink { box-shadow: 0 0 25px rgba(236, 72, 153, 0.7); }
        .floating-shape.pink::before { background: rgba(236, 72, 153, 0.5); }
        .floating-shape.pink::after { background: linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.45) 100%); }

        .floating-shape.blue { box-shadow: 0 0 25px rgba(59, 130, 246, 0.7); }
        .floating-shape.blue::before { background: rgba(59, 130, 246, 0.5); }
        .floating-shape.blue::after { background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.45) 100%); }

        .floating-shape.amber { box-shadow: 0 0 25px rgba(245, 158, 11, 0.7); }
        .floating-shape.amber::before { background: rgba(245, 158, 11, 0.5); }
        .floating-shape.amber::after { background: linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.45) 100%); }
        /* --- End Color Variants --- */


        /* Animations */
        /* Pulse glow animation - Animates the box-shadow property */
        /* NOTE: The color part of the shadow comes from the color classes */
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 25px; } /* Size/blur defined here, color from class */
          50% { box-shadow: 0 0 45px; } /* Size/blur defined here, color from class */
          100% { box-shadow: 0 0 25px; } /* Size/blur defined here, color from class */
        }
        /* Modal fade in animation */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        /* Accessibility: Improve focus visibility */
        *:focus-visible { outline: 3px solid #6366F1; outline-offset: 2px; }
        .modal-input:focus { border-color: #8B5CF6; box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5); }

      `}</style>
    </section>
  );
  // --- End JSX Return ---
};

export default Hero;
