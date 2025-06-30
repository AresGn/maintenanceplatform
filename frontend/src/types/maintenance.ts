// Types pour le module de maintenance
import { Equipment } from './equipment';

// Types de base pour les maintenances
export type MaintenanceType = 'preventive' | 'corrective' | 'predictive' | 'emergency';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type InterventionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'validated' | 'rejected';

// Interface pour une tâche de maintenance
export interface MaintenanceTask {
  id: number;
  name: string;
  description?: string;
  estimated_duration: number; // en minutes
  required_skills?: string[];
  tools_required?: string[];
  safety_requirements?: string[];
  order: number;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour un plan de maintenance
export interface MaintenancePlan {
  id: number;
  name: string;
  description?: string;
  equipment_id: number;
  maintenance_type: MaintenanceType;
  frequency_days: number; // fréquence en jours
  estimated_duration: number; // durée estimée en minutes
  priority: MaintenancePriority;
  tasks: MaintenanceTask[];
  is_active: boolean;
  next_due_date?: string;
  created_at: string;
  updated_at: string;
}

// Interface pour une maintenance planifiée
export interface ScheduledMaintenance {
  id: number;
  maintenance_plan_id: number;
  equipment_id: number;
  scheduled_date: string;
  estimated_start_time: string;
  estimated_end_time: string;
  assigned_technician_id?: number;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  maintenance_plan?: MaintenancePlan;
  equipment?: Equipment;
  assigned_technician?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Interface pour une intervention (maintenance réalisée)
export interface MaintenanceIntervention {
  id: number;
  scheduled_maintenance_id?: number;
  equipment_id: number;
  technician_id: number;
  maintenance_type: MaintenanceType;
  status: InterventionStatus;
  priority: MaintenancePriority;
  
  // Dates et durées
  scheduled_date?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  downtime_start?: string;
  downtime_end?: string;
  
  // Détails de l'intervention
  description: string;
  work_performed?: string;
  issues_found?: string;
  recommendations?: string;
  
  // Validation
  validated_by?: number;
  validated_at?: string;
  validation_notes?: string;
  
  // Coûts et pièces
  labor_cost?: number;
  parts_cost?: number;
  total_cost?: number;
  parts_used?: MaintenancePartUsed[];
  
  created_at: string;
  updated_at: string;
  
  // Relations
  equipment?: Equipment;
  technician?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  validator?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Interface pour les pièces utilisées dans une intervention
export interface MaintenancePartUsed {
  id: number;
  intervention_id: number;
  part_id: number;
  quantity_used: number;
  unit_cost?: number;
  total_cost?: number;
  
  // Relation avec la pièce
  part?: {
    id: number;
    name: string;
    reference: string;
    unit_price?: number;
  };
}

// Interface pour les tâches d'intervention
export interface InterventionTask {
  id: number;
  intervention_id: number;
  maintenance_task_id?: number;
  name: string;
  description?: string;
  is_completed: boolean;
  completion_notes?: string;
  completed_at?: string;
  order: number;
}

// Interfaces pour les formulaires
export interface MaintenancePlanCreate {
  name: string;
  description?: string;
  equipment_id: number;
  maintenance_type: MaintenanceType;
  frequency_days: number;
  estimated_duration: number;
  priority: MaintenancePriority;
  tasks: Omit<MaintenanceTask, 'id' | 'created_at' | 'updated_at'>[];
}

export interface MaintenancePlanUpdate {
  name?: string;
  description?: string;
  maintenance_type?: MaintenanceType;
  frequency_days?: number;
  estimated_duration?: number;
  priority?: MaintenancePriority;
  is_active?: boolean;
}

export interface ScheduledMaintenanceCreate {
  maintenance_plan_id: number;
  equipment_id: number;
  scheduled_date: string;
  estimated_start_time: string;
  estimated_end_time: string;
  assigned_technician_id?: number;
  priority?: MaintenancePriority;
  notes?: string;
}

export interface ScheduledMaintenanceUpdate {
  scheduled_date?: string;
  estimated_start_time?: string;
  estimated_end_time?: string;
  assigned_technician_id?: number;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  notes?: string;
}

export interface MaintenanceInterventionCreate {
  scheduled_maintenance_id?: number;
  equipment_id: number;
  maintenance_type: MaintenanceType;
  priority: MaintenancePriority;
  description: string;
  scheduled_date?: string;
}

export interface MaintenanceInterventionUpdate {
  status?: InterventionStatus;
  actual_start_time?: string;
  actual_end_time?: string;
  downtime_start?: string;
  downtime_end?: string;
  work_performed?: string;
  issues_found?: string;
  recommendations?: string;
  labor_cost?: number;
  parts_cost?: number;
  validation_notes?: string;
}

// Interfaces pour les filtres
export interface MaintenanceFilter {
  equipment_id?: number;
  technician_id?: number;
  maintenance_type?: MaintenanceType;
  status?: MaintenanceStatus | InterventionStatus;
  priority?: MaintenancePriority;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Interface pour les statistiques de maintenance
export interface MaintenanceStats {
  total_scheduled: number;
  completed_this_month: number;
  overdue: number;
  in_progress: number;
  by_type: {
    preventive: number;
    corrective: number;
    predictive: number;
    emergency: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  average_completion_time: number; // en heures
  mttr: number; // Mean Time To Repair en heures
  mtbf: number; // Mean Time Between Failures en heures
}

// Interface pour les événements du calendrier
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: ScheduledMaintenance | MaintenanceIntervention;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    type: 'scheduled' | 'intervention';
    status: MaintenanceStatus | InterventionStatus;
    priority: MaintenancePriority;
    equipment_name: string;
    technician_name?: string;
  };
}

// Constantes pour les options
export const MAINTENANCE_TYPE_OPTIONS = [
  { value: 'preventive', label: 'Préventive', color: 'blue' },
  { value: 'corrective', label: 'Corrective', color: 'orange' },
  { value: 'predictive', label: 'Prédictive', color: 'purple' },
  { value: 'emergency', label: 'Urgence', color: 'red' }
] as const;

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Planifiée', color: 'blue' },
  { value: 'in_progress', label: 'En cours', color: 'orange' },
  { value: 'completed', label: 'Terminée', color: 'green' },
  { value: 'cancelled', label: 'Annulée', color: 'gray' },
  { value: 'overdue', label: 'En retard', color: 'red' }
] as const;

export const INTERVENTION_STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente', color: 'gray' },
  { value: 'assigned', label: 'Assignée', color: 'blue' },
  { value: 'in_progress', label: 'En cours', color: 'orange' },
  { value: 'completed', label: 'Terminée', color: 'green' },
  { value: 'validated', label: 'Validée', color: 'green' },
  { value: 'rejected', label: 'Rejetée', color: 'red' }
] as const;

export const MAINTENANCE_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Faible', color: 'green' },
  { value: 'medium', label: 'Moyenne', color: 'yellow' },
  { value: 'high', label: 'Élevée', color: 'orange' },
  { value: 'critical', label: 'Critique', color: 'red' }
] as const;
