import React from 'react';
import { cn } from '@/lib/utils';

const VeeoLogo = ({ className }) => {
  const logoFontClass = "font-['Poppins_Bold',_sans-serif] font-black tracking-tighter";

  return (
    <div className={cn('flex items-center', logoFontClass, className)}>
      Veeo
      <span className="inline-block ml-1 text-sky-400 text-[1.2em] relative -top-[0.05em]">.</span>
    </div>
  );
};

export default VeeoLogo;