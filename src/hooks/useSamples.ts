
import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export interface Sample {
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

interface UseSamplesProps {
  savedSamples?: Sample[];
  brand?: string;
}

export const useSamples = ({ savedSamples = [], brand = '' }: UseSamplesProps) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (savedSamples && savedSamples.length > 0) {
      setSamples(savedSamples);
    }
  }, [savedSamples]);

  const addSample = () => {
    const sampleNumber = (samples.length + 1).toString();
    const newSample: Sample = {
      id: Date.now(),
      number: sampleNumber,
      product: '',
      readyTime: '',
      fabrication: '',
      dlc: '',
      smell: 'N',
      texture: 'N',
      taste: 'N',
      aspect: 'N',
      ph: '',
      enterobacteria: '',
      yeastMold: '',
    };
    
    setSamples([...samples, newSample]);
  };

  const updateSample = (id: number, field: keyof Sample, value: string) => {
    setSamples(samples.map(sample => {
      if (sample.id === id) {
        const updatedSample = { ...sample, [field]: value };
        
        if (brand === '1' && field === 'fabrication' && value) {
          try {
            const fabricationDate = new Date(value);
            const dlcDate = addDays(fabricationDate, 60);
            updatedSample.dlc = format(dlcDate, 'yyyy-MM-dd');
          } catch (e) {
            console.error("Error calculating DLC date:", e);
          }
        }
        
        return updatedSample;
      }
      return sample;
    }));
  };

  const toggleConformity = (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => {
    setSamples(samples.map(sample => 
      sample.id === id ? { ...sample, [field]: sample[field] === 'N' ? 'NC' : 'N' } : sample
    ));
  };

  const validateSamples = () => {
    const isValidSamples = samples.every(sample => 
      sample.number && 
      sample.product && 
      sample.readyTime && 
      sample.fabrication
    );

    if (!isValidSamples) {
      toast({
        title: "Données incomplètes",
        description: "Veuillez remplir au moins les 4 premières colonnes pour chaque échantillon.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    samples,
    addSample,
    updateSample,
    toggleConformity,
    validateSamples
  };
};
