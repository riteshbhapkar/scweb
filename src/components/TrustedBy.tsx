import React from 'react';

const TrustedBy: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-10 fade-in">
          <h2 className="text-2xl font-bold text-gray-100">Trusted By Industry Leaders</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center fade-in">
          {/* <div className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"> */}
            <div className="bg-white backdrop-blur-sm rounded-lg p-6 w-48 h-32 flex flex-col items-center justify-center">
              <img 
                src="/slater.jpg" 
                alt="Slater Gordon Logo" 
                className="h-20 w-auto mb-2"
              />
              <span className="text-sm font-bold text-black">Slater Gordon</span>
            </div>
          {/* </div> */}
          
          {/* <div className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"> */}
            <div className="bg-white backdrop-blur-sm rounded-lg p-6 w-48 h-32 flex flex-col items-center justify-center">
              <img 
                src="/travelplus.webp" 
                alt="TravelPlus Logo" 
                className="h-20 w-auto mb-2"
              />
              <span className="text-sm font-bold text-black">TravelPlus</span>
            </div>
          {/* </div> */}
          
          {/* <div className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"> */}
            <div className="bg-white backdrop-blur-sm rounded-lg p-6 w-48 h-32 flex flex-col items-center justify-center">
              <a href="https://cdnlogo.com/logo/amazon_2443.html" className="flex flex-col items-center">
                <img 
                  src="https://static.cdnlogo.com/logos/a/85/amazon.svg" 
                  alt="Amazon Logo" 
                  className="h-20 w-auto mb-2"
                />
                <span className="text-sm font-bold text-black">Amazon</span>
              </a>
            </div>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;