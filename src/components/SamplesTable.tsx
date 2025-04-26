
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import SampleTableRow from './SampleTableRow';
import { UserRole } from '@/contexts/AuthContext';
import { Sample } from '@/types/samples';

interface SamplesTableProps {
  samples: Sample[];
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: string, field: keyof Sample, value: string) => void;
  toggleConformity: (id: string, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
  isLocked?: boolean;
  userRole: UserRole | 'guest';
}

const SamplesTable: React.FC<SamplesTableProps> = ({
  samples,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  toggleConformity,
  isLocked = false,
  userRole
}) => {
  const isCoordinator = userRole === 'coordinator';
  const isTechnician = userRole === 'technician';

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#0091CA] text-white">
            {/* Coordinator fields */}
            <TableHead className="text-white min-w-[80px] bg-blue-100 text-blue-800 border-r border-white">N° Échantillon</TableHead>
            <TableHead className="text-white min-w-[200px] bg-blue-100 text-blue-800 border-r border-white">Produit</TableHead>
            <TableHead className="text-white min-w-[120px] bg-blue-100 text-blue-800 border-r border-white">Heure de prêt</TableHead>
            <TableHead className="text-white min-w-[150px] bg-blue-100 text-blue-800 border-r border-white">Fabrication</TableHead>
            <TableHead className="text-white min-w-[150px] bg-blue-100 text-blue-800 border-r border-white">DLC</TableHead>
            
            {/* Technician fields */}
            <TableHead className="text-white min-w-[120px] bg-green-100 text-green-800">Odeur (N/NC)</TableHead>
            <TableHead className="text-white min-w-[120px] bg-green-100 text-green-800">Texture (N/NC)</TableHead>
            <TableHead className="text-white min-w-[120px] bg-green-100 text-green-800">Goût (N/NC)</TableHead>
            <TableHead className="text-white min-w-[120px] bg-green-100 text-green-800">Aspect (N/NC)</TableHead>
            <TableHead className="text-white min-w-[80px] bg-green-100 text-green-800">pH</TableHead>
            <TableHead className="text-white min-w-[150px] bg-green-100 text-green-800">Entérobactéries</TableHead>
            <TableHead className="text-white min-w-[150px] bg-green-100 text-green-800">Levures/Moisissures</TableHead>
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
                isLocked={isLocked}
                userRole={userRole}
              />
            ))
          ) : (
            <TableRow>
              <TableHead colSpan={12} className="text-center py-4">
                Aucun échantillon. {isCoordinator && !isLocked ? "Cliquez sur \"Ajouter un échantillon\" pour commencer." : ""}
              </TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SamplesTable;
