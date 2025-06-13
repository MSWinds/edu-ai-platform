import React from 'react';
import { colors } from '../theme/colors';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  className = "", 
  actions 
}) => {
  return (
    <div className={`mb-1 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ background: colors.gradient.primary }}>
              <div className="h-6 w-6 text-white">
                {icon}
              </div>
            </div>
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-2 text-base">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 