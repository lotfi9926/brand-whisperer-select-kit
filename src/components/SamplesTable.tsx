
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import SampleTableRow from './SampleTableRow';

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

interface SamplesTableProps {
  samples: Sample[];
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: number, field: keyof Sample, value: string) => void;
  toggleConformity: (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
}

const SamplesTable: React.FC<SamplesTableProps> = ({
  samples,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  toggleConformity
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#0091CA] text-white">
            <TableHead className="text-white min-w-[80px]">N° Échantillon</TableHead>
            <TableHead className="text-white min-w-[200px]">Produit</TableHead>
            <TableHead className="text-white min-w-[120px]">Heure de prêt</TableHead>
            <TableHead className="text-white min-w-[150px]">Fabrication</TableHead>
            <TableHead className="text-white min-w-[150px]">DLC</TableHead>
            <TableHead className="text-white min-w-[120px]">Odeur (N/NC)</TableHead>
            <TableHead className="text-white min-w-[120px]">Texture (N/NC)</TableHead>
            <TableHead className="text-white min-w-[120px]">Goût (N/NC)</TableHead>
            <TableHead className="text-white min-w-[120px]">Aspect (N/NC)</TableHead>
            <TableHead className="text-white min-w-[80px]">pH</TableHead>
            <TableHead className="text-white min-w-[150px]">Entérobactéries</TableHead>
            <TableHead className="text-white min-w-[150px]">Levures/Moisissures</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {samples.length > 0 ? (
            samples.map((sample) => (
              <SampleTableRow
                key={sample.id}
                sample={sample}
                isGrandFrais={isGrandFrais}
                GF_PRODUCTS={GF_PRODUCTS}
                updateSample={updateSample}
                toggleConformity={toggleConformity}
              />
            ))
          ) : (
            <TableRow>
              <TableHead colSpan={12} className="text-center py-4">
                Aucun échantillon. Cliquez sur "Ajouter un échantillon" pour commencer.
              </TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SamplesTable;
