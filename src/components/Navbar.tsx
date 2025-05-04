'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, MessageSquare, ClipboardCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showNav, setShowNav] = useState<boolean>(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

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
    const sections = ['use-cases', 'capabilities', 'how-we-work', 'contact'];
    
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
            setActiveSection(section);
            return;
          }
        }
      }
      
      // If no section is active (e.g., at the top of the page)
      if (scrollPosition < 300) {
        setActiveSection('');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Helper function to determine if a section is active
  const isActive = (section: string) => activeSection === section;

  return (
    <motion.nav
      className="fixed inset-0 top-4 w-[95%] sm:w-[90%] mx-auto bg-gradient-to-r from-gray-900/95 via-gray-700/95 to-gray-900/95 animate-gradient-x backdrop-blur-sm font-medium text-white flex max-sm:justify-between gap-4 px-3 max-w-7xl items-center rounded-full h-14 p-5 overflow-hidden z-50 shadow-lg shadow-purple-500/10 border border-gray-700/30"
      style={{ backgroundSize: '200% 200%' }}
      variants={{
        long: { maxWidth: 700 },
        short: { maxWidth: 280 },
        hideNav: {
          height: 56,
          borderRadius: 50,
          alignItems: 'center',
          transition: { delay: 0, duration: 0.3 },
        },
        showNav: {
          height: 200,
          borderRadius: 22,
          alignItems: 'start',
          transition: { delay: 0 },
        },
      }}
      initial="short"
      animate={[hidden ? 'short' : 'long', showNav ? 'showNav' : 'hideNav']}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 14,
      }}
    >
      <motion.div 
        className="flex items-center gap-2"
        variants={{
          short: { width: 'auto' },
          long: { width: 'auto' }
        }}
      >
        <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img 
            src="/logo.png" 
            alt="Sapphyr Logo" 
            className="w-11 h-11 object-cover rounded-full" 
          />
        </div>
        
        <motion.div
          className="overflow-hidden flex items-center"
          variants={{
            short: { 
              width: 0, 
              opacity: 0,
              marginLeft: 0,
              transition: { duration: 0.3 } 
            },
            long: { 
              width: 'auto', 
              opacity: 1,
              marginLeft: 2,
              transition: { duration: 0.5, delay: 0.2 } 
            }
          }}
          initial="short"
          animate={hidden ? "short" : "long"}
        >
          <span className="text-3xl bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text whitespace-nowrap -mt-2" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
            sapphyr
          </span>
        </motion.div>
      </motion.div>
      
      <motion.ul
        className={`w-full ${
          showNav
            ? '[--display-from:none] [--display-to:flex]'
            : 'max-sm:[--display-from:none] sm:[--display-to:flex]'
        } [--opacity-from:0.1] [--opacity-to:1] flex-col sm:flex-row items-center justify-center gap-10 max-sm:gap-5 max-sm:pt-10`}
        variants={{
          hidden: {
            display: 'var(--display-from, none)',
            opacity: 'var(--opacity-from, 1)',
            transition: { duration: 0.1, delay: 0 },
          },
          visible: {
            display: 'var(--display-to, none)',
            opacity: 'var(--opacity-to, 1)',
            transition: { duration: 0.6, delay: 0.2 },
          },
        }}
        initial="hidden"
        animate={[
          hidden && !showNav ? 'hidden' : 'visible',
          showNav ? 'visible' : '',
        ]}
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
          <a 
            href="#contact" 
            className={`relative ${isActive('contact') ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors duration-300`}
          >
            Contact
            {isActive('contact') && (
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
      </motion.ul>

      <motion.div
        className="flex-shrink-0 flex items-center justify-center gap-3"
        variants={{
          hidden: {
            opacity: 0,
            display: 'none',
            transition: { delay: 0, duration: 0.3 },
          },
          visible: {
            opacity: 1,
            display: 'flex',
            transition: { delay: 0.2, duration: 0.3 },
          },
        }}
        initial="hidden"
        animate={hidden ? 'visible' : 'hidden'}
      >
        <a 
          href="#use-cases" 
          className={`rounded-full w-8 h-8 flex items-center justify-center ${isActive('use-cases') 
            ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/30' 
            : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'} transition-all duration-300`}
          title="Use Cases"
        >
          <BookOpen className="w-4 h-4" />
        </a>
        <a 
          href="#capabilities" 
          className={`rounded-full w-8 h-8 flex items-center justify-center ${isActive('capabilities') 
            ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/30' 
            : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'} transition-all duration-300`}
          title="Capabilities"
        >
          <MessageSquare className="w-4 h-4" />
        </a>
        <a 
          href="#how-we-work" 
          className={`rounded-full w-8 h-8 flex items-center justify-center ${isActive('how-we-work') 
            ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/30' 
            : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'} transition-all duration-300`}
          title="How We Work"
        >
          <ClipboardCheck className="w-4 h-4" />
        </a>
        <a 
          href="#contact" 
          className={`rounded-full w-8 h-8 flex items-center justify-center ${isActive('contact') 
            ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/30' 
            : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'} transition-all duration-300`}
          title="Contact"
        >
          <Mail className="w-4 h-4" />
        </a>
      </motion.div>

      <button
        className="rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center bg-transparent text-white sm:hidden"
        onClick={() => {
          setHidden(false);
          setShowNav((prev) => !prev);
        }}
      >
        {showNav ? <ChevronUp /> : <ChevronDown />}
      </button>
    </motion.nav>
  );
};

export default Navbar;