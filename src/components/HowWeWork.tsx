import React from 'react';
import { ClipboardCheck, Lightbulb, Play, Rocket } from 'lucide-react';

interface TimelineStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ 
  title, 
  description, 
  icon,
  isLast = false 
}) => {
  return (
    <div className="relative flex items-start pb-12">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute top-6 left-5 w-0.5 h-full bg-gradient-to-b from-indigo-500 to-indigo-300/20"></div>
      )}
      
      {/* Icon container */}
      <div className="flex-shrink-0 mr-6 relative z-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-1">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const HowWeWork: React.FC = () => {
  return (
    <section id="how-we-work" className="section-padding bg-gray-950">
      <div className="container-custom">
        <div className="text-center mb-16 fade-in">
          <h2 className="mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            How We Work
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            A streamlined process to bring AI superpowers to your business
          </p>
        </div>

        <div className="max-w-2xl mx-auto fade-in">
          <TimelineStep
            title="Understanding You"
            description="Initial consultation to uncover growth opportunities and understand your unique business challenges."
            icon={<ClipboardCheck className="w-5 h-5" />}
          />
          
          <TimelineStep
            title="First Peek"
            description="Personalized demo of your AI superpowers tailored to your specific use cases and requirements."
            icon={<Lightbulb className="w-5 h-5" />}
          />
          
          <TimelineStep
            title="Watch It Happen"
            description="Test-drive the magic in real time with a hands-on pilot of the platform using your actual business scenarios."
            icon={<Play className="w-5 h-5" />}
          />
          
          <TimelineStep
            title="Go Live & Beyond"
            description="Full implementation in a week with ongoing optimization and support to ensure continuous improvement."
            icon={<Rocket className="w-5 h-5" />}
            isLast={true}
          />
        </div>

        <div className="mt-12 text-center fade-in">
          <blockquote className="max-w-xl mx-auto italic text-lg text-gray-300">
            "If you take care of things at the bottom of the funnel, the top line will take care of itself."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;