
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { Sample } from '@/hooks/useSamples';

interface TechnicianFieldsProps {
  sample: Sample;
  toggleConformity: (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
  updateSample: (id: number, field: keyof Sample, value: string) => void;
  isTechnician: boolean;
  alertStatus: string | null;
}

export const TechnicianFields: React.FC<TechnicianFieldsProps> = ({
  sample,
  toggleConformity,
  updateSample,
  isTechnician,
  alertStatus
}) => {
  const renderConformityButton = (field: 'smell' | 'texture' | 'taste' | 'aspect') => (
    <Button 
      onClick={() => isTechnician && toggleConformity(sample.id, field)}
      className={`w-full ${sample[field] === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
      disabled={!isTechnician}
    >
      {sample[field] === 'N' ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <X className="w-4 h-4 mr-2" />
      )}
      {sample[field]}
    </Button>
  );

  return (
    <>
      <TableCell className="bg-green-50">{renderConformityButton('smell')}</TableCell>
      <TableCell className="bg-green-50">{renderConformityButton('texture')}</TableCell>
      <TableCell className="bg-green-50">{renderConformityButton('taste')}</TableCell>
      <TableCell className="bg-green-50">{renderConformityButton('aspect')}</TableCell>
      <TableCell className="bg-green-50">
        <Input 
          value={sample.ph} 
          onChange={(e) => updateSample(sample.id, 'ph', e.target.value)} 
          className="w-full"
          type="number"
          step="0.01"
          min="0"
          max="14"
          readOnly={!isTechnician}
          disabled={!isTechnician}
        />
      </TableCell>
      <TableCell className={`bg-green-50 ${alertStatus === 'warning' ? 'bg-yellow-100' : ''}`}>
        <Input 
          value={sample.enterobacteria} 
          onChange={(e) => updateSample(sample.id, 'enterobacteria', e.target.value)} 
          className={`w-full ${alertStatus === 'warning' ? 'border-yellow-400' : ''}`}
          readOnly={!isTechnician}
          disabled={!isTechnician}
        />
      </TableCell>
      <TableCell className={`bg-green-50 ${alertStatus === 'urgent' ? 'bg-red-100' : ''}`}>
        <Input 
          value={sample.yeastMold} 
          onChange={(e) => updateSample(sample.id, 'yeastMold', e.target.value)} 
          className={`w-full ${alertStatus === 'urgent' ? 'border-red-400' : ''}`}
          readOnly={!isTechnician}
          disabled={!isTechnician}
        />
      </TableCell>
    </>
  );
};
