import React from 'react';

const TrustedBy: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-10 fade-in">
          <h2 className="text-2xl font-bold text-gray-100">Trusted By Industry Leaders</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center fade-in">
          <div className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-40 h-24 flex items-center justify-center">
              <span className="text-xl font-bold text-white">Slater Gordon</span>
            </div>
          </div>
          
          <div className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-40 h-24 flex items-center justify-center">
              <span className="text-xl font-bold text-white">TravelPlus</span>
            </div>
          </div>
          
          <div className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-40 h-24 flex items-center justify-center">
              <span className="text-xl font-bold text-white">Amazon Prime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;