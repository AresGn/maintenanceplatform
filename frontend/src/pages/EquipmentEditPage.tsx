// Page de modification d'équipement
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Breadcrumb, 
  message, 
  Typography,
  Space,
  Spin,
  Alert,
  Button
} from 'antd';
import { 
  EditOutlined,
  // ArrowLeftOutlined
} from '@ant-design/icons';
import { DashboardLayout } from '../components/dashboard/common';
import { EquipmentForm } from '../components/equipment';
import { equipmentService } from '../services/equipmentService';
import { Equipment, EquipmentUpdate } from '../types/equipment';

const { Title } = Typography;

const EquipmentEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEquipment(parseInt(id));
    }
  }, [id]);

  const loadEquipment = async (equipmentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipment(equipmentId);
      setEquipment(data);
    } catch (error: any) {
      console.error('Error loading equipment:', error);
      if (error.response?.status === 404) {
        setError('Équipement non trouvé');
      } else {
        setError('Erreur lors du chargement de l\'équipement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: EquipmentUpdate) => {
    if (!equipment) return;

    try {
      setSubmitting(true);
      await equipmentService.updateEquipment(equipment.id, data);
      
      message.success('Équipement mis à jour avec succès');
      
      // Rediriger vers la page de détail
      navigate(`/equipments/${equipment.id}`);
    } catch (error: any) {
      console.error('Error updating equipment:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.detail?.includes('numéro de série')) {
          message.error('Ce numéro de série existe déjà');
        } else if (errorData.detail?.includes('nom')) {
          message.error('Un équipement avec ce nom existe déjà');
        } else {
          message.error(errorData.detail || 'Données invalides');
        }
      } else if (error.response?.status === 403) {
        message.error('Vous n\'avez pas les permissions pour modifier cet équipement');
      } else if (error.response?.status === 404) {
        message.error('Équipement non trouvé');
      } else {
        message.error('Erreur lors de la mise à jour de l\'équipement');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (equipment) {
      navigate(`/equipments/${equipment.id}`);
    } else {
      navigate('/equipments');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Chargement..." subtitle="Modification de l'équipement">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !equipment) {
    return (
      <DashboardLayout title="Erreur" subtitle="Modification de l'équipement">
        <Alert
          message="Erreur"
          description={error || 'Équipement non trouvé'}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => id && loadEquipment(parseInt(id))}>
                Réessayer
              </Button>
              <Button size="small" onClick={() => navigate('/equipments')}>
                Retour à la liste
              </Button>
            </Space>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={`Modifier ${equipment.name}`} 
      subtitle="Modification de l'équipement"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={() => navigate('/equipments')}>Équipements</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/equipments/${equipment.id}`)}>{equipment.name}</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Modifier</Breadcrumb.Item>
        </Breadcrumb>

        {/* En-tête */}
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <EditOutlined style={{ marginRight: 8 }} />
            Modifier {equipment.name}
          </Title>
        </div>

        {/* Formulaire */}
        <EquipmentForm
          equipment={equipment}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          isEdit={true}
        />
      </Space>
    </DashboardLayout>
  );
};

export default EquipmentEditPage;
