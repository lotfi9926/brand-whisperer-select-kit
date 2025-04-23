import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const pendingReadings = [
  { id: 1, day: 'Lundi', test: 'Entérobactéries (24h)', count: 3 },
  { id: 2, day: 'Mardi', test: 'Levures/Moisissures (5 jours)', count: 2 },
  { id: 3, day: 'Mercredi', test: 'Entérobactéries (24h)', count: 1 },
  { id: 4, day: 'Jeudi', test: 'Levures/Moisissures (5 jours)', count: 4 },
  { id: 5, day: 'Vendredi', test: 'Entérobactéries (24h)', count: 2 },
  { id: 6, day: 'Samedi', test: 'Entérobactéries (24h)', count: 0 },
  { id: 7, day: 'Dimanche', test: 'Levures/Moisissures (5 jours)', count: 0 },
];

const getCurrentWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  return Math.floor(diff / oneWeek) + 1;
};

interface SavedAnalysis {
  reportTitle: string;
  samples: any[];
  date: string;
}

const NotificationPanel = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const currentWeek = getCurrentWeekNumber();
  const [savedAnalysis, setSavedAnalysis] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedAnalysis');
    if (saved) {
      setSavedAnalysis(JSON.parse(saved));
    }
  }, []);

  const handleContinueAnalysis = () => {
    if (savedAnalysis) {
      navigate('/sample-entry', { 
        state: { 
          reportTitle: savedAnalysis.reportTitle,
          samples: savedAnalysis.samples 
        } 
      });
    }
  };

  return (
    <Card>
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Notifications & Analyses en cours</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isOpen && (
        <CardContent className="p-4">
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Lectures en attente</TabsTrigger>
              <TabsTrigger value="ongoing">Analyses en cours</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Échantillons</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReadings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell>{reading.day}</TableCell>
                      <TableCell>{reading.test}</TableCell>
                      <TableCell>
                        <span className="font-medium">{reading.count}</span> échantillons en attente
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="ongoing">
              {savedAnalysis ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-lg mb-2">{savedAnalysis.reportTitle}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Dernière modification: {new Date(savedAnalysis.date).toLocaleDateString()}
                    </p>
                    <Button onClick={handleContinueAnalysis}>
                      Continuer l'analyse
                    </Button>
                  </div>
                </div>
              ) : (
                <p>Aucune analyse en cours</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default NotificationPanel;
