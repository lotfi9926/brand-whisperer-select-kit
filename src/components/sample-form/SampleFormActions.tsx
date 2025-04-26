
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Copy, Printer, Trash2 } from 'lucide-react';

interface SampleFormActionsProps {
  handleSave: () => void;
  handleAddSample: () => void;
  handleCopy: () => void;
  handleDuplicate: () => void;
  handleDelete: () => void;
}

const SampleFormActions = ({
  handleSave,
  handleAddSample,
  handleCopy,
  handleDuplicate,
  handleDelete
}: SampleFormActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        className="bg-[#0091CA] hover:bg-[#007AA8]"
        onClick={handleSave}
      >
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
      <Button 
        variant="outline"
        onClick={handleAddSample}
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter échantillon
      </Button>
      <Button 
        variant="outline"
        onClick={handleCopy}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copier
      </Button>
      <Button 
        variant="outline"
        onClick={handleDuplicate}
      >
        <Printer className="w-4 h-4 mr-2" />
        Dupliquer le numéro
      </Button>
      <Button 
        variant="destructive"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Suppr.
      </Button>
    </div>
  );
};

export default SampleFormActions;
