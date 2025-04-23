
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SampleActionButtonsProps {
  onSave: () => void;
  onAdd: () => void;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onExportPdf?: () => void;
}

const SampleActionButtons = ({ 
  onSave, 
  onAdd, 
  showBackButton = true,
  showAddButton = true,
  onExportPdf
}: SampleActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      {showBackButton && (
        <Button 
          variant="outline"
          onClick={() => navigate('/technical-info')}
        >
          Retour
        </Button>
      )}
      <Button
        className="bg-[#0091CA] hover:bg-[#007AA8]"
        onClick={onSave}
      >
        <Check className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
      {showAddButton && (
        <Button
          variant="outline"
          onClick={onAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un échantillon
        </Button>
      )}
      {onExportPdf && (
        <Button
          variant="outline"
          onClick={onExportPdf}
          className="border-[#0091CA] text-[#0091CA] hover:bg-blue-50"
        >
          <FileText className="w-4 h-4 mr-2" />
          Exporter PDF
        </Button>
      )}
    </div>
  );
};

export default SampleActionButtons;
