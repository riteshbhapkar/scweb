'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, MessageSquare, ClipboardCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

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

  // Use Intersection Observer to detect active sections
  useEffect(() => {
    const sections = ['use-cases', 'capabilities', 'how-we-work'];
    
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-20% 0px -70% 0px', // triggers when section is in middle 10% of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          setShowNav(true);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    // Cleanup
    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const isActive = (section: string) => section === activeSection;

  // Form handlers
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

  return (
    <>
      <motion.nav
        className="fixed inset-0 top-4 w-[50%] sm:w-[50%] mx-auto bg-gradient-to-r from-gray-900/95 via-gray-700/95 to-gray-900/95 animate-gradient-x backdrop-blur-sm font-medium text-white flex max-sm:justify-between gap-4 px-3 max-w-5xl items-center rounded-full h-14 p-4 z-50 shadow-lg shadow-purple-500/10 border border-gray-700/30"
        style={{ backgroundSize: '200% 200%' }}
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
        
        <motion.div
          className="w-full flex flex-row items-center justify-center gap-8 max-sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex items-center gap-8 max-sm:gap-4">
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
                    transition={{ duration: 0.2 }}
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
                    transition={{ duration: 0.2 }}
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
                    transition={{ duration: 0.2 }}
                  />
                )}
              </a>
            </li>
            <li>
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 hover:from-indigo-600 hover:via-pink-600 hover:to-purple-600 rounded-full shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/30 hover:scale-105 hover:brightness-110"
              >
                Contact
              </button>
            </li>
          </ul>
        </motion.div>

        <button
          className="rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center bg-transparent text-white sm:hidden"
          onClick={() => {
            setShowNav((prev) => !prev);
          }}
        >
          {showNav ? <ChevronUp /> : <ChevronDown />}
        </button>
      </motion.nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md relative animate-fadeIn">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close modal">
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-1">Organization *</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white modal-input"
                    placeholder="john@company.com"
                  />
                </div>
                {submitError && <div className="text-red-500 text-sm py-2">{submitError}</div>}
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
    </>
  );
};

export default Navbar;