
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BatchNumbers from '@/components/BatchNumbers';
import SamplesTable from '@/components/SamplesTable';
import { addDays, format } from 'date-fns';

const GF_PRODUCTS = [
  'Crème dessert vanille',
  'Crème dessert chocolat',
  'Crème dessert caramel'
];

interface Sample {
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

const SampleEntryPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { reportTitle, samples: savedSamples, brand } = location.state || { reportTitle: '', samples: [], brand: '' };
  
  const [samples, setSamples] = useState<Sample[]>([]);
  const [waterPeptone, setWaterPeptone] = useState<string>('');
  const [petriDishes, setPetriDishes] = useState<string>('');
  const [VRBGGel, setVRBGGel] = useState<string>('');
  const [YGCGel, setYGCGel] = useState<string>('');
  
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
  
  const handleSave = () => {
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
      return;
    }

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
      <header className="bg-[#0091CA] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">MAISON COLLET</h1>
          <h2 className="text-xl mt-2">{reportTitle}</h2>
        </div>
      </header>

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
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/technical-info', { state: location.state })}
              >
                Retour
              </Button>
              <Button
                className="bg-[#0091CA] hover:bg-[#007AA8]"
                onClick={handleSave}
              >
                <Check className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button
                variant="outline"
                onClick={addSample}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un échantillon
              </Button>
            </div>
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
