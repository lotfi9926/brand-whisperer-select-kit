
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SampleActionButtonsProps {
  onSave: () => void;
  onAdd: () => void;
  showBackButton?: boolean;
}

const SampleActionButtons = ({ onSave, onAdd, showBackButton = true }: SampleActionButtonsProps) => {
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
      <Button
        variant="outline"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un échantillon
      </Button>
    </div>
  );
};

export default SampleActionButtons;
