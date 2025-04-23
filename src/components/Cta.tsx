import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const Cta: React.FC = () => {
  return (
    <section id="book-call" className="section-padding bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-800 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Ready to transform your business?
              </h2>
              
              <p className="text-gray-300 mb-6">
                Schedule a personalized demo to see how our AI agents can revolutionize your customer interactions and drive growth.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/20 p-1 mr-3 mt-1">
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </span>
                  <span className="text-gray-300">Custom solutions for your specific needs</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/20 p-1 mr-3 mt-1">
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </span>
                  <span className="text-gray-300">Implementation in as little as one week</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/20 p-1 mr-3 mt-1">
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </span>
                  <span className="text-gray-300">Ongoing support and optimization</span>
                </li>
              </ul>
              
              <a 
                href="#" 
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-transparent rounded-md shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <Calendar className="w-5 h-5" />
                Book Your Demo
              </a>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 animate-float">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Schedule Your Demo</h3>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="john@company.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="Company Name"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  Request Demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;