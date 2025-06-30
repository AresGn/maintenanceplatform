// Service pour la gestion des maintenances
import { apiService } from './api';
import { 
  MaintenancePlan,
  MaintenancePlanCreate,
  MaintenancePlanUpdate,
  ScheduledMaintenance,
  ScheduledMaintenanceCreate,
  ScheduledMaintenanceUpdate,
  MaintenanceIntervention,
  MaintenanceInterventionCreate,
  MaintenanceInterventionUpdate,
  MaintenanceFilter,
  MaintenanceStats,
  CalendarEvent,
  MaintenanceTask
} from '../types/maintenance';

class MaintenanceService {
  // ===== PLANS DE MAINTENANCE =====
  
  async getMaintenancePlans(filters?: { equipment_id?: number; is_active?: boolean; skip?: number; limit?: number }) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 0) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiService.get(`/api/v1/maintenance/plans?${params.toString()}`);
    return response as MaintenancePlan[];
  }

  async getMaintenancePlan(id: number) {
    const response = await apiService.get(`/api/v1/maintenance/plans/${id}`);
    return response as MaintenancePlan;
  }

  async createMaintenancePlan(data: MaintenancePlanCreate) {
    const response = await apiService.post('/api/v1/maintenance/plans', data);
    return response as MaintenancePlan;
  }

  async updateMaintenancePlan(id: number, data: MaintenancePlanUpdate) {
    const response = await apiService.put(`/api/v1/maintenance/plans/${id}`, data);
    return response as MaintenancePlan;
  }

  async deleteMaintenancePlan(id: number) {
    await apiService.delete(`/api/v1/maintenance/plans/${id}`);
  }

  async activateMaintenancePlan(id: number) {
    const response = await apiService.post(`/api/v1/maintenance/plans/${id}/activate`);
    return response as MaintenancePlan;
  }

  async deactivateMaintenancePlan(id: number) {
    const response = await apiService.post(`/api/v1/maintenance/plans/${id}/deactivate`);
    return response as MaintenancePlan;
  }

  // ===== MAINTENANCES PLANIFIÉES =====
  
  async getScheduledMaintenances(filters?: MaintenanceFilter & { skip?: number; limit?: number }) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiService.get(`/api/v1/maintenance/scheduled?${params.toString()}`);
    return response as ScheduledMaintenance[];
  }

  async getScheduledMaintenance(id: number) {
    const response = await apiService.get(`/api/v1/maintenance/scheduled/${id}`);
    return response as ScheduledMaintenance;
  }

  async createScheduledMaintenance(data: ScheduledMaintenanceCreate) {
    const response = await apiService.post('/api/v1/maintenance/scheduled', data);
    return response as ScheduledMaintenance;
  }

  async updateScheduledMaintenance(id: number, data: ScheduledMaintenanceUpdate) {
    const response = await apiService.put(`/api/v1/maintenance/scheduled/${id}`, data);
    return response as ScheduledMaintenance;
  }

  async deleteScheduledMaintenance(id: number) {
    await apiService.delete(`/api/v1/maintenance/scheduled/${id}`);
  }

  async rescheduleMaintenances(maintenanceIds: number[], newDate: string) {
    const response = await apiService.post('/api/v1/maintenance/scheduled/reschedule', {
      maintenance_ids: maintenanceIds,
      new_date: newDate
    });
    return response as ScheduledMaintenance[];
  }

  async assignTechnician(maintenanceId: number, technicianId: number) {
    const response = await apiService.post(`/api/v1/maintenance/scheduled/${maintenanceId}/assign`, {
      technician_id: technicianId
    });
    return response as ScheduledMaintenance;
  }

  // ===== INTERVENTIONS =====
  
  async getInterventions(filters?: MaintenanceFilter & { skip?: number; limit?: number }) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiService.get(`/api/v1/maintenance/interventions?${params.toString()}`);
    return response as MaintenanceIntervention[];
  }

  async getIntervention(id: number) {
    const response = await apiService.get(`/api/v1/maintenance/interventions/${id}`);
    return response as MaintenanceIntervention;
  }

  async createIntervention(data: MaintenanceInterventionCreate) {
    const response = await apiService.post('/api/v1/maintenance/interventions', data);
    return response as MaintenanceIntervention;
  }

  async updateIntervention(id: number, data: MaintenanceInterventionUpdate) {
    const response = await apiService.put(`/api/v1/maintenance/interventions/${id}`, data);
    return response as MaintenanceIntervention;
  }

  async deleteIntervention(id: number) {
    await apiService.delete(`/api/v1/maintenance/interventions/${id}`);
  }

  async startIntervention(id: number) {
    const response = await apiService.post(`/api/v1/maintenance/interventions/${id}/start`);
    return response as MaintenanceIntervention;
  }

  async completeIntervention(id: number, data: {
    work_performed: string;
    issues_found?: string;
    recommendations?: string;
    parts_used?: Array<{ part_id: number; quantity_used: number; unit_cost?: number }>;
  }) {
    const response = await apiService.post(`/api/v1/maintenance/interventions/${id}/complete`, data);
    return response as MaintenanceIntervention;
  }

  async validateIntervention(id: number, data: { validation_notes?: string }) {
    const response = await apiService.post(`/api/v1/maintenance/interventions/${id}/validate`, data);
    return response as MaintenanceIntervention;
  }

  async rejectIntervention(id: number, data: { validation_notes: string }) {
    const response = await apiService.post(`/api/v1/maintenance/interventions/${id}/reject`, data);
    return response as MaintenanceIntervention;
  }

  // ===== TÂCHES DE MAINTENANCE =====
  
  async getMaintenanceTasks(planId: number) {
    const response = await apiService.get(`/api/v1/maintenance/plans/${planId}/tasks`);
    return response as MaintenanceTask[];
  }

  async createMaintenanceTask(planId: number, data: Omit<MaintenanceTask, 'id' | 'created_at' | 'updated_at'>) {
    const response = await apiService.post(`/api/v1/maintenance/plans/${planId}/tasks`, data);
    return response as MaintenanceTask;
  }

  async updateMaintenanceTask(planId: number, taskId: number, data: Partial<MaintenanceTask>) {
    const response = await apiService.put(`/api/v1/maintenance/plans/${planId}/tasks/${taskId}`, data);
    return response as MaintenanceTask;
  }

  async deleteMaintenanceTask(planId: number, taskId: number) {
    await apiService.delete(`/api/v1/maintenance/plans/${planId}/tasks/${taskId}`);
  }

  async reorderTasks(planId: number, taskOrders: Array<{ task_id: number; order: number }>) {
    const response = await apiService.post(`/api/v1/maintenance/plans/${planId}/tasks/reorder`, {
      task_orders: taskOrders
    });
    return response as MaintenanceTask[];
  }

  // ===== CALENDRIER =====
  
  async getCalendarEvents(startDate: string, endDate: string, filters?: {
    equipment_id?: number;
    technician_id?: number;
    maintenance_type?: string;
  }) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiService.get(`/api/v1/maintenance/calendar?${params.toString()}`);
    return response as CalendarEvent[];
  }

  async moveCalendarEvent(eventId: string, newStart: string, newEnd: string) {
    const response = await apiService.post('/api/v1/maintenance/calendar/move', {
      event_id: eventId,
      new_start: newStart,
      new_end: newEnd
    });
    return response as CalendarEvent;
  }

  // ===== STATISTIQUES =====
  
  async getMaintenanceStats(filters?: {
    equipment_id?: number;
    date_from?: string;
    date_to?: string;
  }) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiService.get(`/api/v1/maintenance/stats?${params.toString()}`);
    return response as MaintenanceStats;
  }

  async getUpcomingMaintenances(days: number = 7) {
    const response = await apiService.get(`/api/v1/maintenance/upcoming?days=${days}`);
    return response as ScheduledMaintenance[];
  }

  async getOverdueMaintenances() {
    const response = await apiService.get('/api/v1/maintenance/overdue');
    return response as ScheduledMaintenance[];
  }

  // ===== TEMPLATES =====
  
  async getMaintenanceTemplates() {
    const response = await apiService.get('/api/v1/maintenance/templates');
    return response as MaintenancePlan[];
  }

  async createMaintenanceFromTemplate(templateId: number, data: {
    equipment_id: number;
    scheduled_date: string;
    assigned_technician_id?: number;
  }) {
    const response = await apiService.post(`/api/v1/maintenance/templates/${templateId}/create`, data);
    return response as ScheduledMaintenance;
  }

  // ===== RAPPORTS =====
  
  async generateMaintenanceReport(filters: {
    date_from: string;
    date_to: string;
    equipment_id?: number;
    technician_id?: number;
    maintenance_type?: string;
    format: 'pdf' | 'excel' | 'csv';
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await apiService.get(`/api/v1/maintenance/reports?${params.toString()}`, {
      responseType: 'blob'
    });
    return response as Blob;
  }
}

export const maintenanceService = new MaintenanceService();
