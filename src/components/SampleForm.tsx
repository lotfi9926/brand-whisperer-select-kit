
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Plus, Save, Copy, Printer, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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
      <header className="bg-[#0091CA] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Identification des échantillons agro-alimentaires</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Site*</label>
              <Input 
                placeholder="Entrer le site" 
                value={site} 
                onChange={(e) => setSite(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date envoi échantillons*</label>
              <Input 
                type="date" 
                value={sampleDate} 
                onChange={(e) => setSampleDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Référence commande</label>
              <Input 
                placeholder="Entrer la référence" 
                value={reference} 
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              className="bg-[#0091CA] hover:bg-[#007AA8]"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button 
              variant="outline"
              onClick={handleAddSample}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter échantillon
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
            <Button 
              variant="outline"
              onClick={handleDuplicate}
            >
              <Printer className="w-4 h-4 mr-2" />
              Dupliquer le numéro
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Suppr.
            </Button>
          </div>

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
