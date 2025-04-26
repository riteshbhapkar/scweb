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
      description: 'Real-time AI assistant with live transcription, speaker ID, and suggested responses for complex client interactions. No bots in your meetings — keep it authentic.',
      metrics: [
        { label: 'Higher Close Rates', value: '40%', description: 'Convert challenging consultations into wins.' },
        { label: 'Information Retention', value: '95%+', description: 'Eliminate post-call gaps.' },
        { label: 'Less Prep Time', value: '60%', description: 'Deliver confident, expert-backed responses instantly.' }
      ],
      icon: Mic
    },
    {
      title: 'Call Analytics Agent',
      description: 'Unlock deep insights from calls using audio intelligence.',
      metrics: [
        { label: 'Cost Reduction', value: '80%', description: 'Lower operational expenses' },
        { label: 'Lower Risk', value: '6X', description: 'Reduce compliance issues' },
        { label: 'More Feedback', value: '4X', description: 'Increase training effectiveness' }
      ],
      icon: Phone
    },
    {
      title: 'Voice Agent',
      description: 'Handle inbound calls using human-like AI voice agents.',
      metrics: [
        { label: 'Lead Management', value: '24/7', description: 'Lead qualification + data enrichment + follow-ups' },
        { label: 'Availability', value: '100%', description: 'Never miss a potential client again' },
        { label: 'Time Savings', value: 'Significant', description: 'Free up resources for high-value tasks' }
      ],
      icon: Phone
    }
  ];

  // Chat channel use cases
  const chatUseCases = [
    {
      title: 'Conversational Growth Agent',
      description: 'WhatsApp-based AI that personalizes messaging and guides users through conversion funnels.',
      metrics: [
        { label: 'Engagement Boost', value: '45%+', description: 'From typical 12% to over 45%' },
        { label: 'Higher Conversion', value: '3X', description: 'Triple your conversion rates' },
        { label: 'Shorter Sales Cycles', value: '50%', description: 'Cut your sales timeline in half' }
      ],
      icon: MessageSquare
    },
    {
      title: 'Lead Qualification',
      description: '24/7 AI virtual receptionists that screen and manage leads.',
      metrics: [
        { label: 'Intake Time', value: '5 mins', description: 'Cut intake time from 30 mins to 5 mins' },
        { label: 'Revenue per Lead', value: '$500', description: 'Earn up to $500 per qualified lead transferred' },
        { label: 'Response Time', value: 'Instant', description: 'Never keep potential clients waiting' }
      ],
      icon: MessageSquare
    },
    {
      title: 'Customer Success Agent',
      description: 'Intelligent platform that reduces churn and manages customer growth proactively.',
      metrics: [
        { label: 'Resolution Rate', value: '95%', description: 'First-time resolution success' },
        { label: 'Workload Reduction', value: '50%', description: 'For success managers' },
        { label: 'Retention Improvement', value: 'Significant', description: 'Keep clients longer, grow relationships' }
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
            Harness the power of Agent OS across multiple channels — like having an army of intelligent agents at your fingertips, working 24/7 to grow your business.
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