
export interface Sample {
  id: string;
  number: string;
  product: string;
  readyTime: string;
  fabrication: string;
  dlc: string;
  smell: string;
  texture: string;
  taste: string;
  aspect: string;
  ph: string;
  enterobacteria: string;
  yeastMold: string;
  createdAt: string;
  modifiedAt: string;
  modifiedBy?: string;
  status: 'pending' | 'inProgress' | 'completed';
  assignedTo?: string;
  reportTitle?: string;
  brand?: string;
}

export interface SupabaseSample {
  id: string;
  number: string;
  product: string;
  ready_time: string;
  fabrication: string;
  dlc: string;
  smell: string;
  texture: string;
  taste: string;
  aspect: string;
  ph: string | null;
  enterobacteria: string | null;
  yeast_mold: string | null;
  created_at: string;
  modified_at: string;
  modified_by: string | null;
  status: string;
  assigned_to: string | null;
  report_title: string | null;
  brand: string | null;
}

export interface BatchNumbers {
  id: string;
  reportId: string;
  waterPeptone?: string;
  petriDishes?: string;
  VRBGGel?: string;
  YGCGel?: string;
  createdAt: string;
}
