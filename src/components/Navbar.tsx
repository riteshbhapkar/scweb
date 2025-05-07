'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, MessageSquare, ClipboardCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    if (latest > previous && latest > 150) {
      setHidden(true);
      setShowNav(false);
    } else {
      setHidden(false);
    }
  });

  // Add effect to track active section based on scroll position
  useEffect(() => {
    const sections = ['use-cases', 'capabilities', 'how-we-work'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset to trigger slightly before reaching section
      
      // Find the current section
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (
            scrollPosition >= offsetTop && 
            scrollPosition < offsetTop + offsetHeight
          ) {
            setShowNav(true);
            return;
          }
        }
      }
      
      // If no section is active (e.g., at the top of the page)
      if (scrollPosition < 300) {
        setShowNav(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (section: string) => {
    const element = document.getElementById(section);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
  };

  return (
    <motion.nav
      className="fixed inset-0 top-4 w-[50%] sm:w-[50%] mx-auto bg-gradient-to-r from-gray-900/95 via-gray-700/95 to-gray-900/95 animate-gradient-x backdrop-blur-sm font-medium text-white flex max-sm:justify-between gap-4 px-3 max-w-5xl items-center rounded-full h-14 p-4 overflow-hidden z-50 shadow-lg shadow-purple-500/10 border border-gray-700/30"
      style={{ backgroundSize: '200% 200%' }}
      variants={{
        showNav: {
          height: 200,
          borderRadius: 22,
          alignItems: 'start',
          transition: { delay: 0 },
        },
        hideNav: {
          height: 56,
          borderRadius: 50,
          alignItems: 'center',
          transition: { delay: 0, duration: 0.3 },
        },
      }}
      initial="hideNav"
      animate={showNav ? 'showNav' : 'hideNav'}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 14,
      }}
    >
      <motion.div 
        className="flex items-center gap-2"
      >
        <div className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img 
            src="/logo.png" 
            alt="Sapphyr Logo" 
            className="w-10 h-10 object-cover rounded-full" 
          />
        </div>
        
        <motion.div
          className="overflow-hidden flex items-center"
        >
          <span className="text-2xl bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text whitespace-nowrap -mt-2" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
            sapphyr
          </span>
        </motion.div>
      </motion.div>
      
      <motion.ul
        className="w-full flex flex-row items-center justify-center gap-8 max-sm:gap-4"
        variants={{
          hidden: {
            opacity: 0,
            transition: { duration: 0.1 },
          },
          visible: {
            opacity: 1,
            transition: { duration: 0.6 },
          },
        }}
        initial="visible"
        animate="visible"
      >
        <li>
          <a 
            href="#use-cases" 
            className={`relative ${isActive('use-cases') ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors duration-300`}
          >
            Use Cases
            {isActive('use-cases') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500"
                layoutId="navbarIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </a>
        </li>
        <li>
          <a 
            href="#capabilities" 
            className={`relative ${isActive('capabilities') ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors duration-300`}
          >
            Capabilities
            {isActive('capabilities') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500"
                layoutId="navbarIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </a>
        </li>
        <li>
          <a 
            href="#how-we-work" 
            className={`relative ${isActive('how-we-work') ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors duration-300`}
          >
            How We Work
            {isActive('how-we-work') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500"
                layoutId="navbarIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </a>
        </li>
        <li>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 rounded-full border border-white/10 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30 hover:scale-105"
          >
            Contact
          </button>
        </li>
      </motion.ul>

      <button
        className="rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center bg-transparent text-white sm:hidden"
        onClick={() => {
          setShowNav((prev) => !prev);
        }}
      >
        {showNav ? <ChevronUp /> : <ChevronDown />}
      </button>
    </motion.nav>
  );
};

export default Navbar;