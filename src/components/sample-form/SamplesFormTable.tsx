
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { Sample } from '@/types/samples';

interface SamplesFormTableProps {
  samples: Sample[];
  selectedSamples: number[];
  toggleSelectSample: (id: number) => void;
  toggleSelectAll: () => void;
}

const SamplesFormTable = ({ 
  samples,
  selectedSamples,
  toggleSelectSample,
  toggleSelectAll 
}: SamplesFormTableProps) => {
  return (
    <Table>
      <TableHeader>
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
      </TableHeader>
      <TableBody>
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
      </TableBody>
    </Table>
  );
};

export default SamplesFormTable;
