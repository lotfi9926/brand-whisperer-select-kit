import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import SampleFormHeader from './sample-form/SampleFormHeader';
import SampleFormInputs from './sample-form/SampleFormInputs';
import SampleFormActions from './sample-form/SampleFormActions';
import SamplesFormTable from './sample-form/SamplesFormTable';
import { Sample } from '@/types/samples';

const SampleForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [site, setSite] = useState('');
  const [sampleDate, setSampleDate] = useState('');
  const [reference, setReference] = useState('');
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async () => {
    if (!site || !sampleDate) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportId = uuidv4();
      
      const { data: formData, error: formError } = await supabase
        .from('sample_forms')
        .insert({
          report_id: reportId,
          site: site,
          sample_date: sampleDate,
          reference: reference,
          created_by: user?.id
        })
        .select('id')
        .single();
        
      if (formError) throw formError;
      
      if (samples.length > 0) {
        const samplesData = samples.map(sample => ({
          report_id: reportId,
          program: sample.program,
          label: sample.label,
          nature: sample.nature,
          lab_comment: sample.labComment,
          additional_details: sample.additionalDetails,
          temperature: sample.temperature,
          analysis_date: sample.analysisDate,
          storage_temp: sample.storageTemp,
          break_date: sample.breakDate
        }));
        
        const { error: samplesError } = await supabase
          .from('form_samples')
          .insert(samplesData);
          
        if (samplesError) throw samplesError;
      }
      
      toast({
        title: "Sauvegardé",
        description: "Les informations ont été sauvegardées avec succès."
      });

      navigate('/sample-entry', { 
        state: { 
          reportId,
          site,
          sampleDate,
          reference
        } 
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement des données.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSample = () => {
    const newSample: Sample = {
      id: samples.length + 1,
      program: '',
      label: '',
      nature: '',
      labComment: '',
      additionalDetails: '',
      temperature: '',
      analysisDate: '',
      storageTemp: '',
      breakDate: '',
    };
    
    setSamples([...samples, newSample]);
    toast({
      title: "Échantillon ajouté",
      description: "Un nouvel échantillon a été ajouté à la liste."
    });
  };

  const handleCopy = () => {
    if (selectedSamples.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un échantillon à copier.",
        variant: "destructive"
      });
      return;
    }
    
    const copiedSamples = samples
      .filter(sample => selectedSamples.includes(sample.id))
      .map(sample => ({
        ...sample,
        id: samples.length + Math.floor(Math.random() * 1000) + 1
      }));
    
    setSamples([...samples, ...copiedSamples]);
    toast({
      title: "Copié",
      description: `${selectedSamples.length} échantillon(s) copié(s).`
    });
  };

  const handleDuplicate = () => {
    if (selectedSamples.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un échantillon à dupliquer.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Numéro dupliqué",
      description: "Le numéro a été dupliqué avec succès."
    });
  };

  const handleDelete = () => {
    if (selectedSamples.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un échantillon à supprimer.",
        variant: "destructive"
      });
      return;
    }
    
    const newSamples = samples.filter(sample => !selectedSamples.includes(sample.id));
    setSamples(newSamples);
    setSelectedSamples([]);
    
    toast({
      title: "Supprimé",
      description: `${selectedSamples.length} échantillon(s) supprimé(s).`
    });
  };

  const toggleSelectSample = (id: number) => {
    if (selectedSamples.includes(id)) {
      setSelectedSamples(selectedSamples.filter(sampleId => sampleId !== id));
    } else {
      setSelectedSamples([...selectedSamples, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedSamples.length === samples.length) {
      setSelectedSamples([]);
    } else {
      setSelectedSamples(samples.map(sample => sample.id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SampleFormHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <SampleFormInputs 
            site={site}
            setSite={setSite}
            sampleDate={sampleDate}
            setSampleDate={setSampleDate}
            reference={reference}
            setReference={setReference}
          />

          <SampleFormActions 
            handleSave={handleSave}
            handleAddSample={handleAddSample}
            handleCopy={handleCopy}
            handleDuplicate={handleDuplicate}
            handleDelete={handleDelete}
            isSubmitting={isSubmitting}
          />

          <div className="overflow-x-auto">
            <SamplesFormTable
              samples={samples}
              selectedSamples={selectedSamples}
              toggleSelectSample={toggleSelectSample}
              toggleSelectAll={toggleSelectAll}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SampleForm;
