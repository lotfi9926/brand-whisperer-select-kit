
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import NotificationPanel from '@/components/NotificationPanel';

const sites = [
  { id: 'R1', name: 'Laiterie Collet (R1)' },
  { id: 'R2', name: 'Végétal Santé (R2)' },
  { id: 'BAIKO', name: 'Laiterie Baiko' },
];

const QualityControlPage = () => {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite || !date) {
      return;
    }
    navigate('/technical-info', { 
      state: { 
        selectedSite,
        analysisDate: date 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#0091CA] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">MAISON COLLET</h1>
          <h2 className="text-xl">Contrôle Qualité Microbiologique</h2>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Sélection du Site et Date</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <RadioGroup 
                    id="site" 
                    value={selectedSite} 
                    onValueChange={setSelectedSite}
                    className="space-y-2"
                  >
                    {sites.map((site) => (
                      <div key={site.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={site.id} id={`site-${site.id}`} />
                        <Label htmlFor={`site-${site.id}`} className="cursor-pointer">{site.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date d'analyse</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!selectedSite || !date}
                className="bg-[#0091CA] hover:bg-[#007AA8] w-full sm:w-auto"
              >
                <Check className="w-4 h-4 mr-2" />
                Valider
              </Button>
            </form>
          </div>

          <div>
            <NotificationPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QualityControlPage;
