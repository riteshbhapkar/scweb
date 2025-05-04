import React from 'react';
import { ArrowRight, Globe, BookOpen, Database, Bot, Zap, Link } from 'lucide-react';

const CapabilityTile: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <div className="card hover:border-indigo-500/30 h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="mb-4 text-indigo-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 mb-4 flex-grow">{description}</p>
        <div className="mt-auto">
          {/* <button className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
            Learn more <ArrowRight className="w-4 h-4 ml-1" />
          </button> */}
        </div>
      </div>
    </div>
  );
};

const AdditionalCapabilities: React.FC = () => {
  return (
    <section id="capabilities" className="section-padding bg-gray-950/80" style={{ marginTop: -100 }}>
      <div className="container-custom">
        <div className="text-center mb-16 fade-in">
          <h2 className="mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
            And There's More...
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            Beyond core channels, our AI agents can extend their capabilities across your entire tech stack
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          <CapabilityTile
            title="Cross-App Actions"
            description="Automate tasks across tools like Email, Slack, Trello, Google Workspace, and more for seamless workflow integration."
            icon={<Link className="w-8 h-8" />}
          />
          <CapabilityTile
            title="Personalized Research"
            description="Generate instant insights and recommendations by analyzing public data about prospects, customers, and market trends."
            icon={<Globe className="w-8 h-8" />}
          />
          <CapabilityTile
            title="Doc Analysis"
            description="Let your AI agent become your knowledge and analytics partner by extracting insights from documents, contracts, and reports."
            icon={<BookOpen className="w-8 h-8" />}
          />
          <CapabilityTile
            title="Data Intelligence"
            description="Connect your AI agents to your databases and data warehouses for real-time intelligence and actionable insights."
            icon={<Database className="w-8 h-8" />}
          />
          <CapabilityTile
            title="Multi-Agent Collaboration"
            description="Deploy specialized agents that work together to solve complex tasks requiring diverse expertise."
            icon={<Bot className="w-8 h-8" />}
          />
          <CapabilityTile
            title="Automation Workflows"
            description="Create custom automation sequences triggered by events, time, or conditions across your entire digital ecosystem."
            icon={<Zap className="w-8 h-8" />}
          />
        </div>
      </div>
    </section>
  );
};

export default AdditionalCapabilities;