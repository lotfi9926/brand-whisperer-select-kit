
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format } from 'date-fns';

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
  const [samples, setSamples] = useState<Sample[]>([]);
  
  // Load saved samples if they exist
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
        
        // Auto-calculate DLC for Grand Frais (add 60 days to fabrication date)
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#0091CA] text-white">
                  <TableHead className="text-white" style={{ minWidth: "80px" }}>N° Échantillon</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "200px" }}>Produit</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "120px" }}>Heure de prêt</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "150px" }}>Fabrication</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "150px" }}>DLC</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "120px" }}>Odeur (N/NC)</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "120px" }}>Texture (N/NC)</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "120px" }}>Goût (N/NC)</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "120px" }}>Aspect (N/NC)</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "80px" }}>pH</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "150px" }}>Entérobactéries</TableHead>
                  <TableHead className="text-white" style={{ minWidth: "150px" }}>Levures/Moisissures</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.length > 0 ? (
                  samples.map((sample) => (
                    <TableRow key={sample.id}>
                      <TableCell style={{ minWidth: "80px" }}>
                        <Input 
                          value={sample.number} 
                          onChange={(e) => updateSample(sample.id, 'number', e.target.value)} 
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: "200px" }}>
                        {isGrandFrais ? (
                          <Select
                            value={sample.product}
                            onValueChange={(value) => updateSample(sample.id, 'product', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un produit" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {GF_PRODUCTS.map((product) => (
                                <SelectItem key={product} value={product}>
                                  {product}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            value={sample.product} 
                            onChange={(e) => updateSample(sample.id, 'product', e.target.value)} 
                            className="w-full"
                          />
                        )}
                      </TableCell>
                      <TableCell style={{ minWidth: "120px" }}>
                        <Input 
                          type="time"
                          value={sample.readyTime} 
                          onChange={(e) => updateSample(sample.id, 'readyTime', e.target.value)} 
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: "150px" }}>
                        <Input 
                          type="date"
                          value={sample.fabrication} 
                          onChange={(e) => updateSample(sample.id, 'fabrication', e.target.value)} 
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: "150px" }}>
                        <Input 
                          type="date"
                          value={sample.dlc} 
                          onChange={(e) => updateSample(sample.id, 'dlc', e.target.value)} 
                          className="w-full"
                          readOnly={isGrandFrais}
                          className={isGrandFrais ? "w-full bg-gray-100" : "w-full"}
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: "120px" }}>
                        <Button 
                          onClick={() => toggleConformity(sample.id, 'smell')}
                          className={`w-full ${sample.smell === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          {sample.smell === 'N' ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          {sample.smell}
                        </Button>
                      </TableCell>
                      <TableCell style={{ minWidth: "120px" }}>
                        <Button 
                          onClick={() => toggleConformity(sample.id, 'texture')}
                          className={`w-full ${sample.texture === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          {sample.texture === 'N' ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          {sample.texture}
                        </Button>
                      </TableCell>
                      <TableCell style={{ minWidth: "120px" }}>
                        <Button 
                          onClick={() => toggleConformity(sample.id, 'taste')}
                          className={`w-full ${sample.taste === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          {sample.taste === 'N' ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          {sample.taste}
                        </Button>
                      </TableCell>
                      <TableCell style={{ minWidth: "120px" }}>
                        <Button 
                          onClick={() => toggleConformity(sample.id, 'aspect')}
                          className={`w-full ${sample.aspect === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          {sample.aspect === 'N' ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          {sample.aspect}
                        </Button>
                      </TableCell>
                      <TableCell style={{ minWidth: "80px" }}>
                        <Input 
                          value={sample.ph} 
                          onChange={(e) => updateSample(sample.id, 'ph', e.target.value)} 
                          className="w-full"
                          type="number"
                          step="0.01"
                          min="0"
                          max="14"
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: "150px" }}>
                        <Input 
                          value={sample.enterobacteria} 
                          onChange={(e) => updateSample(sample.id, 'enterobacteria', e.target.value)} 
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: "150px" }}>
                        <Input 
                          value={sample.yeastMold} 
                          onChange={(e) => updateSample(sample.id, 'yeastMold', e.target.value)} 
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-4">
                      Aucun échantillon. Cliquez sur "Ajouter un échantillon" pour commencer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
