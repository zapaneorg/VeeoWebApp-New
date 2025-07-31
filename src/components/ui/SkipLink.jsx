import React from 'react';
import { cn } from '@/lib/utils';

const SkipLink = ({ href = '#main-content', children = 'Aller au contenu principal', className }) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  );
};

export default SkipLink;