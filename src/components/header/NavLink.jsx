import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NavLink = ({ to, children, onClick, className = "", isMobile = false, icon: Icon }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  const activeMobileClasses = "bg-primary/10 text-primary";
  const inactiveMobileClasses = "text-brand-dark-gray hover:bg-gray-100/80";
  
  const activeDesktopClasses = "text-white";
  const inactiveDesktopClasses = "text-gray-200 hover:text-white"; // Adjusted inactive desktop color

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        `px-3 py-2 font-medium transition-colors duration-200 ease-in-out flex items-center group relative rounded-md`,
        isMobile 
          ? `text-lg py-3 w-full ${match ? activeMobileClasses : inactiveMobileClasses}` 
          : `text-sm ${match ? activeDesktopClasses : inactiveDesktopClasses}`,
        className
      )}
    >
      {Icon && <Icon className={cn(
          "mr-2 h-4 w-4", // Common icon style for desktop
          isMobile 
            ? (match ? "text-primary" : "text-brand-dark-gray/80 mr-3 h-5 w-5") // Mobile specific icon style
            : (match ? "text-white" : "text-gray-200 group-hover:text-white") // Desktop specific icon style for non-active states
        )} 
      />}
      <span className={isMobile && match ? "font-semibold" : ""}>{children}</span>
      {!isMobile && (
        <span className={cn(
          "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-1.5rem)] h-0.5 bg-white transition-transform duration-300 ease-out",
          match ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}></span>
      )}
    </Link>
  );
};

export default NavLink;