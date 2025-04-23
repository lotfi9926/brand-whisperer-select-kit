
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Sample {
  id: number;
  number: string;
  product: string;
  readyTime: string;
  fabrication: string;
  dlc: string;
  smell: string;
  texture: string;
  taste: string;
  aspect: string;
  ph: string;
  enterobacteria: string;
  yeastMold: string;
}

interface SampleTableRowProps {
  sample: Sample;
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: number, field: keyof Sample, value: string) => void;
  toggleConformity: (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
}

const SampleTableRow: React.FC<SampleTableRowProps> = ({
  sample,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  toggleConformity
}) => {
  return (
    <TableRow>
      <TableCell className="min-w-[80px]">
        <Input 
          value={sample.number} 
          onChange={(e) => updateSample(sample.id, 'number', e.target.value)} 
          className="w-full"
        />
      </TableCell>
      <TableCell className="min-w-[200px]">
        {isGrandFrais ? (
          <Select
            value={sample.product}
            onValueChange={(value) => updateSample(sample.id, 'product', value)}
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
          />
        )}
      </TableCell>
      <TableCell className="min-w-[120px]">
        <Input 
          type="time"
          value={sample.readyTime} 
          onChange={(e) => updateSample(sample.id, 'readyTime', e.target.value)} 
          className="w-full"
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <Input 
          type="date"
          value={sample.fabrication} 
          onChange={(e) => updateSample(sample.id, 'fabrication', e.target.value)} 
          className="w-full"
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <Input 
          type="date"
          value={sample.dlc} 
          onChange={(e) => updateSample(sample.id, 'dlc', e.target.value)} 
          className="w-full"
          readOnly={isGrandFrais}
          className={isGrandFrais ? "w-full bg-gray-100" : "w-full"}
        />
      </TableCell>
      <TableCell className="min-w-[120px]">
        <Button 
          onClick={() => toggleConformity(sample.id, 'smell')}
          className={`w-full ${sample.smell === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {sample.smell === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.smell}
        </Button>
      </TableCell>
      <TableCell className="min-w-[120px]">
        <Button 
          onClick={() => toggleConformity(sample.id, 'texture')}
          className={`w-full ${sample.texture === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {sample.texture === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.texture}
        </Button>
      </TableCell>
      <TableCell className="min-w-[120px]">
        <Button 
          onClick={() => toggleConformity(sample.id, 'taste')}
          className={`w-full ${sample.taste === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {sample.taste === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.taste}
        </Button>
      </TableCell>
      <TableCell className="min-w-[120px]">
        <Button 
          onClick={() => toggleConformity(sample.id, 'aspect')}
          className={`w-full ${sample.aspect === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {sample.aspect === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.aspect}
        </Button>
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Input 
          value={sample.ph} 
          onChange={(e) => updateSample(sample.id, 'ph', e.target.value)} 
          className="w-full"
          type="number"
          step="0.01"
          min="0"
          max="14"
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <Input 
          value={sample.enterobacteria} 
          onChange={(e) => updateSample(sample.id, 'enterobacteria', e.target.value)} 
          className="w-full"
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <Input 
          value={sample.yeastMold} 
          onChange={(e) => updateSample(sample.id, 'yeastMold', e.target.value)} 
          className="w-full"
        />
      </TableCell>
    </TableRow>
  );
};

export default SampleTableRow;
