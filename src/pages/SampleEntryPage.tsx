
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BatchNumbers from '@/components/BatchNumbers';
import SamplesTable from '@/components/SamplesTable';
import SamplePageHeader from '@/components/SamplePageHeader';
import SampleActionButtons from '@/components/SampleActionButtons';
import { useSamples } from '@/hooks/useSamples';

const GF_PRODUCTS = [
  'Crème dessert vanille',
  'Crème dessert chocolat',
  'Crème dessert caramel'
];

const SampleEntryPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { reportTitle, samples: savedSamples, brand } = location.state || { reportTitle: '', samples: [], brand: '' };
  
  const [waterPeptone, setWaterPeptone] = useState<string>('');
  const [petriDishes, setPetriDishes] = useState<string>('');
  const [VRBGGel, setVRBGGel] = useState<string>('');
  const [YGCGel, setYGCGel] = useState<string>('');

  const { samples, addSample, updateSample, toggleConformity, validateSamples } = useSamples({
    savedSamples,
    brand
  });

  const handleSave = () => {
    if (!validateSamples()) return;

    localStorage.setItem('savedAnalysis', JSON.stringify({
      samples,
      reportTitle,
      brand,
      batchNumbers: {
        waterPeptone,
        petriDishes,
        VRBGGel,
        YGCGel
      },
      date: new Date().toISOString()
    }));

    toast({
      title: "Analyse sauvegardée",
      description: `${samples.length} échantillons enregistrés avec succès.`,
    });
    navigate('/');
  };

  const isGrandFrais = brand === '1';

  return (
    <div className="min-h-screen bg-background">
      <SamplePageHeader title={reportTitle} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <BatchNumbers 
            waterPeptone={waterPeptone}
            setWaterPeptone={setWaterPeptone}
            petriDishes={petriDishes}
            setPetriDishes={setPetriDishes}
            VRBGGel={VRBGGel}
            setVRBGGel={setVRBGGel}
            YGCGel={YGCGel}
            setYGCGel={setYGCGel}
          />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Saisie des Échantillons</h2>
            <SampleActionButtons 
              onSave={handleSave}
              onAdd={addSample}
            />
          </div>

          <SamplesTable
            samples={samples}
            isGrandFrais={isGrandFrais}
            GF_PRODUCTS={GF_PRODUCTS}
            updateSample={updateSample}
            toggleConformity={toggleConformity}
          />

          {samples.length > 0 && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={addSample}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un échantillon
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SampleEntryPage;
