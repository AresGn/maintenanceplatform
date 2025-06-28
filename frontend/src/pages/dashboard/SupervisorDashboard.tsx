// Tableau de bord superviseur
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Button, List, Avatar, Tag, Progress } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ToolOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { DashboardLayout, StatCard, AlertsWidget } from '../../components/dashboard/common';
import { dashboardService } from '../../services/dashboardService';
import { DashboardData, TeamMember, TaskItem } from '../../types/dashboard';

const { Title, Text } = Typography;

export const SupervisorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData('supervisor');
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#52c41a';
      case 'busy': return '#faad14';
      case 'offline': return '#ff4d4f';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Occupé';
      case 'offline': return 'Hors ligne';
      default: return status;
    }
  };

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

  if (!dashboardData) {
    return (
      <DashboardLayout title="Supervision" subtitle="Gestion d'équipe">
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  const pendingTasks = dashboardData.tasks.filter(task => task.status === 'pending');
  const inProgressTasks = dashboardData.tasks.filter(task => task.status === 'in_progress');
  const completedTasks = dashboardData.tasks.filter(task => task.status === 'completed');

  return (
    <DashboardLayout title="Supervision" subtitle="Gestion d'équipe">
      {/* Statistiques de l'équipe */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Techniciens actifs"
            value={dashboardData.teamMembers?.filter(m => m.status !== 'offline').length || 0}
            icon={<TeamOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tâches en cours"
            value={inProgressTasks.length}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tâches terminées"
            value={completedTasks.length}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="En attente validation"
            value={pendingTasks.length}
            icon={<FileTextOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
      </Row>

      {/* Vue d'ensemble de l'équipe et tâches */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} xl={14}>
          <Card
            title="Mon équipe"
            extra={<Button type="link">Voir détails</Button>}
            style={{ height: '450px' }}
          >
            <List
              dataSource={dashboardData.teamMembers}
              renderItem={(member: TeamMember) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: getStatusColor(member.status) }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <Text strong style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {member.name}
                        </Text>
                        <Tag color={getStatusColor(member.status)} style={{ flexShrink: 0 }}>
                          {getStatusText(member.status)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{member.role}</Text>
                        {member.currentTask && (
                          <div style={{ marginTop: '4px' }}>
                            <Text style={{
                              fontSize: '12px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'block',
                              maxWidth: '100%'
                            }}>
                              <ToolOutlined /> {member.currentTask}
                            </Text>
                          </div>
                        )}
                        <div style={{ marginTop: '8px' }}>
                          <Text style={{ fontSize: '12px' }}>
                            Tâches complétées: {member.completedTasks}
                          </Text>
                          <Progress
                            percent={Math.min((member.completedTasks / 20) * 100, 100)}
                            size="small"
                            style={{ marginTop: '4px' }}
                          />
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
            title="Tâches à valider"
            extra={<Button type="primary">Valider tout</Button>}
            style={{ height: '450px' }}
          >
            <List
              dataSource={pendingTasks.slice(0, 5)}
              renderItem={(task: TaskItem) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">Valider</Button>,
                    <Button type="link" size="small">Détails</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>{task.title}</Text>
                        <Tag color={getPriorityColor(task.priority)}>
                          {getPriorityText(task.priority)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text style={{ fontSize: '13px' }}>{task.description}</Text>
                        {task.assignedTo && (
                          <div style={{ marginTop: '4px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Assigné à: {task.assignedTo}
                            </Text>
                          </div>
                        )}
                        {task.equipment && (
                          <div style={{ marginTop: '2px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <ToolOutlined /> {task.equipment}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Alertes et planification */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <AlertsWidget
            alerts={dashboardData.alerts}
            loading={loading}
          />
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Planification des ressources" style={{ height: '450px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button type="primary" icon={<CalendarOutlined />} block>
                Planifier nouvelle tâche
              </Button>
              <Button icon={<TeamOutlined />} block>
                Affecter technicien
              </Button>
              <Button icon={<FileTextOutlined />} block>
                Générer rapport équipe
              </Button>
              
              <div style={{ marginTop: '20px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>Charge de travail cette semaine</Title>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <Text style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '120px'
                    }}>
                      Jean Dupont
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#666' }}>85%</Text>
                  </div>
                  <Progress percent={85} size="small" status="active" />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <Text style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '120px'
                    }}>
                      Marie Martin
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#666' }}>60%</Text>
                  </div>
                  <Progress percent={60} size="small" />
                </div>

              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};
