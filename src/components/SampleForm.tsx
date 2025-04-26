import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { useToast } from "@/components/ui/use-toast";
import SampleFormHeader from './sample-form/SampleFormHeader';
import SampleFormInputs from './sample-form/SampleFormInputs';
import SampleFormActions from './sample-form/SampleFormActions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Save, Copy, Printer, Trash2 } from 'lucide-react';

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
  const [site, setSite] = useState('');
  const [sampleDate, setSampleDate] = useState('');
  const [reference, setReference] = useState('');
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
  
  const handleSave = () => {
    if (!site || !sampleDate) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Sauvegardé",
      description: "Les informations ont été sauvegardées avec succès.",
      variant: "default"
    });
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
