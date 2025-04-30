import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
// @ts-ignore - Skypack CDN module
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesContainerRef = useRef<HTMLDivElement>(null); // New ref for shapes container
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const shapesRef = useRef<HTMLDivElement[]>([]);
  // Add state for modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);
  // Add form data state
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: ''
  });
  // Add loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Add success message state
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  // Add error message state
  const [submitError, setSubmitError] = useState<string>('');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Google Apps Script URL that will handle the form submission
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwRHKPNxsqSszKAe-3eiyZKgSUcOJ4Cy9vPjZ45YETBxbY-MqQ42ezYpjagdB_H-uQr/exec';
      
      // Create form data to send
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('organization', formData.organization);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('sheetUrl', 'https://docs.google.com/spreadsheets/d/1S6XqHAwBj6NvZzkm9gSaWsY6qzPZf5Q_yHB9wXvA3_8/edit?usp=sharing');
      
      // Send the data
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        // Show success message
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: '',
          organization: '',
          phone: '',
          email: ''
        });
        // Close modal after 3 seconds
        setTimeout(() => {
          setShowModal(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    
    // Load the GLTF model
    const loader = new GLTFLoader();
    setLoadingStatus('Loading model...');
    
    // Try different paths if the model isn't loading
    const modelPaths = [
      '/disco_ball/scene.gltf',  // This should be the correct path for Vercel
      'disco_ball/scene.gltf',
      './disco_ball/scene.gltf',
      '../disco_ball/scene.gltf'
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
          // setLoadingStatus('Model loaded successfully!');
          // Hide loading status after successful load
          setTimeout(() => {
            setIsLoaded(true);
          }, 1000); // Short delay to show the success message
          
          // Scale the model to appropriate size - increased scale to make the ball bigger
          gltf.scene.scale.set(0.5, 0.5, 0.5)
          
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
          
          // Hide loading status when it reaches 100%
          if (progressPercent === 100) {
            setTimeout(() => {
              setIsLoaded(true);
            }, 1000); // Short delay to show the 100% message
          }
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
    
    // Create floating shapes
    const createFloatingShapes = () => {
      // Find the shapes container - it's the first div in our section
      const shapesContainer = document.querySelector('section > div:first-child');
      if (!shapesContainer) return;
      
      // Clear any existing shapes
      shapesRef.current.forEach(shape => {
        if (shapesContainer && shapesContainer.contains(shape)) {
          shapesContainer.removeChild(shape);
        }
      });
      shapesRef.current = [];
      
      // Shape types matching test.html exactly
      const shapeTypes = ['rounded-square', 'circle', 'parallelogram', 'plus', 'hexagon', 'rhombus', 'pentagon'];
      const colorTypes = ['mint', 'cyan', 'purple', 'pink', 'blue', 'amber'];
      const sizeTypes = ['small', 'medium', 'large'];
      
      // Create shapes - use 15 shapes as in test.html
      const shapeCount = 15;
      const containerRect = shapesContainer.getBoundingClientRect();
      
      // Divide the screen into a grid for more even distribution
      const gridCols = 5;
      const gridRows = 3;
      const cellWidth = containerRect.width / gridCols;
      const cellHeight = containerRect.height / gridRows;
      
      // Track which cells already have shapes to avoid clustering
      const occupiedCells = new Set();
      
      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('floating-shape');
        
        // Add size class - distribute evenly
        const sizeClass = sizeTypes[Math.floor(Math.random() * sizeTypes.length)];
        shape.classList.add(sizeClass);
        
        // Add shape class - distribute with preference for rounded-square and circle
        let shapeClass;
        if (i < 6) {
          // First 6 shapes are more likely to be basic shapes
          shapeClass = Math.random() < 0.7 ? 
            (Math.random() < 0.5 ? 'rounded-square' : 'circle') : 
            shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        } else {
          shapeClass = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        }
        shape.classList.add(shapeClass);
        
        // Add color class
        const colorClass = colorTypes[Math.floor(Math.random() * colorTypes.length)];
        shape.classList.add(colorClass);
        
        // Find an unoccupied cell for more even distribution
        let cellX, cellY, cellKey;
        let attempts = 0;
        
        do {
          cellX = Math.floor(Math.random() * gridCols);
          cellY = Math.floor(Math.random() * gridRows);
          cellKey = `${cellX},${cellY}`;
          attempts++;
          
          // If we've tried too many times, just place it anywhere
          if (attempts > 20) break;
        } while (occupiedCells.has(cellKey));
        
        // Mark this cell as occupied
        occupiedCells.add(cellKey);
        
        // Get shape size based on class
        let shapeSize = 70; // Default medium size
        if (sizeClass === 'small') shapeSize = 40;
        if (sizeClass === 'large') shapeSize = 130;
        
        // Position within the cell, with some randomness
        const x = cellX * cellWidth + Math.random() * (cellWidth - shapeSize);
        const y = cellY * cellHeight + Math.random() * (cellHeight - shapeSize);
        
        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;
        
        // Random rotation
        const rotation = Math.floor(Math.random() * 360);
        shape.style.transform = `rotate(${rotation}deg)`;
        
        // Add to container
        shapesContainer.appendChild(shape);
        shapesRef.current.push(shape);
        
        // Animate the shape
        animateShape(shape);
      }
    };
    
    // Animate a shape with GSAP-like behavior
    const animateShape = (shape: HTMLDivElement) => {
      // Initial position
      const startX = parseFloat(shape.style.left);
      const startY = parseFloat(shape.style.top);
      
      // Random movement range - larger range for more noticeable movement
      const floatX = Math.random() * 200 + 150; // 150-350px (increased from 100-250px)
      const floatY = Math.random() * 200 + 150; // 150-350px (increased from 100-250px)
      
      // Animation duration - slightly faster for more visible movement
      // Remove rotation animation
      // const floatRotation = Math.random() * 180 + 90; // 90-270 degrees
      
      // Animation duration - longer for smoother movement
      const duration = Math.random() * 15 + 20; // 20-35 seconds
      
      // Direction
      const directionX = Math.random() > 0.5 ? 1 : -1;
      const directionY = Math.random() > 0.5 ? 1 : -1;
      
      // Animation function
      let startTime: number | null = null;
      let animationFrameId: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = elapsed / (duration * 1000);
        
        // Sine wave movement for smooth back-and-forth
        const sineWave = Math.sin(progress * Math.PI * 2);
        
        // Calculate new position
        const newX = startX + directionX * floatX * sineWave;
        const newY = startY + directionY * floatY * sineWave;
        
        // Get the initial rotation - we'll keep this fixed
        const initialRotation = parseFloat(shape.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        
        // Apply new position but keep the initial rotation
        shape.style.left = `${newX}px`;
        shape.style.top = `${newY}px`;
        shape.style.transform = `rotate(${initialRotation}deg)`;
        
        // Continue animation - check if shape is in the shapes container instead of containerRef
        const shapesContainer = document.querySelector('section > div:first-child');
        if (shapesContainer && shapesContainer.contains(shape)) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      
      // Store animation ID for cleanup
      shape.dataset.animationId = animationFrameId.toString();
    };
    
    // Create floating shapes after a short delay
    setTimeout(createFloatingShapes, 500);
    
    // Handle window resize for shapes
    const handleResize = () => {
      updateSize();
      // Recreate shapes on resize
      createFloatingShapes();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('resize', handleResize);
      
      // Clean up Three.js resources
      renderer.dispose();
      
      // Clean up floating shapes
      shapesRef.current.forEach(shape => {
        const shapesContainer = document.querySelector('section > div:first-child');
        if (shapesContainer && shapesContainer.contains(shape)) {
          shapesContainer.removeChild(shape);
          
          // Cancel animation
          if (shape.dataset.animationId) {
            cancelAnimationFrame(parseInt(shape.dataset.animationId));
          }
        }
      });
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center justify-center">
      {/* Modal for booking demo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md relative animate-fadeIn">
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              Book Your Demo
            </h2>
            
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Thank You!</h3>
                <p className="text-gray-300">Your demo request has been submitted successfully. We'll contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-1">
                    Organization *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="Company Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="john@company.com"
                  />
                </div>
                
                {submitError && (
                  <div className="text-red-500 text-sm py-2">
                    {submitError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-transparent rounded-md shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Three.js container */}
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-full h-full z-5"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        {/* Debug info - only show if not fully loaded */}
        {loadingStatus && !isLoaded && (
          <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded">
            {loadingStatus}
          </div>
        )}
      </div>
      
      {/* Overlay gradient - reduce opacity slightly to make shapes more visible */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-950/70 via-gray-900/50 to-gray-950/80 z-10"></div>
      
      {/* Content */}
      <div className="container-custom relative z-30 pt-0 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
            Turn interactions into income
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-200">
          Unify. Amplify. Grow.
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
            AI-powered growth for pros—ditch the SaaS sprawl.
            {/* <span className="block mt-1">The AI-native platform to power inbound-led growth for your professional services.</span> */}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary bg-gradient-to-r from-indigo-500 via-pink-500 hover:from-indigo-600 hover:via-purple-600"
              // className='btn-primary'
            >
              Book Your Demo
            </button>
            <a 
              href="#use-cases" 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-200 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              Explore Use Cases
            </a>
          </div>
        </div>
      </div>
      {/* CSS for floating shapes - exactly matching test.html */}
      <style>{`
        .floating-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1); /* Slightly brighter background */
          z-index: 1; /* Lower z-index to be behind everything */
          opacity: 0.9; /* Increased opacity for better visibility */
          pointer-events: none;
          transform-origin: center;
          border: 1px solid rgba(255, 255, 255, 0.35); /* Brighter border */
          transition: transform 0.3s ease-in-out;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          box-shadow: 0 0 30px rgba(150, 150, 255, 0.4); /* Brighter glow */
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: pulse-glow 5s infinite ease-in-out;
          border-radius: 12px;
        }
        
        /* Size variants */
        .floating-shape.small {
          width: 40px;
          height: 40px;
        }
        
        .floating-shape.medium {
          width: 70px;
          height: 70px;
        }
        
        .floating-shape.large {
          width: 130px;
          height: 130px;
        }
        
        /* Rounded square */
        .floating-shape.rounded-square {
          border-radius: 16px;
        }
        
        /* Circle */
        .floating-shape.circle {
          border-radius: 50%;
        }
        
        /* Parallelogram */
        .floating-shape.parallelogram {
          clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
          border-radius: 8px;
        }
        
        /* Plus sign */
        .floating-shape.plus {
          clip-path: polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%);
          border-radius: 8px;
        }
        
        /* Hexagon */
        .floating-shape.hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          border-radius: 8px;
        }
        
        /* Rhombus */
        .floating-shape.rhombus {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          border-radius: 8px;
        }
        
        /* Pentagon */
        .floating-shape.pentagon {
          clip-path: polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%);
          border-radius: 8px;
        }
        
        /* Enhanced neon lighting effect */
        .floating-shape::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          clip-path: inherit;
          opacity: 0.95; /* Increase opacity for better visibility */
          box-shadow: 0 0 15px rgba(220, 220, 255, 0.6) inset; /* Stronger inner glow */
        }
        
        /* Added stronger neon border glow effect */
        .floating-shape::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          clip-path: inherit;
          opacity: 0.95; /* Increase opacity for better visibility */
          z-index: -1;
          filter: blur(5px);
        }
        
        /* Soft mint - make colors more vibrant */
        .floating-shape.mint::after {
          background: linear-gradient(135deg, 
              rgba(19, 206, 102, 0.4) 0%, 
              rgba(19, 206, 102, 0.6) 100%);
        }
        .floating-shape.mint::before {
          background: rgba(19, 206, 102, 0.7);
          box-shadow: 0 0 25px rgba(19, 206, 102, 1);
        }
        
        /* Soft cyan - make colors more vibrant */
        .floating-shape.cyan::after {
          background: linear-gradient(135deg, 
              rgba(6, 182, 212, 0.4) 0%, 
              rgba(6, 182, 212, 0.6) 100%);
        }
        .floating-shape.cyan::before {
          background: rgba(6, 182, 212, 0.7);
          box-shadow: 0 0 25px rgba(6, 182, 212, 1);
        }
        
        /* Soft purple */
        .floating-shape.purple::after {
          background: linear-gradient(135deg, 
              rgba(147, 51, 234, 0.25) 0%, 
              rgba(147, 51, 234, 0.45) 100%);
        }
        .floating-shape.purple::before {
          background: rgba(147, 51, 234, 0.7);
          box-shadow: 0 0 25px rgba(147, 51, 234, 1);
        }
        
        /* Soft pink */
        .floating-shape.pink::after {
          background: linear-gradient(135deg, 
              rgba(236, 72, 153, 0.25) 0%, 
              rgba(236, 72, 153, 0.45) 100%);
        }
        .floating-shape.pink::before {
          background: rgba(236, 72, 153, 0.7);
          box-shadow: 0 0 25px rgba(236, 72, 153, 1);
        }
        
        /* Soft blue */
        .floating-shape.blue::after {
          background: linear-gradient(135deg, 
              rgba(59, 130, 246, 0.25) 0%, 
              rgba(59, 130, 246, 0.45) 100%);
        }
        .floating-shape.blue::before {
          background: rgba(59, 130, 246, 0.7);
          box-shadow: 0 0 25px rgba(59, 130, 246, 1);
        }
        
        /* Soft amber */
        .floating-shape.amber::after {
          background: linear-gradient(135deg, 
              rgba(245, 158, 11, 0.25) 0%, 
              rgba(245, 158, 11, 0.45) 100%);
        }
        .floating-shape.amber::before {
          background: rgba(245, 158, 11, 0.7);
          box-shadow: 0 0 25px rgba(245, 158, 11, 1);
        }
        
        /* Pulsing glow animation */
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 15px rgba(150, 150, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(180, 180, 255, 0.5);
          }
          100% {
            box-shadow: 0 0 15px rgba(150, 150, 255, 0.3);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;