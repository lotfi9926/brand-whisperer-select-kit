
import React from 'react';

interface SamplePageHeaderProps {
  title: string;
}

const SamplePageHeader = ({ title }: SamplePageHeaderProps) => {
  return (
    <header className="bg-[#0091CA] text-white py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold">MAISON COLLET</h1>
        <h2 className="text-xl mt-2">{title}</h2>
      </div>
    </header>
  );
};

export default SamplePageHeader;
