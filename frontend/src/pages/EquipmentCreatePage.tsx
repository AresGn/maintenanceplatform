// Page de création d'équipement
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Breadcrumb, 
  message, 
  Typography,
  Space
} from 'antd';
import { 
  PlusOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { DashboardLayout } from '../components/dashboard/common';
import { EquipmentForm } from '../components/equipment';
import { equipmentService } from '../services/equipmentService';
import { EquipmentCreate } from '../types/equipment';

const { Title } = Typography;

const EquipmentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: EquipmentCreate) => {
    try {
      setLoading(true);
      const newEquipment = await equipmentService.createEquipment(data);
      
      message.success('Équipement créé avec succès');
      
      // Rediriger vers la page de détail du nouvel équipement
      navigate(`/equipments/${newEquipment.id}`);
    } catch (error: any) {
      console.error('Error creating equipment:', error);
      
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
        message.error('Vous n\'avez pas les permissions pour créer un équipement');
      } else {
        message.error('Erreur lors de la création de l\'équipement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/equipments');
  };

  return (
    <DashboardLayout 
      title="Nouvel équipement" 
      subtitle="Ajouter un équipement au système"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={() => navigate('/equipments')}>Équipements</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Nouvel équipement</Breadcrumb.Item>
        </Breadcrumb>

        {/* En-tête */}
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <PlusOutlined style={{ marginRight: 8 }} />
            Créer un nouvel équipement
          </Title>
        </div>

        {/* Formulaire */}
        <EquipmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEdit={false}
        />
      </Space>
    </DashboardLayout>
  );
};

export default EquipmentCreatePage;
