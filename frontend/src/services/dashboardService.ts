// Service pour les données du tableau de bord
import { DashboardData, DashboardStats, AlertItem, TaskItem, TeamMember } from '../types/dashboard';

class DashboardService {
  // Données mockées pour le développement
  private mockStats: DashboardStats = {
    equipments: 45,
    maintenances: 12,
    alerts: 3,
    interventions: 8,
    availability: 94.5,
    mtbf: 720,
    mttr: 2.5
  };

  private mockAlerts: AlertItem[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Panne critique - Compresseur A1',
      description: 'Température anormalement élevée détectée',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      equipment: 'Compresseur A1'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Maintenance préventive due',
      description: 'Révision trimestrielle du moteur B2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      equipment: 'Moteur B2'
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouveau rapport disponible',
      description: 'Rapport mensuel de performance généré',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];

  private mockTasks: TaskItem[] = [
    {
      id: '1',
      title: 'Inspection pompe hydraulique',
      description: 'Vérification des joints et du niveau d\'huile',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      equipment: 'Pompe hydraulique P1'
    },
    {
      id: '2',
      title: 'Remplacement filtre à air',
      description: 'Changement du filtre principal du système de ventilation',
      priority: 'medium',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Jean Dupont',
      equipment: 'Système ventilation V1'
    },
    {
      id: '3',
      title: 'Calibrage capteurs',
      description: 'Étalonnage des capteurs de température',
      priority: 'low',
      status: 'completed',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Marie Martin',
      equipment: 'Capteurs zone A'
    }
  ];

  private mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      role: 'Technicien Senior',
      status: 'busy',
      currentTask: 'Maintenance pompe P1',
      completedTasks: 15
    },
    {
      id: '2',
      name: 'Marie Martin',
      role: 'Technicienne',
      status: 'available',
      completedTasks: 12
    }
  ];

  // Simuler un délai d'API
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Récupérer les données du tableau de bord selon le rôle
  async getDashboardData(role: string): Promise<DashboardData> {
    await this.delay(500); // Simuler un appel API

    const baseData: DashboardData = {
      stats: this.mockStats,
      alerts: this.mockAlerts,
      tasks: this.mockTasks
    };

    // Adapter les données selon le rôle
    switch (role) {
      case 'admin':
        return {
          ...baseData,
          teamMembers: this.mockTeamMembers
        };
      
      case 'supervisor':
        return {
          ...baseData,
          teamMembers: this.mockTeamMembers,
          // Filtrer les tâches pour l'équipe
          tasks: this.mockTasks.filter(task => task.assignedTo)
        };
      
      case 'technician':
        return {
          ...baseData,
          // Filtrer les tâches assignées à l'utilisateur actuel
          tasks: this.mockTasks.filter(task => 
            task.assignedTo === 'Jean Dupont' || !task.assignedTo
          ),
          // Pas d'accès aux données d'équipe
          teamMembers: undefined
        };
      
      default:
        return baseData;
    }
  }

  // Récupérer les statistiques
  async getStats(role: string): Promise<DashboardStats> {
    await this.delay(300);
    return this.mockStats;
  }

  // Récupérer les alertes
  async getAlerts(role: string): Promise<AlertItem[]> {
    await this.delay(200);
    return this.mockAlerts;
  }

  // Récupérer les tâches
  async getTasks(role: string): Promise<TaskItem[]> {
    await this.delay(300);
    
    switch (role) {
      case 'technician':
        return this.mockTasks.filter(task => 
          task.assignedTo === 'Jean Dupont' || !task.assignedTo
        );
      default:
        return this.mockTasks;
    }
  }

  // Récupérer les membres de l'équipe
  async getTeamMembers(): Promise<TeamMember[]> {
    await this.delay(400);
    return this.mockTeamMembers;
  }
}

export const dashboardService = new DashboardService();
