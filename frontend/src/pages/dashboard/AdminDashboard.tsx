// Tableau de bord administrateur
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Button, Statistic } from 'antd';
import { 
  ToolOutlined, 
  CalendarOutlined, 
  AlertOutlined, 
  TeamOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { DashboardLayout, StatCard, AlertsWidget } from '../../components/dashboard/common';
import { dashboardService } from '../../services/dashboardService';
import { DashboardData } from '../../types/dashboard';

const { Text } = Typography;

export const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData('admin');
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <DashboardLayout title="Tableau de bord" subtitle="Vue administrateur">
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de bord" subtitle="Vue administrateur">
      {/* Statistiques principales */}
      <Row gutter={[12, 12]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Équipements"
            value={dashboardData.stats.equipments}
            icon={<ToolOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Maintenances"
            value={dashboardData.stats.maintenances}
            icon={<CalendarOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Alertes"
            value={dashboardData.stats.alerts}
            icon={<AlertOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Interventions"
            value={dashboardData.stats.interventions}
            icon={<TeamOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
      </Row>

      {/* KPIs avancés */}
      <Row gutter={[12, 12]} style={{ marginBottom: '16px' }}>
        <Col xs={24} lg={8}>
          <Card title="Indicateurs de Performance" style={{ height: '180px' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Disponibilité"
                  value={dashboardData.stats.availability}
                  suffix="%"
                  valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="MTBF"
                  value={dashboardData.stats.mtbf}
                  suffix="h"
                  valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="MTTR"
                  value={dashboardData.stats.mttr}
                  suffix="h"
                  valueStyle={{ color: '#faad14', fontSize: '20px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="État de l'équipe" style={{ height: '180px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Techniciens actifs:</Text>
                <Text strong style={{ color: '#52c41a' }}>
                  {dashboardData.teamMembers?.filter(m => m.status === 'available' || m.status === 'busy').length || 0}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>En intervention:</Text>
                <Text strong style={{ color: '#faad14' }}>
                  {dashboardData.teamMembers?.filter(m => m.status === 'busy').length || 0}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Disponibles:</Text>
                <Text strong style={{ color: '#1890ff' }}>
                  {dashboardData.teamMembers?.filter(m => m.status === 'available').length || 0}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Actions rapides" style={{ height: '180px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <Button
                type="primary"
                icon={<ToolOutlined />}
                block
                size="small"
                style={{ fontSize: '12px', height: '32px' }}
              >
                Nouvel équipement
              </Button>
              <Button
                icon={<CalendarOutlined />}
                block
                size="small"
                style={{ fontSize: '12px', height: '32px' }}
              >
                Planifier maintenance
              </Button>
              <Button
                icon={<BarChartOutlined />}
                block
                size="small"
                style={{ fontSize: '12px', height: '32px' }}
              >
                Générer rapport
              </Button>
              <Button
                icon={<SettingOutlined />}
                block
                size="small"
                style={{ fontSize: '12px', height: '32px' }}
              >
                Configuration
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Alertes et activités récentes */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <AlertsWidget
            alerts={dashboardData.alerts}
            loading={loading}
          />
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Activités récentes" style={{ height: '400px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div style={{ padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Maintenance terminée</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Il y a 2h</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Pompe hydraulique P1 - Jean Dupont</Text>
              </div>
              
              <div style={{ padding: '8px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text><ClockCircleOutlined style={{ color: '#faad14' }} /> Maintenance planifiée</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Il y a 4h</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Compresseur A2 - Marie Martin</Text>
              </div>
              
              <div style={{ padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Nouvel équipement ajouté</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Hier</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Moteur électrique M5</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};
