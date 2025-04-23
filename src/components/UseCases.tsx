import React from 'react';
import UseCaseChannel from './UseCaseChannel';
import { Mic, MessageSquare, Phone } from 'lucide-react';

const UseCases: React.FC = () => {
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

  return (
    <section id="use-cases" className="section-padding bg-gray-950">
      <div className="container-custom">
        <div className="text-center mb-16 fade-in">
          <h2 className="mb-4 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            What Magic Looks Like
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            Harness the power of Agent OS across multiple channels — like having an army of intelligent agents at your fingertips, working 24/7 to grow your business.
          </p>
        </div>

        <div className="space-y-24">
          <UseCaseChannel 
            title="Voice" 
            description="Transform how you handle calls and meetings with AI-powered voice intelligence"
            useCases={voiceUseCases}
            gradient="from-indigo-500 to-purple-600"
            icon={Mic}
          />

          <UseCaseChannel 
            title="Chat (Web + WhatsApp)" 
            description="Engage clients through intelligent, conversational interfaces on any platform"
            useCases={chatUseCases}
            gradient="from-teal-500 to-indigo-600"
            icon={MessageSquare}
          />
        </div>
      </div>
    </section>
  );
};

export default UseCases;