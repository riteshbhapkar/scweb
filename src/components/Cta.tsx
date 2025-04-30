import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const Cta: React.FC = () => {
  // Add state for form data
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  });
  // Add loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Add success message state
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  // Add error message state
  const [submitError, setSubmitError] = useState<string>('');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Google Apps Script URL that will handle the form submission
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwRHKPNxsqSszKAe-3eiyZKgSUcOJ4Cy9vPjZ45YETBxbY-MqQ42ezYpjagdB_H-uQr/exec';
      
      // Create form data to send
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('organization', formData.company);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('email', formData.email);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('sheetUrl', 'https://docs.google.com/spreadsheets/d/1S6XqHAwBj6NvZzkm9gSaWsY6qzPZf5Q_yHB9wXvA3_8/edit?usp=sharing');
      
      // Send the data
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        // Show success message
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: ''
        });
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
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
              
              {/* Book Demo button removed as requested */}
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 animate-float">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Request Your Demo</h3>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="john@company.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="Company Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Demo'}
                </button>
                
                {submitSuccess && (
                  <div className="mt-3 text-center text-green-400">
                    Thank you! Your demo request has been submitted successfully.
                  </div>
                )}
                
                {submitError && (
                  <div className="mt-3 text-center text-red-400">
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;