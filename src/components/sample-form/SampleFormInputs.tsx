
import React from 'react';
import { Input } from '@/components/ui/input';

interface SampleFormInputsProps {
  site: string;
  setSite: (value: string) => void;
  sampleDate: string;
  setSampleDate: (value: string) => void;
  reference: string;
  setReference: (value: string) => void;
}

const SampleFormInputs = ({ 
  site, 
  setSite, 
  sampleDate, 
  setSampleDate, 
  reference, 
  setReference 
}: SampleFormInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Site*</label>
        <Input 
          placeholder="Entrer le site" 
          value={site} 
          onChange={(e) => setSite(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Date envoi échantillons*</label>
        <Input 
          type="date" 
          value={sampleDate} 
          onChange={(e) => setSampleDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Référence commande</label>
        <Input 
          placeholder="Entrer la référence" 
          value={reference} 
          onChange={(e) => setReference(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SampleFormInputs;
