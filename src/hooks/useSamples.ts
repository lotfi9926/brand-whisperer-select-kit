import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

interface UseSamplesProps {
  savedSamples?: Sample[];
  brand?: string;
}

export const useSamples = ({ savedSamples = [], brand = '' }: UseSamplesProps) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const { toast } = useToast();

  // Load samples from Supabase on mount
  useEffect(() => {
    const loadSamples = async () => {
      try {
        const { data, error } = await supabase
          .from('samples')
          .select('*')
          .eq('brand', brand)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setSamples(data.map(sample => ({
            ...sample,
            readyTime: sample.ready_time,
            yeastMold: sample.yeast_mold,
            createdAt: sample.created_at,
            modifiedAt: sample.modified_at,
            modifiedBy: sample.modified_by
          })));
        }
      } catch (error) {
        console.error('Error loading samples:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les échantillons",
          variant: "destructive"
        });
      }
    };

    loadSamples();
  }, [brand]);

  const addSample = async () => {
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

    try {
      const { data, error } = await supabase
        .from('samples')
        .insert([{
          number: newSample.number,
          product: newSample.product,
          ready_time: newSample.readyTime,
          fabrication: newSample.fabrication,
          dlc: newSample.dlc,
          smell: newSample.smell,
          texture: newSample.texture,
          taste: newSample.taste,
          aspect: newSample.aspect,
          ph: newSample.ph,
          enterobacteria: newSample.enterobacteria,
          yeast_mold: newSample.yeastMold,
          brand: brand
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSamples(prev => [data, ...prev]);
      }

      await addChangeHistory({
        action: 'create',
        sampleId: data.id,
      });

    } catch (error) {
      console.error('Error adding sample:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'échantillon",
        variant: "destructive"
      });
    }
  };

  const updateSample = async (id: number, field: keyof Sample, value: string) => {
    try {
      const sample = samples.find(s => s.id === id);
      if (!sample) return;

      const oldValue = sample[field] as string;
      const updateData: any = {
        [field === 'readyTime' ? 'ready_time' : 
         field === 'yeastMold' ? 'yeast_mold' : field]: value,
        modified_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('samples')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSamples(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

      await addChangeHistory({
        action: 'update',
        sampleId: id,
        field,
        oldValue,
        newValue: value
      });

    } catch (error) {
      console.error('Error updating sample:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'échantillon",
        variant: "destructive"
      });
    }
  };

  const toggleConformity = async (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => {
    try {
      const sample = samples.find(s => s.id === id);
      if (!sample) return;

      const oldValue = sample[field];
      const newValue = sample[field] === 'N' ? 'NC' : 'N';

      const { error } = await supabase
        .from('samples')
        .update({ [field]: newValue })
        .eq('id', id);

      if (error) throw error;

      setSamples(prev => prev.map(s => 
        s.id === id ? { ...s, [field]: newValue } : s
      ));

      await addChangeHistory({
        action: 'update',
        sampleId: id,
        field,
        oldValue,
        newValue
      });

    } catch (error) {
      console.error('Error toggling conformity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la conformité",
        variant: "destructive"
      });
    }
  };

  const addChangeHistory = async ({
    sampleId,
    field,
    oldValue,
    newValue,
    action,
  }: {
    sampleId?: number;
    field?: string;
    oldValue?: string;
    newValue?: string;
    action: 'create' | 'update' | 'delete' | 'save' | 'lock_fields' | 'other';
  }) => {
    try {
      const { error } = await supabase
        .from('change_history')
        .insert([{
          sample_id: sampleId,
          field,
          old_value: oldValue,
          new_value: newValue,
          action,
          user_name: 'Unknown',
          role: 'guest'
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding change history:', error);
    }
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
    validateSamples,
    addChangeHistory
  };
};
