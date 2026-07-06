import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
};

export default Loader;
