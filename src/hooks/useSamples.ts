
import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Sample {
  id: string;
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

// Interface pour mapper les données de Supabase
interface SupabaseSample {
  id: string;
  number: string;
  product: string;
  ready_time: string;
  fabrication: string;
  dlc: string;
  smell: string;
  texture: string;
  taste: string;
  aspect: string;
  ph: string | null;
  enterobacteria: string | null;
  yeast_mold: string | null;
  created_at: string;
  modified_at: string;
  modified_by: string | null;
  status: string;
  brand: string | null;
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
          // Transformer les données de Supabase en Sample[]
          const mappedSamples: Sample[] = data.map((sample: SupabaseSample) => ({
            id: sample.id,
            number: sample.number,
            product: sample.product,
            readyTime: sample.ready_time,
            fabrication: sample.fabrication,
            dlc: sample.dlc,
            smell: sample.smell,
            texture: sample.texture,
            taste: sample.taste,
            aspect: sample.aspect,
            ph: sample.ph || '',
            enterobacteria: sample.enterobacteria || '',
            yeastMold: sample.yeast_mold || '',
            createdAt: sample.created_at,
            modifiedAt: sample.modified_at,
            modifiedBy: sample.modified_by || undefined,
            status: sample.status as 'pending' | 'inProgress' | 'completed'
          }));
          
          setSamples(mappedSamples);
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
    const newSampleBase = {
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
      status: 'pending',
      brand: brand
    };

    try {
      const { data, error } = await supabase
        .from('samples')
        .insert([{
          number: newSampleBase.number,
          product: newSampleBase.product,
          ready_time: newSampleBase.readyTime,
          fabrication: newSampleBase.fabrication,
          dlc: newSampleBase.dlc,
          smell: newSampleBase.smell,
          texture: newSampleBase.texture,
          taste: newSampleBase.taste,
          aspect: newSampleBase.aspect,
          ph: newSampleBase.ph,
          enterobacteria: newSampleBase.enterobacteria,
          yeast_mold: newSampleBase.yeastMold,
          brand: newSampleBase.brand
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newSample: Sample = {
          id: data.id,
          number: data.number,
          product: data.product,
          readyTime: data.ready_time,
          fabrication: data.fabrication,
          dlc: data.dlc,
          smell: data.smell,
          texture: data.texture,
          taste: data.taste,
          aspect: data.aspect,
          ph: data.ph || '',
          enterobacteria: data.enterobacteria || '',
          yeastMold: data.yeast_mold || '',
          createdAt: data.created_at,
          modifiedAt: data.modified_at,
          modifiedBy: data.modified_by || undefined,
          status: data.status as 'pending' | 'inProgress' | 'completed'
        };
        
        setSamples(prev => [newSample, ...prev]);
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

  const updateSample = async (id: string, field: keyof Sample, value: string) => {
    try {
      const sample = samples.find(s => s.id === id);
      if (!sample) return;

      const oldValue = sample[field] as string;
      
      // Mapper les noms de champs pour Supabase
      const fieldMap: Record<keyof Sample, string> = {
        readyTime: 'ready_time',
        yeastMold: 'yeast_mold',
        createdAt: 'created_at',
        modifiedAt: 'modified_at',
        modifiedBy: 'modified_by',
        id: 'id',
        number: 'number',
        product: 'product', 
        fabrication: 'fabrication',
        dlc: 'dlc',
        smell: 'smell',
        texture: 'texture',
        taste: 'taste',
        aspect: 'aspect',
        ph: 'ph',
        enterobacteria: 'enterobacteria',
        status: 'status'
      };

      const updateData: any = {
        [fieldMap[field]]: value,
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
        field: field.toString(),
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

  const toggleConformity = async (id: string, field: 'smell' | 'texture' | 'taste' | 'aspect') => {
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
    user,
    role,
  }: {
    sampleId?: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
    action: 'create' | 'update' | 'delete' | 'save' | 'lock_fields' | 'other';
    user?: string;
    role?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('change_history')
        .insert({
          sample_id: sampleId,
          field,
          old_value: oldValue,
          new_value: newValue,
          action,
          user_name: user || 'Unknown',
          role: role || 'guest'
        });

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
