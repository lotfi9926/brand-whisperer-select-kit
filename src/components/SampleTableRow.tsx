
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { UserRole } from '@/contexts/AuthContext';
import { Sample } from '@/hooks/useSamples';
import { useSampleAlertStatus } from '@/hooks/useSampleAlertStatus';
import { CoordinatorFields } from './sample-table/CoordinatorFields';
import { TechnicianFields } from './sample-table/TechnicianFields';

interface SampleTableRowProps {
  sample: Sample;
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: number, field: keyof Sample, value: string) => void;
  toggleConformity: (id: number, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
  isLocked: boolean;
  userRole: UserRole | 'guest';
}

const SampleTableRow: React.FC<SampleTableRowProps> = ({
  sample,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  toggleConformity,
  isLocked,
  userRole
}) => {
  const isCoordinator = userRole === 'coordinator';
  const isTechnician = userRole === 'technician';
  const alertStatus = useSampleAlertStatus(sample.createdAt);
  const rowClassName = alertStatus === 'urgent' ? 'bg-red-50' : 
                      alertStatus === 'warning' ? 'bg-yellow-50' : '';

  return (
    <TableRow className={rowClassName}>
      <CoordinatorFields
        sample={sample}
        isGrandFrais={isGrandFrais}
        GF_PRODUCTS={GF_PRODUCTS}
        updateSample={updateSample}
        isCoordinator={isCoordinator}
        isLocked={isLocked}
      />
      <TechnicianFields
        sample={sample}
        toggleConformity={toggleConformity}
        updateSample={updateSample}
        isTechnician={isTechnician}
        alertStatus={alertStatus}
      />
    </TableRow>
  );
};

export default SampleTableRow;
