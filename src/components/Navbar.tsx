'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, MessageSquare, ClipboardCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showNav, setShowNav] = useState<boolean>(false);
  const [hidden, setHidden] = useState(false);

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

  return (
    <motion.nav
      className="fixed inset-0 top-4 w-[95%] sm:w-[90%] mx-auto bg-gradient-to-r from-gray-900 to-gray-800 font-medium text-white flex max-sm:justify-between gap-4 px-3 max-w-7xl items-center rounded-full h-14 p-5 overflow-hidden z-50"
      variants={{
        long: { maxWidth: 950 },
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
        <div className="min-w-[40px] min-h-[40px] rounded-full bg-white flex items-center justify-center">
          <span className="font-bold text-gray-900">Logo</span>
        </div>
        
        <motion.div
          className="overflow-hidden"
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
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text whitespace-nowrap">
            SwanCity.AI
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
          <a href="#use-cases">Use Cases</a>
        </li>
        <li>
          <a href="#capabilities">Capabilities</a>
        </li>
        <li>
          <a href="#how-we-work">How We Work</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
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
          className="rounded-full w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          title="Use Cases"
        >
          <BookOpen className="w-4 h-4" />
        </a>
        <a 
          href="#capabilities" 
          className="rounded-full w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          title="Capabilities"
        >
          <MessageSquare className="w-4 h-4" />
        </a>
        <a 
          href="#how-we-work" 
          className="rounded-full w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          title="How We Work"
        >
          <ClipboardCheck className="w-4 h-4" />
        </a>
        <a 
          href="#contact" 
          className="rounded-full w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
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