import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AnalyticsCardSkeleton } from './SkeletonLoader';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  isLoading?: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  isLoading = false
}) => {
  // Show skeleton loader while data is loading
  if (isLoading) {
    return <AnalyticsCardSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm mt-2 font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
