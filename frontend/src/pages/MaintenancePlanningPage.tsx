import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Button, Space, Modal, message, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined,
  PauseCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/dashboard/common/Header';
import { Sidebar } from '../components/dashboard/common/Sidebar';
import { MaintenancePlanForm } from '../components/maintenance/MaintenancePlanForm';
import { MaintenanceTypeBadge } from '../components/maintenance/MaintenanceTypeBadge';
import { MaintenancePriorityBadge } from '../components/maintenance/MaintenancePriorityBadge';
import { 
  MaintenancePlan, 
  MaintenancePlanCreate, 
  MaintenancePlanUpdate 
} from '../types/maintenance';
import { maintenanceService } from '../services/maintenanceService';

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const MaintenancePlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MaintenancePlan | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await maintenanceService.getMaintenancePlans();
      setPlans(data);
    } catch (error) {
      console.error('Erreur lors du chargement des plans:', error);
      message.error('Erreur lors du chargement des plans de maintenance');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setModalVisible(true);
  };

  const handleEdit = (plan: MaintenancePlan) => {
    setEditingPlan(plan);
    setModalVisible(true);
  };

  const handleDelete = (plan: MaintenancePlan) => {
    confirm({
      title: 'Supprimer le plan de maintenance',
      content: `Êtes-vous sûr de vouloir supprimer le plan "${plan.name}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          await maintenanceService.deleteMaintenancePlan(plan.id);
          message.success('Plan supprimé avec succès');
          loadPlans();
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          message.error('Erreur lors de la suppression du plan');
        }
      }
    });
  };

  const handleActivate = async (plan: MaintenancePlan) => {
    try {
      await maintenanceService.activateMaintenancePlan(plan.id);
      message.success('Plan activé avec succès');
      loadPlans();
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
      message.error('Erreur lors de l\'activation du plan');
    }
  };

  const handleDeactivate = async (plan: MaintenancePlan) => {
    try {
      await maintenanceService.deactivateMaintenancePlan(plan.id);
      message.success('Plan désactivé avec succès');
      loadPlans();
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error);
      message.error('Erreur lors de la désactivation du plan');
    }
  };

  const handleFormSubmit = async (data: MaintenancePlanCreate | MaintenancePlanUpdate) => {
    setFormLoading(true);
    try {
      if (editingPlan) {
        await maintenanceService.updateMaintenancePlan(editingPlan.id, data as MaintenancePlanUpdate);
        message.success('Plan mis à jour avec succès');
      } else {
        await maintenanceService.createMaintenancePlan(data as MaintenancePlanCreate);
        message.success('Plan créé avec succès');
      }
      setModalVisible(false);
      setEditingPlan(null);
      loadPlans();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      message.error('Erreur lors de la sauvegarde du plan');
    } finally {
      setFormLoading(false);
    }
  };

  const handleScheduleMaintenance = (plan: MaintenancePlan) => {
    // Rediriger vers une page de planification spécifique ou ouvrir un modal
    navigate(`/maintenance/schedule/${plan.id}`);
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: MaintenancePlan) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              {record.description.length > 100 
                ? `${record.description.substring(0, 100)}...` 
                : record.description
              }
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Équipement',
      dataIndex: 'equipment_id',
      key: 'equipment_id',
      render: (equipmentId: number) => `Équipement #${equipmentId}` // TODO: Afficher le nom de l'équipement
    },
    {
      title: 'Type',
      dataIndex: 'maintenance_type',
      key: 'maintenance_type',
      render: (type: string) => <MaintenanceTypeBadge type={type as any} />
    },
    {
      title: 'Priorité',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <MaintenancePriorityBadge priority={priority as any} />
    },
    {
      title: 'Fréquence',
      dataIndex: 'frequency_days',
      key: 'frequency_days',
      render: (days: number) => `${days} jour${days > 1 ? 's' : ''}`
    },
    {
      title: 'Durée estimée',
      dataIndex: 'estimated_duration',
      key: 'estimated_duration',
      render: (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
          return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
        }
        return `${mins}min`;
      }
    },
    {
      title: 'Statut',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Actif' : 'Inactif'}
        </Tag>
      )
    },
    {
      title: 'Prochaine échéance',
      dataIndex: 'next_due_date',
      key: 'next_due_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MaintenancePlan) => (
        <Space size="small">
          <Button
            type="text"
            icon={<CalendarOutlined />}
            onClick={() => handleScheduleMaintenance(record)}
            title="Planifier une maintenance"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Modifier"
          />
          {record.is_active ? (
            <Button
              type="text"
              icon={<PauseCircleOutlined />}
              onClick={() => handleDeactivate(record)}
              title="Désactiver"
            />
          ) : (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleActivate(record)}
              title="Activer"
            />
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            title="Supprimer"
          />
        </Space>
      )
    }
  ];

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
                Planification des Maintenances
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Créer un plan de maintenance
              </Button>
            </div>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={plans}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} sur ${total} plans`
              }}
            />
          </Card>

          <Modal
            title={editingPlan ? 'Modifier le plan de maintenance' : 'Créer un plan de maintenance'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingPlan(null);
            }}
            footer={null}
            width={800}
            destroyOnClose
          >
            <MaintenancePlanForm
              initialData={editingPlan || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setModalVisible(false);
                setEditingPlan(null);
              }}
              loading={formLoading}
              mode={editingPlan ? 'edit' : 'create'}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MaintenancePlanningPage;
