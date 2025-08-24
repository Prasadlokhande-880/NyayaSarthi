import React, { type ReactNode } from 'react';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
};

const LandingPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar className='bg-white'/>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default LandingPageLayout;
