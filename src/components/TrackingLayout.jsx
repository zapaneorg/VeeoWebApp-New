import React from 'react';
import Header from '@/components/Header';

const TrackingLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  );
};

export default TrackingLayout;