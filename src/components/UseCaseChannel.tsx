import React from 'react';
import UseCaseCard from './UseCaseCard';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  description: string;
}

interface UseCase {
  title: string;
  description: string;
  metrics: Metric[];
  icon: LucideIcon;
}

interface UseCaseChannelProps {
  title: string;
  description: string;
  useCases: UseCase[];
  gradient: string;
  icon: LucideIcon;
}

const UseCaseChannel: React.FC<UseCaseChannelProps> = ({ 
  title, 
  description, 
  useCases,
  gradient,
  icon: Icon
}) => {
  return (
    <div className="fade-in">
      <div className="mb-12 flex flex-col md:flex-row md:items-center gap-6">
        <div className={`rounded-full p-5 bg-gradient-to-r ${gradient} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300 max-w-2xl">{description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <UseCaseCard
            key={index}
            title={useCase.title}
            description={useCase.description}
            metrics={useCase.metrics}
            icon={useCase.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default UseCaseChannel;