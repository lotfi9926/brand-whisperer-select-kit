
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const { reportTitle, samples: savedSamples, brand } = location.state || { reportTitle: '', samples: [], brand: '' };
  
  const [waterPeptone, setWaterPeptone] = useState<string>('');
  const [petriDishes, setPetriDishes] = useState<string>('');
  const [VRBGGel, setVRBGGel] = useState<string>('');
  const [YGCGel, setYGCGel] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Load batch numbers from localStorage if available
  useEffect(() => {
    const storedAnalysis = localStorage.getItem('savedAnalysis');
    if (storedAnalysis) {
      const { batchNumbers } = JSON.parse(storedAnalysis);
      if (batchNumbers) {
        setWaterPeptone(batchNumbers.waterPeptone || '');
        setPetriDishes(batchNumbers.petriDishes || '');
        setVRBGGel(batchNumbers.VRBGGel || '');
        setYGCGel(batchNumbers.YGCGel || '');
      }
    }
  }, []);

  const { samples, addSample, updateSample, toggleConformity, validateSamples, addChangeHistory } = useSamples({
    savedSamples,
    brand
  });

  const handleSave = () => {
    if (!validateSamples()) return;

    const currentDate = new Date().toISOString();
    
    // Create change history entry
    addChangeHistory({
      action: 'save',
      user: user?.name || 'Unknown',
      role: user?.role || 'guest',
      timestamp: currentDate
    });

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
      date: currentDate,
      lockedByCoordinator: isLocked,
      lastModified: {
        user: user?.name || 'Unknown',
        role: user?.role || 'guest',
        timestamp: currentDate
      }
    }));

    toast({
      title: "Analyse sauvegardée",
      description: `${samples.length} échantillons enregistrés avec succès.`,
    });
  };

  const handleLockCoordinatorFields = () => {
    if (user?.role !== 'coordinator') {
      toast({
        title: "Action non autorisée",
        description: "Seul un coordinateur peut verrouiller les champs.",
        variant: "destructive"
      });
      return;
    }

    setIsLocked(true);
    
    addChangeHistory({
      action: 'lock_fields',
      user: user?.name || 'Unknown',
      role: user?.role || 'guest',
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Champs verrouillés",
      description: "Les champs coordinateur ont été verrouillés avec succès.",
    });

    // Update localStorage
    const storedAnalysis = localStorage.getItem('savedAnalysis');
    if (storedAnalysis) {
      const analysisData = JSON.parse(storedAnalysis);
      analysisData.lockedByCoordinator = true;
      localStorage.setItem('savedAnalysis', JSON.stringify(analysisData));
    }
  };

  // Check if fields are already locked in localStorage
  useEffect(() => {
    const storedAnalysis = localStorage.getItem('savedAnalysis');
    if (storedAnalysis) {
      const { lockedByCoordinator } = JSON.parse(storedAnalysis);
      if (lockedByCoordinator) setIsLocked(true);
    }
  }, []);

  const isGrandFrais = brand === '1';
  const isCoordinator = user?.role === 'coordinator';
  const isTechnician = user?.role === 'technician';

  return (
    <div className="min-h-screen bg-background">
      <SamplePageHeader title={reportTitle} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Saisie des Échantillons</h2>
            <div className="flex items-center gap-2">
              {isCoordinator && !isLocked && (
                <Button 
                  variant="outline"
                  className="border-amber-500 text-amber-500 hover:bg-amber-50"
                  onClick={handleLockCoordinatorFields}
                >
                  Verrouiller les champs coordinateur
                </Button>
              )}
              <SampleActionButtons 
                onSave={handleSave}
                onAdd={addSample}
                showAddButton={isCoordinator && !isLocked}
              />
            </div>
          </div>

          <SamplesTable
            samples={samples}
            isGrandFrais={isGrandFrais}
            GF_PRODUCTS={GF_PRODUCTS}
            updateSample={updateSample}
            toggleConformity={toggleConformity}
            isLocked={isLocked}
            userRole={user?.role || 'guest'}
          />

          {samples.length > 0 && isCoordinator && !isLocked && (
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
        </div>
      </main>
    </div>
  );
};

export default SampleEntryPage;
