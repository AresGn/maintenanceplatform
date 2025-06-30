import React, { useState, useEffect } from 'react';
import { Card, Form, Select, DatePicker, Input, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { 
  MaintenanceFilter,
  MAINTENANCE_TYPE_OPTIONS,
  MAINTENANCE_STATUS_OPTIONS,
  INTERVENTION_STATUS_OPTIONS,
  MAINTENANCE_PRIORITY_OPTIONS
} from '../../types/maintenance';
import { Equipment } from '../../types/equipment';
import { equipmentService } from '../../services/equipmentService';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface MaintenanceFiltersProps {
  onFiltersChange: (filters: MaintenanceFilter) => void;
  initialFilters?: MaintenanceFilter;
  type?: 'scheduled' | 'intervention' | 'all';
  showEquipmentFilter?: boolean;
  showTechnicianFilter?: boolean;
  showDateFilter?: boolean;
}

export const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  type = 'all',
  showEquipmentFilter = true,
  showTechnicianFilter = true,
  showDateFilter = true
}) => {
  const [form] = Form.useForm();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);


  useEffect(() => {
    loadEquipments();
    loadTechnicians();
  }, []);

  useEffect(() => {
    form.setFieldsValue(initialFilters);
  }, [initialFilters, form]);

  const loadEquipments = async () => {
    try {
      const data = await equipmentService.getEquipments();
      setEquipments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des équipements:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      // TODO: Implémenter le service pour récupérer les techniciens
      // const data = await userService.getTechnicians();
      // setTechnicians(data);
      setTechnicians([]);
    } catch (error) {
      console.error('Erreur lors du chargement des techniciens:', error);
    }
  };

  const handleValuesChange = (_: any, allValues: any) => {
    const filters: MaintenanceFilter = {};

    if (allValues.equipment_id) {
      filters.equipment_id = allValues.equipment_id;
    }

    if (allValues.technician_id) {
      filters.technician_id = allValues.technician_id;
    }

    if (allValues.maintenance_type) {
      filters.maintenance_type = allValues.maintenance_type;
    }

    if (allValues.status) {
      filters.status = allValues.status;
    }

    if (allValues.priority) {
      filters.priority = allValues.priority;
    }

    if (allValues.dateRange && allValues.dateRange.length === 2) {
      filters.date_from = allValues.dateRange[0].format('YYYY-MM-DD');
      filters.date_to = allValues.dateRange[1].format('YYYY-MM-DD');
    }

    if (allValues.search) {
      filters.search = allValues.search;
    }

    onFiltersChange(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFiltersChange({});
  };

  const getStatusOptions = () => {
    if (type === 'scheduled') {
      return MAINTENANCE_STATUS_OPTIONS;
    } else if (type === 'intervention') {
      return INTERVENTION_STATUS_OPTIONS;
    } else {
      return [...MAINTENANCE_STATUS_OPTIONS, ...INTERVENTION_STATUS_OPTIONS];
    }
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={initialFilters}
      >
        <Row gutter={16}>
          {showEquipmentFilter && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="equipment_id" label="Équipement">
                <Select
                  placeholder="Sélectionner un équipement"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toString().toLowerCase().includes(input.toLowerCase())) || false
                  }
                >
                  {equipments.map(equipment => (
                    <Option key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {showTechnicianFilter && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="technician_id" label="Technicien">
                <Select
                  placeholder="Sélectionner un technicien"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {technicians.map(technician => (
                    <Option key={technician.id} value={technician.id}>
                      {`${technician.first_name} ${technician.last_name}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="maintenance_type" label="Type de maintenance">
              <Select placeholder="Sélectionner un type" allowClear>
                {MAINTENANCE_TYPE_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="status" label="Statut">
              <Select placeholder="Sélectionner un statut" allowClear>
                {getStatusOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="priority" label="Priorité">
              <Select placeholder="Sélectionner une priorité" allowClear>
                {MAINTENANCE_PRIORITY_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {showDateFilter && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="dateRange" label="Période">
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['Date début', 'Date fin']}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="search" label="Recherche">
              <Input
                placeholder="Rechercher..."
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Space>
                <Button 
                  icon={<ClearOutlined />} 
                  onClick={handleReset}
                >
                  Réinitialiser
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
