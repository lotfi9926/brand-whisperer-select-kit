
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell } from '@/components/ui/table';
import { Sample } from '@/hooks/useSamples';

interface CoordinatorFieldsProps {
  sample: Sample;
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: number, field: keyof Sample, value: string) => void;
  isCoordinator: boolean;
  isLocked: boolean;
}

export const CoordinatorFields: React.FC<CoordinatorFieldsProps> = ({
  sample,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  isCoordinator,
  isLocked,
}) => {
  return (
    <>
      <TableCell className="bg-blue-50">
        <Input 
          value={sample.number} 
          onChange={(e) => updateSample(sample.id, 'number', e.target.value)} 
          className="w-full"
          readOnly={!isCoordinator || isLocked}
          disabled={!isCoordinator || isLocked}
        />
      </TableCell>
      <TableCell className="bg-blue-50">
        {isGrandFrais ? (
          <Select
            value={sample.product}
            onValueChange={(value) => updateSample(sample.id, 'product', value)}
            disabled={!isCoordinator || isLocked}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              {GF_PRODUCTS.map((product) => (
                <SelectItem key={product} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input 
            value={sample.product} 
            onChange={(e) => updateSample(sample.id, 'product', e.target.value)} 
            className="w-full"
            readOnly={!isCoordinator || isLocked}
            disabled={!isCoordinator || isLocked}
          />
        )}
      </TableCell>
      <TableCell className="bg-blue-50">
        <Input 
          type="time"
          value={sample.readyTime} 
          onChange={(e) => updateSample(sample.id, 'readyTime', e.target.value)} 
          className="w-full"
          readOnly={!isCoordinator || isLocked}
          disabled={!isCoordinator || isLocked}
        />
      </TableCell>
      <TableCell className="bg-blue-50">
        <Input 
          type="date"
          value={sample.fabrication} 
          onChange={(e) => updateSample(sample.id, 'fabrication', e.target.value)} 
          className="w-full"
          readOnly={!isCoordinator || isLocked}
          disabled={!isCoordinator || isLocked}
        />
      </TableCell>
      <TableCell className="bg-blue-50">
        <Input 
          type="date"
          value={sample.dlc} 
          onChange={(e) => updateSample(sample.id, 'dlc', e.target.value)} 
          className={isGrandFrais ? "w-full bg-gray-100" : "w-full"}
          readOnly={isGrandFrais || !isCoordinator || isLocked}
          disabled={isGrandFrais || !isCoordinator || isLocked}
        />
      </TableCell>
    </>
  );
};
