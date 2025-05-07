import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
// @ts-ignore - Skypack CDN module allows this import type
import { GLTFLoader, GLTF } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

const TypeWriter: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const words = ['Income', 'Growth', 'Code'];
  const colors = ['#00FFFF', '#FF00FF', '#00FF00']; // Cyan, Magenta, Neon Green

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const handleTyping = () => {
      if (!isDeleting && text === currentWord) {
        // Pause at end of word
        setTimeout(() => setIsDeleting(true), 1500);
        return;
      }

      if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        setTypingSpeed(100);
        return;
      }

      const delta = isDeleting ? -1 : 1;
      setText(currentWord.substring(0, text.length + delta));
      setTypingSpeed(isDeleting ? 50 : 100);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, typingSpeed]);

  return (
    <div className="mt-2">
      <span 
        style={{ 
          color: colors[wordIndex],
          textShadow: `0 0 20px ${colors[wordIndex]}`,
          filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))'
        }} 
        className="font-bold"
      >
        {text}
      </span>
      <span className="typewriter-cursor"></span>
    </div>
  );
};

const Hero: React.FC = () => {
  // Refs for DOM elements and Three.js objects
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // --- Main useEffect for Three.js ---
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
    discoBallGroup.rotation.x = Math.PI / 6; // Tilt 30 degrees forward
    discoBallGroup.rotation.z = 0; // Tilt slightly to the side
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
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) { /* Material enhancements */ child.material.precision = 'highp'; if (child.material.metalness !== undefined) { child.material.roughness = Math.max(0.1, child.material.roughness || 0.5); child.material.envMapIntensity = 1.5; } if (child.material.map) { child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy(); child.material.map.minFilter = THREE.LinearFilter; child.material.map.magFilter = THREE.LinearFilter; } if (child.material.normalMap) { child.material.normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy(); child.material.normalScale?.set(1.5, 1.5); } child.material.needsUpdate = true; }
            child.castShadow = true; child.receiveShadow = true; /* Shadows */
          }
        });
        discoBallGroup.add(gltf.scene); gltf.scene.position.set(0, 2.9, 0);
        if (gltf.animations && gltf.animations.length) { mixer = new THREE.AnimationMixer(gltf.scene); const action = mixer.clipAction(gltf.animations[0]); action.play(); console.log("Playing model animation."); } else { console.log("Model has no animations."); }
      }, (xhr) => { if (isMounted) setLoadingStatus(`Loading: ${Math.round(xhr.loaded / xhr.total * 100)}%`); }, (error) => { console.error(`Error loading model from ${path}:`, error); if (isMounted) tryLoadModel(pathIndex + 1); });
    };
    tryLoadModel();
    // --- End GLTF Loading ---

    // --- Lights Setup ---
    const pointLight1 = new THREE.PointLight(0xffffff, 0, 100); pointLight1.position.set(5, 5, 5); pointLight1.castShadow = true; pointLight1.shadow.mapSize.width = 1024; pointLight1.shadow.mapSize.height = 1024; pointLight1.shadow.bias = -0.001; scene.add(pointLight1);
    const pointLight3 = new THREE.PointLight(0xffffff, 0, 100); pointLight3.position.set(0, 5, -5); pointLight3.castShadow = true; pointLight3.shadow.mapSize.width = 1024; pointLight3.shadow.mapSize.height = 1024; pointLight3.shadow.bias = -0.001; scene.add(pointLight3);
    const topLeftLight = new THREE.PointLight(0xffffff, 0, 100); topLeftLight.position.set(-5, 8, 0); topLeftLight.castShadow = true; topLeftLight.shadow.mapSize.width = 1024; topLeftLight.shadow.mapSize.height = 1024; topLeftLight.shadow.bias = -0.001; scene.add(topLeftLight);
    //const blueAccent = new THREE.PointLight(0x4a6bff, 0.8, 50); blueAccent.position.set(3, 2, 3); scene.add(blueAccent);
    //const pinkAccent = new THREE.PointLight(0xff5ea2, 0.8, 50); pinkAccent.position.set(-3, -2, 3); scene.add(pinkAccent);
   // const cyanAccent = new THREE.PointLight(0x38eeff, 0.8, 50); cyanAccent.position.set(0, -3, 2); scene.add(cyanAccent);
    const purpleAccent = new THREE.PointLight(0x8a2be2, 0.8, 50); purpleAccent.position.set(-2, 3, -2); scene.add(purpleAccent);
    const topGreenAccent = new THREE.PointLight(0x00ff7f, 0.5, 30); topGreenAccent.position.set(2, 6, 1); scene.add(topGreenAccent);
    const topYellowAccent = new THREE.PointLight(0xffd700, 0.5, 30); topYellowAccent.position.set(-2, 7, 0); scene.add(topYellowAccent);
    const topRedAccent = new THREE.PointLight(0xff4500, 0.5, 30); topRedAccent.position.set(1, 6, -1); scene.add(topRedAccent);
    const frontTopBlueAccent = new THREE.PointLight(0x1e90ff, 0.4, 25); frontTopBlueAccent.position.set(1, 5, 2); scene.add(frontTopBlueAccent);
    const frontTopPurpleAccent = new THREE.PointLight(0x9370db, 0.4, 25); frontTopPurpleAccent.position.set(-1, 5, 2); scene.add(frontTopPurpleAccent);
    const frontTopPinkAccent = new THREE.PointLight(0xff69b4, 0.4, 25); frontTopPinkAccent.position.set(0, 5, 2); scene.add(frontTopPinkAccent);

    // Add blue spotlight
    const blueSpotlight = new THREE.SpotLight(0x4a6bff, 5, 100, Math.PI / 6, 0.5, 1);
    blueSpotlight.position.set(0, 6, 7);
    blueSpotlight.target.position.set(0, 3, 0);
    scene.add(blueSpotlight);
    scene.add(blueSpotlight.target);

    // Sparkle dots
    const sparkleDots = [
      { mesh: new THREE.Mesh(
          new THREE.CircleGeometry(0.2, 32),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        ),
        position: new THREE.Vector3(1, 7, 0),
        speed: 0.05,
        scale: 1
      },
      { mesh: new THREE.Mesh(
          new THREE.CircleGeometry(0.15, 32),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        ),
        position: new THREE.Vector3(-1, 7.2, 0),
        speed: 0.07,
        scale: 1
      },
      { mesh: new THREE.Mesh(
          new THREE.CircleGeometry(0.25, 32),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        ),
        position: new THREE.Vector3(0, 7.1, 0.5),
        speed: 0.06,
        scale: 1
      },
      { mesh: new THREE.Mesh(
          new THREE.CircleGeometry(0.18, 32),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        ),
        position: new THREE.Vector3(0.8, 7.3, -0.3),
        speed: 0.08,
        scale: 1
      },
      { mesh: new THREE.Mesh(
          new THREE.CircleGeometry(0.12, 32),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        ),
        position: new THREE.Vector3(-0.7, 7.4, 0.2),
        speed: 0.04,
        scale: 1
      }
    ];

    sparkleDots.forEach(({ mesh, position }) => {
      mesh.position.copy(position);
      mesh.rotation.x = -Math.PI / 2; // Make circles face up
      mesh.renderOrder = 1; // Ensure dots render on top
      discoBallGroup.add(mesh);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
    camera.position.z = 10;
    // --- End Lights Setup ---

    // --- Main Animation Loop (Three.js) ---
    const animate = () => {
      if (!isMounted) return;
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      if (modelLoaded) discoBallGroup.rotation.y += 0.003;
      if (modelLoaded && !mixer) discoBallGroup.rotation.x += 0.002;

      // Animate sparkle dots
      sparkleDots.forEach(({ mesh, speed, scale }) => {
        const time = Date.now() * 0.001;
        const pulse = 0.8 + Math.sin(time * speed * Math.PI) * 0.2;
        mesh.scale.set(scale * pulse, scale * pulse, 1);
        mesh.material.opacity = 0.7 + Math.sin(time * speed * Math.PI) * 0.3;
      });

      renderer.render(scene, camera);
    };
    animate();
    // --- End Animation Loop ---

    // --- Cleanup Function ---
    return () => {
      isMounted = false;
      console.log("Cleaning up Hero component...");
      window.removeEventListener('resize', updateSize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

      // Cleanup Three.js resources
      scene.remove(discoBallGroup);
       if (gltfSceneRef.current) {
           gltfSceneRef.current.traverse((child: any) => {
               if (child.isMesh) {
                   child.geometry?.dispose();
                   if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  Object.values(mat).forEach((value: any) => {
                    if (value && typeof value.dispose === 'function' && value.isTexture) value.dispose();
                  });
                  mat.dispose();
                });
              } else {
                Object.values(child.material).forEach((value: any) => {
                  if (value && typeof value.dispose === 'function' && value.isTexture) value.dispose();
                });
                child.material.dispose();
              }
                   }
               }
           });
       }
      renderer.dispose();
      console.log("Three.js cleanup complete.");
    };
  }, []);

  // --- JSX Return ---
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center justify-center pb-8 pt-16">
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

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full z-5">
        <canvas ref={canvasRef} className="w-full h-full" aria-label="Disco ball animation background" />
        {loadingStatus && ( <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded z-40" role="status">{loadingStatus}</div> )}
      </div>

      {/* Main Content */}
      <div className="container-custom relative z-30 pt-8 pb-16 text-center">
         <div className="max-w-4xl mx-auto">
           <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 text-[#D4A5FF] drop-shadow-[0_0_15px_rgba(178,75,243,0.5)] [text-shadow:_0_0_20px_rgba(178,75,243,0.7)]">
             Turn interactions into
             <TypeWriter />
           </h1>
           <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-200"> Unify. Amplify. Grow. </h2>
           <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300"> AI-powered growth for pros—ditch the SaaS sprawl. </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button onClick={() => setShowModal(true)} className="btn-primary bg-gradient-to-r from-indigo-500 via-pink-500 hover:from-indigo-600 hover:via-purple-600"> Book Your Demo </button>
           </div>
         </div>
      </div>

      {/* --- UPDATED CSS STYLES --- */}
      <style>{`
        /* Modal fade in animation */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        /* Typewriter cursor effect */
        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: #FF6AD5;
          margin-left: 4px;
          animation: blink 0.7s infinite;
          vertical-align: middle;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Accessibility: Improve focus visibility */
        *:focus-visible { outline: 3px solid #6366F1; outline-offset: 2px; }
        .modal-input:focus { border-color: #8B5CF6; box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5); }
      `}</style>
    </section>
  );
};

export default Hero;
