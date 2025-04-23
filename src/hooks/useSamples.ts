
import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/AuthContext';

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
  createdAt?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  status?: 'pending' | 'inProgress' | 'completed';
}

interface ChangeHistoryEntry {
  id: string;
  sampleId?: number;
  field?: string;
  oldValue?: string;
  newValue?: string;
  action: 'create' | 'update' | 'delete' | 'save' | 'lock_fields' | 'other';
  user: string;
  role: UserRole | 'guest';
  timestamp: string;
}

interface UseSamplesProps {
  savedSamples?: Sample[];
  brand?: string;
}

export const useSamples = ({ savedSamples = [], brand = '' }: UseSamplesProps) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry[]>([]);
  const { toast } = useToast();

  // Initialize samples and load change history
  useEffect(() => {
    if (savedSamples && savedSamples.length > 0) {
      setSamples(savedSamples);
    }

    // Load change history from localStorage
    const storedHistory = localStorage.getItem('qc_change_history');
    if (storedHistory) {
      setChangeHistory(JSON.parse(storedHistory));
    }
  }, [savedSamples]);

  // Save change history to localStorage when it changes
  useEffect(() => {
    if (changeHistory.length > 0) {
      localStorage.setItem('qc_change_history', JSON.stringify(changeHistory));
    }
  }, [changeHistory]);

  const addSample = () => {
    const currentDate = new Date().toISOString();
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
      createdAt: currentDate,
      modifiedAt: currentDate,
      status: 'pending'
    };
    
    setSamples([...samples, newSample]);
    
    // Add to change history
    addChangeHistory({
      action: 'create',
      sampleId: newSample.id,
    });
  };

  const updateSample = (id: number, field: keyof Sample, value: string) => {
    setSamples(samples.map(sample => {
      if (sample.id === id) {
        const oldValue = sample[field] as string;
        const updatedSample = { 
          ...sample, 
          [field]: value,
          modifiedAt: new Date().toISOString()
        };
        
        // Add to change history
        if (oldValue !== value) {
          addChangeHistory({
            action: 'update',
            sampleId: id,
            field,
            oldValue,
            newValue: value
          });
        }
        
        if (brand === '1' && field === 'fabrication' && value) {
          try {
            const fabricationDate = new Date(value);
            const dlcDate = addDays(fabricationDate, 60);
            updatedSample.dlc = format(dlcDate, 'yyyy-MM-dd');
            
            // Add DLC update to history as well
            addChangeHistory({
              action: 'update',
              sampleId: id,
              field: 'dlc',
              oldValue: sample.dlc,
              newValue: updatedSample.dlc
            });
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
    setSamples(samples.map(sample => {
      if (sample.id === id) {
        const oldValue = sample[field];
        const newValue = sample[field] === 'N' ? 'NC' : 'N';
        
        // Add to change history
        addChangeHistory({
          action: 'update',
          sampleId: id,
          field,
          oldValue,
          newValue
        });
        
        return { 
          ...sample, 
          [field]: newValue,
          modifiedAt: new Date().toISOString()
        };
      }
      return sample;
    }));
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

  const addChangeHistory = ({
    sampleId,
    field,
    oldValue,
    newValue,
    action,
    user,
    role,
    timestamp
  }: {
    sampleId?: number;
    field?: string;
    oldValue?: string;
    newValue?: string;
    action?: 'create' | 'update' | 'delete' | 'save' | 'lock_fields' | 'other';
    user?: string;
    role?: UserRole | 'guest';
    timestamp?: string;
  }) => {
    const entry: ChangeHistoryEntry = {
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sampleId,
      field,
      oldValue,
      newValue,
      action: action || 'other',
      user: user || 'Unknown',
      role: role || 'guest',
      timestamp: timestamp || new Date().toISOString()
    };
    
    setChangeHistory(prev => [entry, ...prev]);
    return entry.id;
  };

  const getChangeHistory = () => {
    return changeHistory;
  };

  return {
    samples,
    addSample,
    updateSample,
    toggleConformity,
    validateSamples,
    addChangeHistory,
    getChangeHistory
  };
};
