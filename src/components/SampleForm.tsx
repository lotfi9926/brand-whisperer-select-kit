
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Plus, Save, Copy, Printer, Trash2 } from 'lucide-react';

const SampleForm = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#0091CA] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Identification des échantillons agro-alimentaires</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Site*</label>
              <Input placeholder="Entrer le site" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date envoi échantillons*</label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Référence commande</label>
              <Input placeholder="Entrer la référence" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="bg-[#0091CA] hover:bg-[#007AA8]">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter échantillon
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Dupliquer le numéro
            </Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Suppr.
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-12">
                    <input type="checkbox" className="form-checkbox" />
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
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" className="form-checkbox" />
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
              </tbody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SampleForm;
