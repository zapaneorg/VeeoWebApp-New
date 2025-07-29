import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PersistentTrackingBanner from './PersistentTrackingBanner';
import ScrollToTopButton from './ScrollToTopButton';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <PersistentTrackingBanner />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;