
import React, { useState } from 'react';
import { Brand, brandData } from '@/utils/brandData';
import BrandSelection from '@/components/BrandSelection';
import ComparisonTool from '@/components/ComparisonTool';
import ResultsSummary from '@/components/ResultsSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const { toast } = useToast();
  
  const handleCompare = (brand: Brand) => {
    if (selectedBrands.some(selected => selected.id === brand.id)) {
      // Brand is already selected, remove it
      setSelectedBrands(selectedBrands.filter(selected => selected.id !== brand.id));
    } else {
      // Brand is not selected, add it if fewer than 3 brands are selected
      if (selectedBrands.length < 3) {
        setSelectedBrands([...selectedBrands, brand]);
      } else {
        toast({
          title: "Maximum Selection Reached",
          description: "You can only compare up to 3 brands at a time.",
          variant: "default",
        });
      }
    }
  };

  const handleRemove = (brandId: string) => {
    setSelectedBrands(selectedBrands.filter(brand => brand.id !== brandId));
  };

  const handleClearSelection = () => {
    setSelectedBrands([]);
  };

  const handleSaveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your brand comparison has been saved successfully.",
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-brand-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Brand Whisperer</h1>
          <p className="mt-2 text-center max-w-2xl mx-auto">
            Find and compare the perfect brands that align with your values and needs
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedBrands.length > 0 && (
          <ResultsSummary 
            selectedBrands={selectedBrands} 
            onClear={handleClearSelection}
            onSave={handleSaveResults} 
          />
        )}

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="select">Select Brands</TabsTrigger>
            <TabsTrigger value="compare" disabled={selectedBrands.length < 1}>
              Compare {selectedBrands.length > 0 && `(${selectedBrands.length})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="select" className="animate-fade-in">
            <BrandSelection 
              brands={brandData} 
              onCompare={handleCompare}
              selectedBrands={selectedBrands}
            />
          </TabsContent>
          <TabsContent value="compare">
            <ComparisonTool 
              selectedBrands={selectedBrands} 
              onRemove={handleRemove} 
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-brand-dark text-white py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Brand Whisperer Select Kit. All rights reserved.</p>
          <p className="text-sm mt-2 text-gray-300">
            A powerful tool to help you make informed brand decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
