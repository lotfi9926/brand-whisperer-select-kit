
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Copy, Printer, Trash2 } from 'lucide-react';

interface SampleFormActionsProps {
  handleSave: () => void;
  handleAddSample: () => void;
  handleCopy: () => void;
  handleDuplicate: () => void;
  handleDelete: () => void;
  isSubmitting?: boolean;
}

const SampleFormActions = ({
  handleSave,
  handleAddSample,
  handleCopy,
  handleDuplicate,
  handleDelete,
  isSubmitting = false
}: SampleFormActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        className="bg-[#0091CA] hover:bg-[#007AA8]"
        onClick={handleSave}
        disabled={isSubmitting}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
      </Button>
      <Button 
        variant="outline"
        onClick={handleAddSample}
        disabled={isSubmitting}
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter échantillon
      </Button>
      <Button 
        variant="outline"
        onClick={handleCopy}
        disabled={isSubmitting}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copier
      </Button>
      <Button 
        variant="outline"
        onClick={handleDuplicate}
        disabled={isSubmitting}
      >
        <Printer className="w-4 h-4 mr-2" />
        Dupliquer le numéro
      </Button>
      <Button 
        variant="destructive"
        onClick={handleDelete}
        disabled={isSubmitting}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Suppr.
      </Button>
    </div>
  );
};

export default SampleFormActions;
