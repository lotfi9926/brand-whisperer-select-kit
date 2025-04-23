
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/contexts/AuthContext';
import { differenceInHours, differenceInDays, parseISO } from 'date-fns';

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
  createdAt?: string;
}

interface SampleTableRowProps {
  sample: Sample;
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: number, field: keyof Sample, value: string) => void;
  toggleConformity: (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
  isLocked: boolean;
  userRole: UserRole | 'guest';
}

const SampleTableRow: React.FC<SampleTableRowProps> = ({
  sample,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  toggleConformity,
  isLocked,
  userRole
}) => {
  const isCoordinator = userRole === 'coordinator';
  const isTechnician = userRole === 'technician';
  
  // Check if the sample has timing alerts
  const getAlertStatus = () => {
    if (!sample.createdAt) return null;
    
    try {
      const currentDate = new Date();
      const sampleDate = parseISO(sample.createdAt);
      const hoursSince = differenceInHours(currentDate, sampleDate);
      const daysSince = differenceInDays(currentDate, sampleDate);
      
      // Alert for enterobacteria
      if (hoursSince >= 24 && !sample.enterobacteria) {
        return 'warning'; // yellow alert
      }
      
      // Alert for yeast/mold
      if (daysSince >= 5 && !sample.yeastMold) {
        return 'urgent'; // red alert
      }
      
      return null;
    } catch (error) {
      console.error('Error calculating alert status:', error);
      return null;
    }
  };
  
  const alertStatus = getAlertStatus();
  const rowClassName = alertStatus === 'urgent' ? 'bg-red-50' : 
                       alertStatus === 'warning' ? 'bg-yellow-50' : '';

  return (
    <TableRow className={rowClassName}>
      {/* Coordinator fields - Blue background */}
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
      
      {/* Technician fields - Green background */}
      <TableCell className="bg-green-50">
        <Button 
          onClick={() => isTechnician && toggleConformity(sample.id, 'smell')}
          className={`w-full ${sample.smell === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          disabled={!isTechnician}
        >
          {sample.smell === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.smell}
        </Button>
      </TableCell>
      <TableCell className="bg-green-50">
        <Button 
          onClick={() => isTechnician && toggleConformity(sample.id, 'texture')}
          className={`w-full ${sample.texture === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          disabled={!isTechnician}
        >
          {sample.texture === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.texture}
        </Button>
      </TableCell>
      <TableCell className="bg-green-50">
        <Button 
          onClick={() => isTechnician && toggleConformity(sample.id, 'taste')}
          className={`w-full ${sample.taste === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          disabled={!isTechnician}
        >
          {sample.taste === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.taste}
        </Button>
      </TableCell>
      <TableCell className="bg-green-50">
        <Button 
          onClick={() => isTechnician && toggleConformity(sample.id, 'aspect')}
          className={`w-full ${sample.aspect === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          disabled={!isTechnician}
        >
          {sample.aspect === 'N' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {sample.aspect}
        </Button>
      </TableCell>
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
    </TableRow>
  );
};

export default SampleTableRow;
