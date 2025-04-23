import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data for brands
const brands = [
  { id: '1', name: 'Grand Frais (GF)' },
  { id: '2', name: 'Carrefour' },
  { id: '3', name: 'Leclerc' },
  { id: '4', name: 'Danone' },
  { id: '5', name: 'Yoplait' },
];

interface TechnicalInfoProps {
  selectedSite?: string;
  analysisDate?: Date;
}

const TechnicalInfoPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSite, analysisDate } = (location.state as TechnicalInfoProps) || {};

  const [brand, setBrand] = useState<string>('');
  const [waterPeptone, setWaterPeptone] = useState<string>('');
  const [petriDishes, setPetriDishes] = useState<string>('');
  const [VRBGGel, setVRBGGel] = useState<string>('');
  const [YGCGel, setYGCGel] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('Formulaire contrôle microbiologique – Dessert Grand Frais (GF)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand) {
      toast({
        title: "Champs requis",
        description: "Veuillez sélectionner une marque.",
        variant: "destructive"
      });
      return;
    }

    navigate('/sample-entry', {
      state: {
        ...location.state,
        brand,
        batchNumbers: {
          waterPeptone,
          petriDishes,
          VRBGGel,
          YGCGel
        },
        reportTitle
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#0091CA] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Contrôle Qualité Microbiologique</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-medium">Informations Techniques</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marque du produit laitier</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waterPeptone">Numéro de lot - Eau péptonée</Label>
                  <Input 
                    id="waterPeptone" 
                    value={waterPeptone} 
                    onChange={(e) => setWaterPeptone(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="petriDishes">Numéro de lot - Boîtes de Petri</Label>
                  <Input 
                    id="petriDishes" 
                    value={petriDishes} 
                    onChange={(e) => setPetriDishes(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="VRBGGel">Numéro de lot - Gélose VRBG</Label>
                  <Input 
                    id="VRBGGel" 
                    value={VRBGGel} 
                    onChange={(e) => setVRBGGel(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="YGCGel">Numéro de lot - Gélose YGC</Label>
                  <Input 
                    id="YGCGel" 
                    value={YGCGel} 
                    onChange={(e) => setYGCGel(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Titre du rapport</Label>
                <Input 
                  id="reportTitle" 
                  value={reportTitle} 
                  onChange={(e) => setReportTitle(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Retour
              </Button>
              
              <Button 
                type="submit" 
                className="bg-[#0091CA] hover:bg-[#007AA8]"
              >
                <Check className="w-4 h-4 mr-2" />
                Valider
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TechnicalInfoPage;
