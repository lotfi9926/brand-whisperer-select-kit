import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentWeek = getCurrentWeekNumber();

  return (
    <Card>
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Notifications - Semaine {currentWeek}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isOpen && (
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-4">Lectures en attente</h3>
          
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
        </CardContent>
      )}
    </Card>
  );
};

export default NotificationPanel;
