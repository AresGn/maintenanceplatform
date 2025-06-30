import React, { useState } from 'react';
import { Layout, Typography, Space, Button, message } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/dashboard/common/Header';
import { Sidebar } from '../components/dashboard/common/Sidebar';
import { MaintenanceCalendar } from '../components/maintenance/MaintenanceCalendar';
import { MaintenanceFilters } from '../components/maintenance/MaintenanceFilters';
import { CalendarEvent, MaintenanceFilter } from '../types/maintenance';

const { Content } = Layout;
const { Title } = Typography;

const MaintenanceCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MaintenanceFilter>({});

  const handleEventClick = (event: CalendarEvent) => {
    const { extendedProps } = event;
    
    if (extendedProps?.type === 'scheduled') {
      // Rediriger vers la page de détail de la maintenance planifiée
      navigate(`/maintenance/scheduled/${event.id}`);
    } else if (extendedProps?.type === 'intervention') {
      // Rediriger vers la page de détail de l'intervention
      navigate(`/maintenance/interventions/${event.id}`);
    }
  };

  const handleEventDrop = async (_: string, __: Date, ___: Date) => {
    try {
      // La logique de déplacement est gérée dans le composant MaintenanceCalendar
      message.success('Maintenance reprogrammée avec succès');
    } catch (error) {
      console.error('Erreur lors de la reprogrammation:', error);
      message.error('Erreur lors de la reprogrammation');
      throw error; // Relancer l'erreur pour que le calendrier puisse annuler le déplacement
    }
  };

  const handleFiltersChange = (newFilters: MaintenanceFilter) => {
    setFilters(newFilters);
  };

  const handleCreateMaintenance = () => {
    navigate('/maintenance/planning');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header collapsed={collapsed} onCollapse={setCollapsed} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16 
            }}>
              <Title level={2} style={{ margin: 0 }}>
                Calendrier des Maintenances
              </Title>
              <Space>
                <Button
                  icon={<FilterOutlined />}
                  onClick={toggleFilters}
                  type={showFilters ? 'primary' : 'default'}
                >
                  Filtres
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateMaintenance}
                >
                  Planifier une maintenance
                </Button>
              </Space>
            </div>

            {showFilters && (
              <MaintenanceFilters
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
                type="all"
                showDateFilter={false} // Le calendrier gère déjà les dates
              />
            )}
          </div>

          <MaintenanceCalendar
            filters={{
              equipment_id: filters.equipment_id,
              technician_id: filters.technician_id,
              maintenance_type: filters.maintenance_type
            }}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            height="calc(100vh - 300px)"
          />

          <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
            <Title level={5} style={{ margin: '0 0 8px 0' }}>Légende des couleurs :</Title>
            <Space wrap>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#52c41a', 
                  marginRight: 8, 
                  borderRadius: 2 
                }} />
                <span>Priorité faible</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#faad14', 
                  marginRight: 8, 
                  borderRadius: 2 
                }} />
                <span>Priorité moyenne</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#fa8c16', 
                  marginRight: 8, 
                  borderRadius: 2 
                }} />
                <span>Priorité élevée</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#f5222d', 
                  marginRight: 8, 
                  borderRadius: 2 
                }} />
                <span>Priorité critique</span>
              </div>
            </Space>
          </div>

          <div style={{ marginTop: 16, fontSize: '14px', color: '#666' }}>
            <p>
              <strong>Instructions :</strong>
            </p>
            <ul style={{ paddingLeft: 20 }}>
              <li>Cliquez sur un événement pour voir les détails</li>
              <li>Glissez-déposez un événement pour le reprogrammer</li>
              <li>Utilisez les boutons de vue pour changer l'affichage (Mois, Semaine, Jour, Liste)</li>
              <li>Utilisez les filtres pour affiner l'affichage selon vos besoins</li>
            </ul>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MaintenanceCalendarPage;
