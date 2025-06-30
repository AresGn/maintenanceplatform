// Page de liste des équipements
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Typography,
  Spin,
  Alert,
  Divider
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { DashboardLayout } from '../components/dashboard/common';
import { equipmentService } from '../services/equipmentService';
import {
  Equipment,
  Site,
  ProductionLine,
  EquipmentFilter,
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_CRITICALITY_OPTIONS
} from '../types/equipment';

const { Option } = Select;
const { Text } = Typography;

const EquipmentListPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres
  const [filters, setFilters] = useState<EquipmentFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentData, sitesData, productionLinesData] = await Promise.all([
        equipmentService.getEquipments(),
        equipmentService.getSites(),
        equipmentService.getProductionLines()
      ]);
      
      setEquipment(equipmentData);
      setSites(sitesData);
      setProductionLines(productionLinesData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEquipment = async () => {
    try {
      const data = await equipmentService.getEquipments(filters);
      setEquipment(data);
    } catch (err) {
      setError('Erreur lors du chargement des équipements');
      console.error('Error loading equipment:', err);
    }
  };

  const handleFilterChange = (key: keyof EquipmentFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
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
      <Tag color={colorMap[statusOption?.color as keyof typeof colorMap] || 'default'}>
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
      <Tag color={colorMap[criticalityOption?.color as keyof typeof colorMap] || 'default'}>
        {criticalityOption?.label || criticality}
      </Tag>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Équipements" subtitle="Gestion des équipements industriels">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Équipements" subtitle="Gestion des équipements industriels">
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={loadData}>
              Réessayer
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  // Définition des colonnes du tableau
  const columns = [
    {
      title: 'Équipement',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Equipment) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.model && `${record.model} • `}
            {record.manufacturer}
          </Text>
        </div>
      ),
    },
    {
      title: 'Site / Ligne',
      key: 'location',
      render: (record: Equipment) => {
        const site = sites.find(s => s.id === record.site_id);
        const productionLine = productionLines.find(pl => pl.id === record.production_line_id);

        return (
          <div>
            <div>{site?.name || 'Non assigné'}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {productionLine?.name || 'Aucune ligne'}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Criticité',
      dataIndex: 'criticality',
      key: 'criticality',
      render: (criticality: string) => getCriticalityTag(criticality),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Equipment) => (
        <Space>
          <Link to={`/equipments/${record.id}`}>
            <Button type="link" icon={<EyeOutlined />} size="small">
              Voir
            </Button>
          </Link>
          <Link to={`/equipments/${record.id}/edit`}>
            <Button type="link" icon={<EditOutlined />} size="small">
              Modifier
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout title="Équipements" subtitle="Gestion des équipements industriels">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* En-tête avec bouton d'ajout */}
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Text style={{ fontSize: '24px', fontWeight: 600 }}>Équipements</Text>
              <Text type="secondary">Gestion des équipements industriels</Text>
            </Space>
          </Col>
          <Col>
            <Link to="/equipments/new">
              <Button type="primary" icon={<PlusOutlined />}>
                Nouvel équipement
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Filtres */}
        <Card title="Filtres" size="small">
          <Row gutter={[16, 16]}>
            {/* Recherche */}
            <Col xs={24} sm={12} md={6}>
              <Input.Search
                placeholder="Nom, modèle, fabricant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>

            {/* Site */}
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Tous les sites"
                value={filters.site_id}
                onChange={(value) => handleFilterChange('site_id', value)}
                style={{ width: '100%' }}
                allowClear
              >
                {sites.map(site => (
                  <Option key={site.id} value={site.id}>
                    {site.name}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Statut */}
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Tous les statuts"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                style={{ width: '100%' }}
                allowClear
              >
                {EQUIPMENT_STATUS_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Criticité */}
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Toutes les criticités"
                value={filters.criticality}
                onChange={(value) => handleFilterChange('criticality', value)}
                style={{ width: '100%' }}
                allowClear
              >
                {EQUIPMENT_CRITICALITY_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Divider />

          <Row justify="space-between" align="middle">
            <Col>
              <Text type="secondary">
                {equipment.length} équipement(s) trouvé(s)
              </Text>
            </Col>
            <Col>
              <Button
                type="link"
                icon={<ClearOutlined />}
                onClick={clearFilters}
                size="small"
              >
                Effacer les filtres
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tableau des équipements */}
        <Card>
          <Table
            columns={columns}
            dataSource={equipment}
            rowKey="id"
            pagination={{
              total: equipment.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} sur ${total} équipements`,
            }}
            locale={{
              emptyText: 'Aucun équipement trouvé'
            }}
          />
        </Card>
      </Space>
    </DashboardLayout>
  );
};

export default EquipmentListPage;
