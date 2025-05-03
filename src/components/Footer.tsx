import React from 'react';
import { Bot, Twitter, Linkedin, Facebook, Mail, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-950 text-gray-400">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold text-white">Sapphyr</span>
            </div>
            <p className="mb-4">
              The AI-native platform to power inbound-led growth for your professional services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Voice <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  WhatsApp <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Web Chat <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Integrations <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Blog <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Case Studies <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Documentation <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors inline-flex items-center">
                  Pricing <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-2 mt-0.5 text-indigo-400" />
                <span>contact@Sapphyr.ai</span>
              </li>
              <li>
                <a 
                  href="#book-call" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  Book a Demo
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Sapphyr. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;