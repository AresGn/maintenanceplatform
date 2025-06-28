// Tableau de bord technicien
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Button, List, Tag, Timeline, Calendar } from 'antd';
import { 
  CalendarOutlined, 
  ToolOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  AlertOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { DashboardLayout, StatCard, AlertsWidget } from '../../components/dashboard/common';
import { dashboardService } from '../../services/dashboardService';
import { DashboardData, TaskItem } from '../../types/dashboard';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData('technician');
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#666';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#faad14';
      case 'in_progress': return '#1890ff';
      case 'completed': return '#52c41a';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  if (!dashboardData) {
    return (
      <DashboardLayout title="Mes tâches" subtitle={`Bienvenue ${user?.firstName}`}>
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  const todayTasks = dashboardData.tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const pendingTasks = dashboardData.tasks.filter(task => task.status === 'pending');
  const inProgressTasks = dashboardData.tasks.filter(task => task.status === 'in_progress');
  const completedTasks = dashboardData.tasks.filter(task => task.status === 'completed');

  return (
    <DashboardLayout title="Mes tâches" subtitle={`Bienvenue ${user?.firstName}`}>
      {/* Statistiques personnelles */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tâches aujourd'hui"
            value={todayTasks.length}
            icon={<CalendarOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="En cours"
            value={inProgressTasks.length}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Terminées"
            value={completedTasks.length}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="En attente"
            value={pendingTasks.length}
            icon={<FileTextOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
      </Row>

      {/* Tâches du jour et équipements */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} xl={14}>
          <Card
            title="Mes tâches d'aujourd'hui"
            extra={<Button type="primary">Nouvelle tâche</Button>}
            style={{ height: '450px' }}
          >
            <List
              dataSource={todayTasks}
              renderItem={(task: TaskItem) => (
                <List.Item
                  actions={[
                    task.status === 'pending' ? (
                      <Button 
                        type="primary" 
                        size="small" 
                        icon={<PlayCircleOutlined />}
                      >
                        Commencer
                      </Button>
                    ) : task.status === 'in_progress' ? (
                      <Button 
                        size="small" 
                        icon={<PauseCircleOutlined />}
                      >
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        type="link" 
                        size="small"
                      >
                        Voir
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <Text strong style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {task.title}
                        </Text>
                        <Space style={{ flexShrink: 0 }}>
                          <Tag color={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Tag>
                          <Tag color={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Tag>
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Text style={{ fontSize: '13px' }}>{task.description}</Text>
                        {task.equipment && (
                          <div style={{ marginTop: '4px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <ToolOutlined /> {task.equipment}
                            </Text>
                          </div>
                        )}
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card
            title="Mes équipements"
            extra={<Button type="link">Voir tous</Button>}
            style={{ height: '450px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ padding: '12px', backgroundColor: '#f6ffed', borderRadius: '6px', border: '1px solid #b7eb8f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Pompe hydraulique P1</Text>
                  <Tag color="green">Opérationnel</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Dernière maintenance: Il y a 2 semaines
                </Text>
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#fff7e6', borderRadius: '6px', border: '1px solid #ffd591' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Compresseur A2</Text>
                  <Tag color="orange">Attention</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Maintenance prévue: Dans 3 jours
                </Text>
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#f6ffed', borderRadius: '6px', border: '1px solid #b7eb8f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Moteur électrique M3</Text>
                  <Tag color="green">Opérationnel</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Dernière maintenance: Il y a 1 mois
                </Text>
              </div>
              
              <Button type="dashed" block icon={<ToolOutlined />}>
                Signaler un problème
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Historique et notifications */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <AlertsWidget
            alerts={dashboardData.alerts}
            loading={loading}
          />
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Historique récent" style={{ height: '450px' }}>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>Maintenance terminée</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Pompe hydraulique P1 - Il y a 2h
                      </Text>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <Text strong>Tâche commencée</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Inspection compresseur A2 - Il y a 4h
                      </Text>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>Rapport soumis</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Maintenance préventive M3 - Hier
                      </Text>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <Text strong>Alerte signalée</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Température élevée P1 - Il y a 2 jours
                      </Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};
