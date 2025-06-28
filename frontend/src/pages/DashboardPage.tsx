// Page de tableau de bord simple
import React from 'react';
import { Card, Typography, Button, Space, Row, Col, Statistic } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, DashboardOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ff4d4f';
      case 'supervisor': return '#1890ff';
      case 'technician': return '#52c41a';
      default: return '#666';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'supervisor': return 'Superviseur';
      case 'technician': return 'Technicien';
      default: return role;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            🔧 Plateforme de Maintenance
          </Title>
          <Text type="secondary">Tableau de bord</Text>
        </div>
        
        <Space>
          <Button icon={<SettingOutlined />}>
            Paramètres
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Space>
      </div>

      {/* Informations utilisateur */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Informations utilisateur
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>Nom complet :</Text>
                <br />
                <Text style={{ fontSize: '16px' }}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </div>
              
              <div>
                <Text strong>Nom d'utilisateur :</Text>
                <br />
                <Text style={{ fontSize: '16px' }}>{user?.username}</Text>
              </div>
              
              <div>
                <Text strong>Email :</Text>
                <br />
                <Text style={{ fontSize: '16px' }}>{user?.email}</Text>
              </div>
              
              <div>
                <Text strong>Rôle :</Text>
                <br />
                <Text 
                  style={{ 
                    fontSize: '16px',
                    color: getRoleColor(user?.role || ''),
                    fontWeight: '500'
                  }}
                >
                  {getRoleLabel(user?.role || '')}
                </Text>
              </div>
              
              <div>
                <Text strong>Statut :</Text>
                <br />
                <Text style={{ 
                  color: user?.isActive ? '#52c41a' : '#ff4d4f',
                  fontWeight: '500'
                }}>
                  {user?.isActive ? 'Actif' : 'Inactif'}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <DashboardOutlined />
                Statistiques rapides
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Équipements"
                  value={0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Maintenances"
                  value={0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Alertes"
                  value={0}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Interventions"
                  value={0}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>

            <div style={{ marginTop: '30px' }}>
              <Title level={4}>Bienvenue sur la plateforme !</Title>
              <Text type="secondary">
                Votre authentification fonctionne parfaitement. 
                Les fonctionnalités de gestion des équipements, maintenances et inventaire 
                seront implémentées dans les prochaines étapes.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Actions rapides */}
      <Card
        title="Actions rapides"
        style={{ marginTop: '24px' }}
      >
        <Space wrap>
          <Button type="primary" disabled>
            Nouvel équipement
          </Button>
          <Button disabled>
            Planifier maintenance
          </Button>
          <Button disabled>
            Voir les alertes
          </Button>
          <Button disabled>
            Générer rapport
          </Button>
        </Space>
        <div style={{ marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            * Ces fonctionnalités seront disponibles dans les prochaines versions
          </Text>
        </div>
      </Card>
    </div>
  );
};
