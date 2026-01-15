'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', pulse = false, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700',
      warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700',
      danger: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700',
      info: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700',
      purple: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700',
      pink: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };