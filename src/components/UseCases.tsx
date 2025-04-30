import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UseCaseChannel from './UseCaseChannel';
import { Mic, MessageSquare, Phone } from 'lucide-react';

const UseCases: React.FC = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(0);
  
  // Voice channel use cases
  const voiceUseCases = [
    {
      title: 'Live Call CoPilot',
      description: 'Your silent partner in every client conversation. Real-time guidance when it matters most. No awkward bot will join your meeting.',
      metrics: [
        { label: 'Higher Close Rates', value: '40%', description: 'Convert challenging consultations into wins.' },
        { label: 'Time Saved', value: '8 hours', description: 'Saved per week in pre-call preparation' },
        { label: 'Knowledge Retention', value: 'Zero', description: 'Knowledge loss between conversations' }
      ],
      icon: Mic
    },
    {
      title: 'Call Analytics Agent',
      description: 'Hear what clients are really saying. Amplify and Act on insights others miss.',
      metrics: [
        { label: 'Cost Reduction', value: '80%', description: 'Reduction in conversation analysis costs' },
        { label: 'Revenue Opportunities', value: '6', description: 'New revenue opportunities per 50 client calls' },
        { label: 'Forecasting', value: 'Precise', description: 'Revenue forecasting from conversation insights' }
      ],
      icon: Phone
    },
    {
      title: 'Voice Agent',
      description: 'Handle inbound calls with remarkably human-like voice agents that represent your brand perfectly, 24/7.',
      metrics: [
        { label: 'Lead Capture', value: '24/7', description: 'Response capability capturing 3X more qualified leads' },
        { label: 'Sales Cycle', value: '4-hour', description: 'Acceleration in sales cycle from initial contact' },
        { label: 'Lead Quality', value: 'Precise', description: 'Pre-qualification leading to direct increase in lead quality' }
      ],
      icon: Phone
    }
  ];

  // Chat channel use cases
  const chatUseCases = [
    {
      title: 'Conversational Growth Agent',
      description: 'Turn your client data into personalized conversations that feel natural, guide users through your conversion funnel, and create memorable brand experiences across platforms.',
      metrics: [
        { label: 'Engagement Rates', value: '3x', description: 'Boost engagement rates by upto 3x with context-aware messaging' },
        { label: 'Acquisition Cost', value: '40%', description: 'Reduce Client acquisition cost by 40%' },
        { label: 'Revenue Opportunities', value: 'Active', description: 'Turn passive audience at every touchpoint into active revenue opportunities' }
      ],
      icon: MessageSquare
    },
    {
      title: 'Lead qualification',
      description: '24/7 Virtual Receptionists and Intake Specialists that handle initial client screening, management, and follow-ups with remarkable attention to detail.',
      metrics: [
        { label: 'Intake Time', value: '5 mins', description: 'Reduce intake time from 30 mins to 5 mins with AI-powered client screening' },
        { label: 'Revenue per Lead', value: '$500', description: 'Earn up-to $500 for every qualified lead transferred through our network' },
        { label: 'Rejected Leads', value: 'Revenue', description: 'Transform rejected leads into a new revenue stream with automated payments and transparent tracking' }
      ],
      icon: MessageSquare
    },
    {
      title: 'Customer Success',
      description: '24/7 intelligent customer success platform that proactively manages customer lifecycle, identifies expansion opportunities, and prevents churn before it happens.',
      metrics: [
        { label: 'Resolution Rate', value: '95%', description: 'First-contact resolution for support inquiries' },
        { label: 'Client Lifetime Value', value: '30%', description: 'Average client lifetime value increased by 30%' },
        { label: 'Service Expansions', value: '4x', description: 'Up to 4x increase in service expansions from existing clients' }
      ],
      icon: MessageSquare
    }
  ];

  // Define tabs content
  const tabs = [
    {
      title: "Voice",
      description: "Transform how you handle calls and meetings with AI-powered voice intelligence",
      content: <UseCaseChannel 
        title="Voice" 
        description="Transform how you handle calls and meetings with AI-powered voice intelligence"
        useCases={voiceUseCases}
        gradient="from-indigo-500 to-purple-600"
        icon={Mic}
      />
    },
    {
      title: "Chat (Web + WhatsApp)",
      description: "Engage clients through intelligent, conversational interfaces on any platform",
      content: <UseCaseChannel 
        title="Chat (Web + WhatsApp)" 
        description="Engage clients through intelligent, conversational interfaces on any platform"
        useCases={chatUseCases}
        gradient="from-teal-500 to-indigo-600"
        icon={MessageSquare}
      />
    }
  ];

  return (
    <section id="use-cases" className="section-padding bg-gray-950" style={{ paddingTop: '1rem' }}>
      <div className="container-custom">
        <div className="text-center mb-12 fade-in">
          <h2 className="mb-4 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            What Magic Looks Like
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            Harness the power of Rivera across multiple channels — The intelligence platform for predictable growth, working 24/7 to grow your business.
          </p>
        </div>

        {/* Enhanced Tab Navigation - More Beautiful Version */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 p-[1px] shadow-lg">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-600/30 blur-md"></div>
            <div className="relative flex rounded-full bg-gray-900/80 backdrop-blur-md p-1">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className="relative px-6 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300"
                >
                  {activeTab === index && (
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                      layoutId="activeTabPill"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${activeTab === index ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                    {tab.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content with improved transitions */}
        <div className="tab-content">
          {tabs.map((tab, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: activeTab === index ? 1 : 0,
                y: activeTab === index ? 0 : 20,
                position: activeTab === index ? 'relative' : 'absolute',
                zIndex: activeTab === index ? 1 : 0,
                width: '100%'
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1.0]
              }}
              className={activeTab === index ? 'block' : 'hidden'}
            >
              {tab.content}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Add subtle animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-purple-600/5 blur-3xl"></div>
      </div>
    </section>
  );
};

export default UseCases;