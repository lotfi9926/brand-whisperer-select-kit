
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface BatchNumbersProps {
  waterPeptone: string;
  setWaterPeptone: (value: string) => void;
  petriDishes: string;
  setPetriDishes: (value: string) => void;
  VRBGGel: string;
  setVRBGGel: (value: string) => void;
  YGCGel: string;
  setYGCGel: (value: string) => void;
}

const BatchNumbers = ({
  waterPeptone,
  setWaterPeptone,
  petriDishes,
  setPetriDishes,
  VRBGGel,
  setVRBGGel,
  YGCGel,
  setYGCGel
}: BatchNumbersProps) => {
  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Numéros de lot</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waterPeptone">Numéro de lot - Eau péptonée</Label>
          <Input 
            id="waterPeptone" 
            value={waterPeptone} 
            onChange={(e) => setWaterPeptone(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="petriDishes">Numéro de lot - Boîtes de Petri</Label>
          <Input 
            id="petriDishes" 
            value={petriDishes} 
            onChange={(e) => setPetriDishes(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="VRBGGel">Numéro de lot - Gélose VRBG</Label>
          <Input 
            id="VRBGGel" 
            value={VRBGGel} 
            onChange={(e) => setVRBGGel(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="YGCGel">Numéro de lot - Gélose YGC</Label>
          <Input 
            id="YGCGel" 
            value={YGCGel} 
            onChange={(e) => setYGCGel(e.target.value)} 
          />
        </div>
      </div>
    </Card>
  );
};

export default BatchNumbers;
