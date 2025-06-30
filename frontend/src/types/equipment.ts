// Types pour les équipements
export interface Site {
  id: number;
  name: string;
  location?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionLine {
  id: number;
  site_id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type EquipmentStatus = 'active' | 'inactive' | 'maintenance' | 'broken';
export type EquipmentCriticality = 'low' | 'medium' | 'high' | 'critical';

export interface Equipment {
  id: number;
  name: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  purchase_date?: string;
  installation_date?: string;
  warranty_expiry?: string;
  expected_lifespan?: number;
  site_id?: number;
  production_line_id?: number;
  status: EquipmentStatus;
  criticality: EquipmentCriticality;
  specifications?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status_display?: string;
  criticality_display?: string;
}

export interface EquipmentWithRelations extends Equipment {
  site_name?: string;
  production_line_name?: string;
}

export interface EquipmentFilter {
  site_id?: number;
  production_line_id?: number;
  status?: EquipmentStatus;
  criticality?: EquipmentCriticality;
  search?: string;
}

export interface EquipmentCreate {
  name: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  purchase_date?: string;
  installation_date?: string;
  warranty_expiry?: string;
  expected_lifespan?: number;
  site_id?: number;
  production_line_id?: number;
  status?: EquipmentStatus;
  criticality?: EquipmentCriticality;
  specifications?: Record<string, any>;
}

export interface EquipmentUpdate {
  name?: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  purchase_date?: string;
  installation_date?: string;
  warranty_expiry?: string;
  expected_lifespan?: number;
  site_id?: number;
  production_line_id?: number;
  status?: EquipmentStatus;
  criticality?: EquipmentCriticality;
  specifications?: Record<string, any>;
}

export interface EquipmentStats {
  total: number;
  by_status: {
    active: number;
    maintenance: number;
    broken: number;
    inactive: number;
  };
  by_criticality: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Constantes pour les options
export const EQUIPMENT_STATUS_OPTIONS = [
  { value: 'active', label: 'Actif', color: 'green' },
  { value: 'inactive', label: 'Inactif', color: 'gray' },
  { value: 'maintenance', label: 'En maintenance', color: 'orange' },
  { value: 'broken', label: 'En panne', color: 'red' }
] as const;

export const EQUIPMENT_CRITICALITY_OPTIONS = [
  { value: 'low', label: 'Faible', color: 'green' },
  { value: 'medium', label: 'Moyenne', color: 'yellow' },
  { value: 'high', label: 'Élevée', color: 'orange' },
  { value: 'critical', label: 'Critique', color: 'red' }
] as const;
