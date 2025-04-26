import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import SampleFormHeader from './sample-form/SampleFormHeader';
import SampleFormInputs from './sample-form/SampleFormInputs';
import SampleFormActions from './sample-form/SampleFormActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Sample {
  id: number;
  program: string;
  label: string;
  nature: string;
  labComment: string;
  additionalDetails: string;
  temperature: string;
  analysisDate: string;
  storageTemp: string;
  breakDate: string;
}

const SampleForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
            <Table>
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-12">
                    <input 
                      type="checkbox" 
                      className="form-checkbox"
                      checked={selectedSamples.length === samples.length && samples.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Programme*</th>
                  <th>Numéro d'étiquette*</th>
                  <th>Nature de l'échantillon*</th>
                  <th>Commentaire laboratoire</th>
                  <th>Précisions complémentaires</th>
                  <th>T(°C) produit</th>
                  <th>Date prévue de mise en analyse</th>
                  <th>T(°C) de conservation échantillon avant analyse</th>
                  <th>Date de rupture</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {samples.length > 0 ? (
                  samples.map(sample => (
                    <tr key={sample.id}>
                      <td>
                        <input 
                          type="checkbox" 
                          className="form-checkbox" 
                          checked={selectedSamples.includes(sample.id)}
                          onChange={() => toggleSelectSample(sample.id)}
                        />
                      </td>
                      <td>{sample.program || '-'}</td>
                      <td>{sample.label || '-'}</td>
                      <td>{sample.nature || '-'}</td>
                      <td>{sample.labComment || '-'}</td>
                      <td>{sample.additionalDetails || '-'}</td>
                      <td>{sample.temperature || '-'}</td>
                      <td>{sample.analysisDate || '-'}</td>
                      <td>{sample.storageTemp || '-'}</td>
                      <td>{sample.breakDate || '-'}</td>
                      <td>-</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <input type="checkbox" className="form-checkbox" disabled />
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SampleForm;
