
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sample } from '@/hooks/useSamples';

interface DownloadFormButtonProps {
  samples: Sample[];
  reportTitle: string;
  batchNumbers: {
    waterPeptone: string;
    petriDishes: string;
    VRBGGel: string;
    YGCGel: string;
  };
}

const DownloadFormButton: React.FC<DownloadFormButtonProps> = ({
  samples,
  reportTitle,
  batchNumbers
}) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      // Create the content for the file
      const content = {
        reportTitle,
        samples,
        batchNumbers,
        exportDate: new Date().toISOString()
      };

      // Convert to JSON string
      const fileContent = JSON.stringify(content, null, 2);

      // Create blob and download link
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set file name with date
      const date = new Date().toISOString().split('T')[0];
      link.download = `rapport-echantillons-${date}.json`;
      
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Le rapport a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="border-[#0091CA] text-[#0091CA] hover:bg-blue-50"
      onClick={handleDownload}
    >
      <Download className="w-4 h-4 mr-2" />
      Télécharger le rapport
    </Button>
  );
};

export default DownloadFormButton;
