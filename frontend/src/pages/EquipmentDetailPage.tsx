// Page de détail d'un équipement
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Spin,
  Alert,
  Empty,
  // Divider
} from 'antd';
import {
  EditOutlined,
  CalendarOutlined,
  // ArrowLeftOutlined,
  ToolOutlined,
  HistoryOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { DashboardLayout } from '../components/dashboard/common';
import { equipmentService } from '../services/equipmentService';
import {
  EquipmentWithRelations,
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_CRITICALITY_OPTIONS
} from '../types/equipment';

const { Title, Text } = Typography;

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [equipment, setEquipment] = useState<EquipmentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEquipment(parseInt(id));
    }
  }, [id]);

  const loadEquipment = async (equipmentId: number) => {
    try {
      setLoading(true);
      const data = await equipmentService.getEquipment(equipmentId);
      setEquipment(data);
    } catch (err) {
      setError('Erreur lors du chargement de l\'équipement');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusOption = EQUIPMENT_STATUS_OPTIONS.find(opt => opt.value === status);
    const colorMap = {
      green: 'success',
      gray: 'default',
      orange: 'warning',
      red: 'error'
    };

    return (
      <Tag color={colorMap[statusOption?.color as keyof typeof colorMap] || 'default'} style={{ fontSize: '14px' }}>
        {statusOption?.label || status}
      </Tag>
    );
  };

  const getCriticalityTag = (criticality: string) => {
    const criticalityOption = EQUIPMENT_CRITICALITY_OPTIONS.find(opt => opt.value === criticality);
    const colorMap = {
      green: 'success',
      yellow: 'warning',
      orange: 'orange',
      red: 'error'
    };

    return (
      <Tag color={colorMap[criticalityOption?.color as keyof typeof colorMap] || 'default'} style={{ fontSize: '14px' }}>
        {criticalityOption?.label || criticality}
      </Tag>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <DashboardLayout title="Chargement..." subtitle="Détail de l'équipement">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !equipment) {
    return (
      <DashboardLayout title="Erreur" subtitle="Détail de l'équipement">
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
              <Link to="/equipments">
                <Button size="small">
                  Retour à la liste
                </Button>
              </Link>
            </Space>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={equipment.name} subtitle="Détail de l'équipement">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Breadcrumb et en-tête */}
        <div>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <Link to="/equipments">Équipements</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{equipment.name}</Breadcrumb.Item>
          </Breadcrumb>

          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0 }}>
                  <ToolOutlined style={{ marginRight: 8 }} />
                  {equipment.name}
                </Title>
                <Space>
                  {getStatusTag(equipment.status)}
                  {getCriticalityTag(equipment.criticality)}
                </Space>
              </Space>
            </Col>
            <Col>
              <Space>
                <Link to={`/equipments/${equipment.id}/edit`}>
                  <Button type="primary" icon={<EditOutlined />}>
                    Modifier
                  </Button>
                </Link>
                <Button
                  type="default"
                  icon={<CalendarOutlined />}
                  onClick={() => alert('Fonctionnalité à venir')}
                >
                  Planifier maintenance
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Informations principales */}
        <Row gutter={[16, 16]}>
          {/* Informations générales */}
          <Col xs={24} lg={12}>
            <Card title="Informations générales" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Modèle">
                  {equipment.model || <Text type="secondary">Non défini</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Numéro de série">
                  {equipment.serial_number || <Text type="secondary">Non défini</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Fabricant">
                  {equipment.manufacturer || <Text type="secondary">Non défini</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Site">
                  {equipment.site_name || <Text type="secondary">Non assigné</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Ligne de production">
                  {equipment.production_line_name || <Text type="secondary">Non assigné</Text>}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Dates importantes */}
          <Col xs={24} lg={12}>
            <Card title="Dates importantes" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Date d'achat">
                  {formatDate(equipment.purchase_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Date d'installation">
                  {formatDate(equipment.installation_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Fin de garantie">
                  {formatDate(equipment.warranty_expiry)}
                </Descriptions.Item>
                <Descriptions.Item label="Durée de vie prévue">
                  {equipment.expected_lifespan ? `${equipment.expected_lifespan} ans` : 'Non défini'}
                </Descriptions.Item>
                <Descriptions.Item label="Créé le">
                  {formatDate(equipment.created_at)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* Spécifications techniques */}
        {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
          <Card title="Spécifications techniques" size="small">
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
              {Object.entries(equipment.specifications).map(([key, value]) => (
                <Descriptions.Item
                  key={key}
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                >
                  {String(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        )}

        {/* Historique des maintenances */}
        <Card
          title={
            <Space>
              <HistoryOutlined />
              Historique des maintenances
            </Space>
          }
          size="small"
          extra={
            <Button
              type="link"
              size="small"
              onClick={() => alert('Fonctionnalité à venir')}
            >
              Ajouter une intervention
            </Button>
          }
        >
          <Empty
            description={
              <div>
                <Text type="secondary">Aucun historique de maintenance disponible</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Cette fonctionnalité sera implémentée dans le module de maintenance
                </Text>
              </div>
            }
          />
        </Card>

        {/* Planning des maintenances futures */}
        <Card
          title={
            <Space>
              <ScheduleOutlined />
              Maintenances planifiées
            </Space>
          }
          size="small"
          extra={
            <Button
              type="link"
              size="small"
              onClick={() => alert('Fonctionnalité à venir')}
            >
              Planifier une maintenance
            </Button>
          }
        >
          <Empty
            description={
              <div>
                <Text type="secondary">Aucune maintenance planifiée</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Cette fonctionnalité sera implémentée dans le module de maintenance
                </Text>
              </div>
            }
          />
        </Card>
      </Space>
    </DashboardLayout>
  );
};

export default EquipmentDetailPage;
