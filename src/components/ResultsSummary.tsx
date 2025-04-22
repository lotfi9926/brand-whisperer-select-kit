
import React from 'react';
import { Brand, calculateOverallRating } from '@/utils/brandData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CheckSquare } from 'lucide-react';

interface ResultsSummaryProps {
  selectedBrands: Brand[];
  onClear: () => void;
  onSave?: () => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ selectedBrands, onClear, onSave }) => {
  if (selectedBrands.length === 0) {
    return null;
  }
  
  // Find the brand with the highest overall rating
  const getBestBrand = () => {
    if (selectedBrands.length === 0) return null;
    
    return selectedBrands.reduce((best, current) => {
      const bestRating = parseFloat(calculateOverallRating(best.rating));
      const currentRating = parseFloat(calculateOverallRating(current.rating));
      return currentRating > bestRating ? current : best;
    }, selectedBrands[0]);
  };

  const bestBrand = getBestBrand();

  return (
    <Card className="w-full mb-6 brand-shadow animate-fade-in">
      <CardHeader className="bg-brand-accent pb-4">
        <CardTitle className="text-xl text-center">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {selectedBrands.length > 1 ? (
          <>
            <div className="text-center">
              <p className="mb-2">Based on overall ratings:</p>
              <div className="inline-block bg-brand-light rounded-lg p-4">
                <div className="font-bold text-lg text-brand-primary mb-1">Recommended Choice</div>
                <div className="flex items-center justify-center gap-3">
                  <img src={bestBrand?.logo} alt={bestBrand?.name} className="h-8" />
                  <span className="text-xl font-semibold">{bestBrand?.name}</span>
                </div>
                <div className="mt-2 text-sm">
                  Overall Score: <span className="font-bold text-brand-primary">{calculateOverallRating(bestBrand?.rating || {})}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-center flex-wrap gap-4">
              <div className="text-center">
                <span className="block text-sm text-muted-foreground mb-1">Total brands compared</span>
                <span className="text-2xl font-bold">{selectedBrands.length}</span>
              </div>
              <div className="h-10 border-r border-muted"></div>
              <div className="text-center">
                <span className="block text-sm text-muted-foreground mb-1">Ratings analyzed</span>
                <span className="text-2xl font-bold">{selectedBrands.length * 5}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">Select at least one more brand to see comparison results.</p>
        )}
        
        <div className="flex justify-center pt-2 gap-4">
          <Button variant="outline" onClick={onClear}>Clear Selection</Button>
          {onSave && (
            <Button className="bg-brand-primary hover:bg-brand-dark" onClick={onSave}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Save Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSummary;
