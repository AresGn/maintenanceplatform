import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Form, 
  Input, 
  InputNumber,
  message,
  Modal,
  Divider,

  Alert
} from 'antd';
import { 
  ArrowLeftOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/dashboard/common/Header';
import { Sidebar } from '../components/dashboard/common/Sidebar';
import { MaintenanceTaskList } from '../components/maintenance/MaintenanceTaskList';
import { MaintenanceStatusBadge } from '../components/maintenance/MaintenanceStatusBadge';
import { MaintenancePriorityBadge } from '../components/maintenance/MaintenancePriorityBadge';
import { MaintenanceTypeBadge } from '../components/maintenance/MaintenanceTypeBadge';
import { 
  MaintenanceIntervention, 
  InterventionTask,
  MaintenanceInterventionUpdate 
} from '../types/maintenance';
import { maintenanceService } from '../services/maintenanceService';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const MaintenanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [intervention, setIntervention] = useState<MaintenanceIntervention | null>(null);
  const [tasks, setTasks] = useState<InterventionTask[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      loadIntervention(parseInt(id));
    }
  }, [id]);

  const loadIntervention = async (interventionId: number) => {
    try {
      const data = await maintenanceService.getIntervention(interventionId);
      setIntervention(data);
      
      // TODO: Charger les tâches de l'intervention
      // const tasksData = await maintenanceService.getInterventionTasks(interventionId);
      // setTasks(tasksData);
      
      // Initialiser le formulaire avec les données
      form.setFieldsValue({
        work_performed: data.work_performed || '',
        issues_found: data.issues_found || '',
        recommendations: data.recommendations || '',
        labor_cost: data.labor_cost || 0,
        parts_cost: data.parts_cost || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'intervention:', error);
      message.error('Erreur lors du chargement de l\'intervention');
    }
  };

  const handleStartIntervention = async () => {
    if (!intervention) return;
    
    try {
      const updatedIntervention = await maintenanceService.startIntervention(intervention.id);
      setIntervention(updatedIntervention);
      message.success('Intervention démarrée');
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
      message.error('Erreur lors du démarrage de l\'intervention');
    }
  };

  const handleCompleteIntervention = async () => {
    if (!intervention) return;

    const values = form.getFieldsValue();
    
    confirm({
      title: 'Terminer l\'intervention',
      content: 'Êtes-vous sûr de vouloir terminer cette intervention ?',
      okText: 'Terminer',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          const updatedIntervention = await maintenanceService.completeIntervention(
            intervention.id,
            {
              work_performed: values.work_performed,
              issues_found: values.issues_found,
              recommendations: values.recommendations,
              parts_used: [] // TODO: Gérer les pièces utilisées
            }
          );
          setIntervention(updatedIntervention);
          setEditMode(false);
          message.success('Intervention terminée');
        } catch (error) {
          console.error('Erreur lors de la finalisation:', error);
          message.error('Erreur lors de la finalisation de l\'intervention');
        }
      }
    });
  };

  const handleValidateIntervention = async () => {
    if (!intervention) return;

    confirm({
      title: 'Valider l\'intervention',
      content: 'Êtes-vous sûr de vouloir valider cette intervention ?',
      okText: 'Valider',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          const updatedIntervention = await maintenanceService.validateIntervention(
            intervention.id,
            { validation_notes: 'Intervention validée' }
          );
          setIntervention(updatedIntervention);
          message.success('Intervention validée');
        } catch (error) {
          console.error('Erreur lors de la validation:', error);
          message.error('Erreur lors de la validation de l\'intervention');
        }
      }
    });
  };

  const handleRejectIntervention = async () => {
    if (!intervention) return;

    Modal.confirm({
      title: 'Rejeter l\'intervention',
      content: (
        <div>
          <p>Pourquoi rejetez-vous cette intervention ?</p>
          <TextArea 
            placeholder="Motif du rejet..."
            id="rejection-reason"
          />
        </div>
      ),
      okText: 'Rejeter',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement)?.value;
        if (!reason) {
          message.error('Veuillez indiquer le motif du rejet');
          return;
        }
        
        try {
          const updatedIntervention = await maintenanceService.rejectIntervention(
            intervention.id,
            { validation_notes: reason }
          );
          setIntervention(updatedIntervention);
          message.success('Intervention rejetée');
        } catch (error) {
          console.error('Erreur lors du rejet:', error);
          message.error('Erreur lors du rejet de l\'intervention');
        }
      }
    });
  };

  const handleTaskUpdate = async (taskId: number, updates: Partial<InterventionTask>) => {
    // TODO: Implémenter la mise à jour des tâches
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
  };

  const handleSaveReport = async () => {
    if (!intervention) return;

    try {
      const values = form.getFieldsValue();
      const updates: MaintenanceInterventionUpdate = {
        work_performed: values.work_performed,
        issues_found: values.issues_found,
        recommendations: values.recommendations,
        labor_cost: values.labor_cost,
        parts_cost: values.parts_cost
      };

      const updatedIntervention = await maintenanceService.updateIntervention(
        intervention.id,
        updates
      );
      setIntervention(updatedIntervention);
      setEditMode(false);
      message.success('Rapport sauvegardé');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      message.error('Erreur lors de la sauvegarde du rapport');
    }
  };

  const canEdit = () => {
    if (!intervention || !user) return false;
    return intervention.technician_id === user.id && 
           ['assigned', 'in_progress'].includes(intervention.status);
  };

  const canValidate = () => {
    if (!intervention || !user) return false;
    return user.role === 'supervisor' && intervention.status === 'completed';
  };

  const getActionButtons = () => {
    if (!intervention) return null;

    const buttons = [];

    if (intervention.status === 'assigned' && canEdit()) {
      buttons.push(
        <Button
          key="start"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleStartIntervention}
        >
          Démarrer l'intervention
        </Button>
      );
    }

    if (intervention.status === 'in_progress' && canEdit()) {
      buttons.push(
        <Button
          key="complete"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleCompleteIntervention}
        >
          Terminer l'intervention
        </Button>
      );
    }

    if (intervention.status === 'completed' && canValidate()) {
      buttons.push(
        <Button
          key="validate"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleValidateIntervention}
        >
          Valider
        </Button>
      );
      buttons.push(
        <Button
          key="reject"
          danger
          icon={<CloseCircleOutlined />}
          onClick={handleRejectIntervention}
        >
          Rejeter
        </Button>
      );
    }

    return buttons;
  };

  if (!intervention) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header collapsed={collapsed} onCollapse={setCollapsed} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <div style={{ marginBottom: 24 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
              >
                Retour
              </Button>
            </Space>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16 
            }}>
              <Title level={2} style={{ margin: 0 }}>
                Intervention #{intervention.id}
              </Title>
              <Space>
                {getActionButtons()}
              </Space>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <Card title="Informations générales" style={{ marginBottom: 16 }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Équipement">
                    {intervention.equipment?.name || `Équipement #${intervention.equipment_id}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Technicien">
                    {intervention.technician ? 
                      `${intervention.technician.first_name} ${intervention.technician.last_name}` :
                      'Non assigné'
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    <MaintenanceTypeBadge type={intervention.maintenance_type} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Priorité">
                    <MaintenancePriorityBadge priority={intervention.priority} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Statut">
                    <MaintenanceStatusBadge status={intervention.status} type="intervention" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Date planifiée">
                    {intervention.scheduled_date ? 
                      new Date(intervention.scheduled_date).toLocaleDateString('fr-FR') : 
                      'Non planifiée'
                    }
                  </Descriptions.Item>
                  {intervention.actual_start_time && (
                    <Descriptions.Item label="Début réel">
                      {new Date(intervention.actual_start_time).toLocaleString('fr-FR')}
                    </Descriptions.Item>
                  )}
                  {intervention.actual_end_time && (
                    <Descriptions.Item label="Fin réelle">
                      {new Date(intervention.actual_end_time).toLocaleString('fr-FR')}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              <Card title="Description">
                <Text>{intervention.description}</Text>
              </Card>
            </div>

            <div>
              <MaintenanceTaskList
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                readOnly={!canEdit()}
                showProgress={true}
              />
            </div>
          </div>

          <Card 
            title="Rapport d'intervention"
            extra={
              canEdit() && (
                <Button
                  type={editMode ? 'primary' : 'default'}
                  icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                  onClick={editMode ? handleSaveReport : () => setEditMode(true)}
                >
                  {editMode ? 'Sauvegarder' : 'Modifier'}
                </Button>
              )
            }
            style={{ marginTop: 24 }}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="work_performed" label="Travaux effectués">
                <TextArea
                  rows={4}
                  placeholder="Décrivez les travaux effectués..."
                  disabled={!editMode}
                />
              </Form.Item>

              <Form.Item name="issues_found" label="Problèmes identifiés">
                <TextArea
                  rows={3}
                  placeholder="Décrivez les problèmes identifiés..."
                  disabled={!editMode}
                />
              </Form.Item>

              <Form.Item name="recommendations" label="Recommandations">
                <TextArea
                  rows={3}
                  placeholder="Recommandations pour les prochaines interventions..."
                  disabled={!editMode}
                />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="labor_cost" label="Coût main d'œuvre (€)">
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: '100%' }}
                    disabled={!editMode}
                  />
                </Form.Item>

                <Form.Item name="parts_cost" label="Coût pièces (€)">
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: '100%' }}
                    disabled={!editMode}
                  />
                </Form.Item>
              </div>
            </Form>

            {intervention.validation_notes && (
              <>
                <Divider />
                <Alert
                  message="Notes de validation"
                  description={intervention.validation_notes}
                  type={intervention.status === 'validated' ? 'success' : 'error'}
                  showIcon
                />
              </>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MaintenanceDetailPage;
