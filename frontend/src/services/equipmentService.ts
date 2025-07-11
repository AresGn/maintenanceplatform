// Service pour la gestion des équipements
import { apiService } from './api';
import { 
  Equipment, 
  EquipmentWithRelations, 
  EquipmentCreate, 
  EquipmentUpdate, 
  EquipmentFilter,
  EquipmentStats,
  Site,
  ProductionLine
} from '../types/equipment';

class EquipmentService {
  // Équipements
  async getEquipments(filters?: EquipmentFilter & { skip?: number; limit?: number }) {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get(`/api/equipment?${params.toString()}`);
    return response as Equipment[];
  }

  async getEquipment(id: number) {
    const response = await apiService.get(`/api/equipment/${id}`);
    return response as EquipmentWithRelations;
  }

  async createEquipment(data: EquipmentCreate) {
    const response = await apiService.post('/api/equipment', data);
    return response as Equipment;
  }

  async updateEquipment(id: number, data: EquipmentUpdate) {
    const response = await apiService.put(`/api/equipment/${id}`, data);
    return response as Equipment;
  }

  async deleteEquipment(id: number) {
    await apiService.delete(`/api/equipment/${id}`);
  }

  async getEquipmentStats() {
    const response = await apiService.get('/api/v1/equipment/stats/summary');
    return response as EquipmentStats;
  }

  // Sites
  async getSites() {
    const response = await apiService.get('/api/v1/sites');
    return response as Site[];
  }

  async getSite(id: number) {
    const response = await apiService.get(`/api/v1/sites/${id}`);
    return response as Site;
  }

  async createSite(data: { name: string; location?: string; description?: string }) {
    const response = await apiService.post('/api/v1/sites', data);
    return response as Site;
  }

  async updateSite(id: number, data: { name?: string; location?: string; description?: string }) {
    const response = await apiService.put(`/api/v1/sites/${id}`, data);
    return response as Site;
  }

  async deleteSite(id: number) {
    await apiService.delete(`/api/v1/sites/${id}`);
  }

  // Lignes de production
  async getProductionLines(siteId?: number) {
    const params = siteId ? `?site_id=${siteId}` : '';
    const response = await apiService.get(`/api/v1/production-lines${params}`);
    return response as ProductionLine[];
  }

  async getProductionLine(id: number) {
    const response = await apiService.get(`/api/v1/production-lines/${id}`);
    return response as ProductionLine;
  }

  async createProductionLine(data: { site_id: number; name: string; description?: string }) {
    const response = await apiService.post('/api/v1/production-lines', data);
    return response as ProductionLine;
  }

  async updateProductionLine(id: number, data: { site_id?: number; name?: string; description?: string }) {
    const response = await apiService.put(`/api/v1/production-lines/${id}`, data);
    return response as ProductionLine;
  }

  async deleteProductionLine(id: number) {
    await apiService.delete(`/api/v1/production-lines/${id}`);
  }
}

export const equipmentService = new EquipmentService();
