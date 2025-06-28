// Types pour les tableaux de bord
export interface DashboardStats {
  equipments: number;
  maintenances: number;
  alerts: number;
  interventions: number;
  availability?: number;
  mtbf?: number;
  mttr?: number;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  prefix?: string;
  loading?: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  equipment?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo?: string;
  equipment?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'offline';
  currentTask?: string;
  completedTasks: number;
}

export interface DashboardData {
  stats: DashboardStats;
  alerts: AlertItem[];
  tasks: TaskItem[];
  teamMembers?: TeamMember[];
  chartData?: ChartData[];
}
