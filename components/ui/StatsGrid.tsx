'use client';

import { ReactNode } from 'react';
import { Card } from './Card';

interface StatsGridProps {
  stats: {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
      value: number;
      label: string;
    };
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  }[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              {stat.trend && (
                <p
                  className={`text-sm mt-2 ${
                    stat.trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend.value >= 0 ? '↑' : '↓'} {stat.trend.value}% {stat.trend.label}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[stat.color || 'blue']}`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}