import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  description: string;
}

interface UseCaseCardProps {
  title: string;
  description: string;
  metrics: Metric[];
  icon: LucideIcon;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ 
  title, 
  description, 
  metrics,
  icon: Icon
}) => {
  return (
    <div className="card group hover:translate-y-[-4px]">
      <div className="p-6">
        <div className="mb-4">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
        <h4 className="text-xl font-bold mb-3">{title}</h4>
        <p className="text-gray-300 mb-6">{description}</p>
        
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white font-bold text-xs">
                  {index + 1}
                </div>
              </div>
              <div>
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-lg font-bold text-indigo-400">{metric.value}</span>
                  <span className="text-sm font-medium text-gray-300">{metric.label}</span>
                </div>
                <p className="text-sm text-gray-400">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UseCaseCard;