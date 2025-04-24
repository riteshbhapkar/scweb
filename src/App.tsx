import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UseCases from './components/UseCases';
import AdditionalCapabilities from './components/AdditionalCapabilities';
import TrustedBy from './components/TrustedBy';
import HowWeWork from './components/HowWeWork';
import Cta from './components/Cta';
import Footer from './components/Footer';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.fade-in').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <Navbar />
      <div className="pt-24">
        <Hero />
        <UseCases />
        <AdditionalCapabilities />
        <TrustedBy />
        <HowWeWork />
        <Cta />
        <Footer />
      </div>
    </div>
  );
}

export default App;