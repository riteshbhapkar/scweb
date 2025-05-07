import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/FloatingShapes.module.css';

const FloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const shapesContainer = containerRef.current;
    const shapeCount = 20; // Reduced from 42 to 20 shapes

    // Define shape types and their weights
    const shapeTypes = [
      { type: 'rounded-square', weight: 30 },
      { type: 'circle', weight: 30 },
      { type: 'plus', weight: 10 },
      { type: 'tetris-l', weight: 8 },
      { type: 'tetris-t', weight: 8 },
      { type: 'tetris-s', weight: 7 },
      { type: 'tetris-z', weight: 7 }
    ];

    // Color classes
    const colorClasses = ['mint', 'cyan', 'purple', 'pink', 'blue', 'amber'];

    // Size distribution
    const sizeDistribution = [
      { class: 'small', weight: 25 },
      { class: 'medium', weight: 50 },
      { class: 'large', weight: 25 }
    ];

    // Helper function to get weighted random item
    const getWeightedRandom = (items: any[], weights: number[]) => {
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      let random = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (let i = 0; i < items.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          return items[i];
        }
      }
      return items[items.length - 1];
    };

    // Track occupied positions
    const occupiedPositions: { x: number; y: number; size: number }[] = [];
    const minDistance = 200;

    // Check if position is too close to existing shapes
    const isTooClose = (x: number, y: number, size: number) => {
      for (const pos of occupiedPositions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance < minDistance + size + pos.size + 20) {
          return true;
        }
      }
      return false;
    };

    // Create a shape
    const createShape = (index: number) => {
      const shape = document.createElement('div');
      shape.classList.add(styles['floating-shape']);

      // Choose shape type
      const shapeType = getWeightedRandom(
        shapeTypes.map(item => item.type),
        shapeTypes.map(item => item.weight)
      );
      shape.classList.add(styles[shapeType]);

      // Add random color
      const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
      shape.classList.add(styles[colorClass]);

      // Add size class
      const sizeClass = getWeightedRandom(
        sizeDistribution.map(item => item.class),
        sizeDistribution.map(item => item.weight)
      );
      shape.classList.add(styles[sizeClass]);

      // Determine shape size
      let shapeSize = 70; // Default medium
      if (sizeClass === 'small') shapeSize = 40;
      if (sizeClass === 'large') shapeSize = 130;

      // Find valid position
      let x, y;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        x = Math.random() * 100; // Percentage of container width
        y = Math.random() * window.innerHeight;
        attempts++;
      } while (isTooClose(x, y, shapeSize) && attempts < maxAttempts);

      // Set position
      shape.style.left = `${x}%`;
      shape.style.top = `${y}px`;

      // Track position
      occupiedPositions.push({ x, y, size: shapeSize });

      // Add to container
      shapesContainer.appendChild(shape);

      // Animate shape
      const floatX = 40 + Math.random() * 50;
      const floatY = 40 + Math.random() * 50;
      const floatRotation = Math.random() * 30;
      const duration = 8 + Math.random() * 8;

      const directionX = Math.random() > 0.5 ? 1 : -1;
      const directionY = Math.random() > 0.5 ? 1 : -1;

      gsap.to(shape, {
        x: `+=${directionX * floatX}px`,
        y: `+=${directionY * floatY}px`,
        rotation: (Math.random() > 0.5 ? 1 : -1) * floatRotation,
        duration: duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onRepeat: function() {
          this.vars.x = `+=${(Math.random() > 0.5 ? 1 : -1) * floatX}px`;
          this.vars.y = `+=${(Math.random() > 0.5 ? 1 : -1) * floatY}px`;
        }
      });
    };

    // Create shapes
    for (let i = 0; i < shapeCount; i++) {
      createShape(i);
    }

    // Cleanup
    return () => {
      shapesContainer.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="floating-shapes" 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default FloatingShapes; 