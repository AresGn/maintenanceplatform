// Composant formulaire pour les équipements
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  Button,
  Space,
  message,
  Divider,
  Typography
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { FileUpload } from '../common';
import { equipmentService } from '../../services/equipmentService';
import { UploadResponse } from '../../services/uploadService';
import {
  Equipment,
  EquipmentCreate,
  EquipmentUpdate,
  Site,
  ProductionLine,
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_CRITICALITY_OPTIONS
} from '../../types/equipment';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: EquipmentCreate | EquipmentUpdate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipment,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false
}) => {
  const [form] = Form.useForm();
  const [sites, setSites] = useState<Site[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [filteredProductionLines, setFilteredProductionLines] = useState<ProductionLine[]>([]);
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([]);
  const [documents, setDocuments] = useState<UploadResponse[]>([]);
  const [images, setImages] = useState<UploadResponse[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (equipment) {
      // Pré-remplir le formulaire en mode édition
      const formData = {
        ...equipment,
        purchase_date: equipment.purchase_date ? dayjs(equipment.purchase_date) : undefined,
        installation_date: equipment.installation_date ? dayjs(equipment.installation_date) : undefined,
        warranty_expiry: equipment.warranty_expiry ? dayjs(equipment.warranty_expiry) : undefined,
      };
      
      form.setFieldsValue(formData);
      
      // Charger les spécifications
      if (equipment.specifications) {
        const specs = Object.entries(equipment.specifications).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        setSpecifications(specs);
      }
    }
  }, [equipment, form]);

  const loadInitialData = async () => {
    try {
      const [sitesData, productionLinesData] = await Promise.all([
        equipmentService.getSites(),
        equipmentService.getProductionLines()
      ]);
      
      setSites(sitesData);
      setProductionLines(productionLinesData);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
    }
  };

  const handleSiteChange = (siteId: number) => {
    // Filtrer les lignes de production par site
    const filtered = productionLines.filter(line => line.site_id === siteId);
    setFilteredProductionLines(filtered);
    
    // Réinitialiser la ligne de production sélectionnée
    form.setFieldValue('production_line_id', undefined);
  };

  const handleSpecificationAdd = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleSpecificationRemove = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Convertir les dates en format string
      const formattedValues = {
        ...values,
        purchase_date: values.purchase_date ? values.purchase_date.format('YYYY-MM-DD') : undefined,
        installation_date: values.installation_date ? values.installation_date.format('YYYY-MM-DD') : undefined,
        warranty_expiry: values.warranty_expiry ? values.warranty_expiry.format('YYYY-MM-DD') : undefined,
      };

      // Ajouter les spécifications
      if (specifications.length > 0) {
        const specsObject: Record<string, string> = {};
        specifications.forEach(spec => {
          if (spec.key.trim() && spec.value.trim()) {
            specsObject[spec.key.trim()] = spec.value.trim();
          }
        });
        formattedValues.specifications = specsObject;
      }

      await onSubmit(formattedValues);
    } catch (error) {
      message.error('Erreur lors de la soumission du formulaire');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 'active',
        criticality: 'medium'
      }}
    >
      <Row gutter={[16, 16]}>
        {/* Informations de base */}
        <Col span={24}>
          <Card title="Informations générales" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Nom de l'équipement"
                  rules={[{ required: true, message: 'Le nom est obligatoire' }]}
                >
                  <Input placeholder="Ex: Pompe hydraulique P1" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="model"
                  label="Modèle"
                >
                  <Input placeholder="Ex: KUKA KR 6 R900" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="serial_number"
                  label="Numéro de série"
                >
                  <Input placeholder="Ex: KR6-001-2023" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="manufacturer"
                  label="Fabricant"
                >
                  <Input placeholder="Ex: KUKA" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Localisation */}
        <Col span={24}>
          <Card title="Localisation" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="site_id"
                  label="Site"
                >
                  <Select
                    placeholder="Sélectionner un site"
                    onChange={handleSiteChange}
                    allowClear
                  >
                    {sites.map(site => (
                      <Option key={site.id} value={site.id}>
                        {site.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="production_line_id"
                  label="Ligne de production"
                >
                  <Select
                    placeholder="Sélectionner une ligne"
                    disabled={!form.getFieldValue('site_id')}
                    allowClear
                  >
                    {filteredProductionLines.map(line => (
                      <Option key={line.id} value={line.id}>
                        {line.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Statut et criticité */}
        <Col span={24}>
          <Card title="État et criticité" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[{ required: true, message: 'Le statut est obligatoire' }]}
                >
                  <Select>
                    {EQUIPMENT_STATUS_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="criticality"
                  label="Criticité"
                  rules={[{ required: true, message: 'La criticité est obligatoire' }]}
                >
                  <Select>
                    {EQUIPMENT_CRITICALITY_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Dates */}
        <Col span={24}>
          <Card title="Dates importantes" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="purchase_date"
                  label="Date d'achat"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="installation_date"
                  label="Date d'installation"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="warranty_expiry"
                  label="Fin de garantie"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="expected_lifespan"
                  label="Durée de vie prévue (années)"
                >
                  <InputNumber
                    min={1}
                    max={50}
                    style={{ width: '100%' }}
                    placeholder="Ex: 10"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Spécifications techniques */}
        <Col span={24}>
          <Card
            title="Spécifications techniques"
            size="small"
            extra={
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="small"
                onClick={handleSpecificationAdd}
              >
                Ajouter
              </Button>
            }
          >
            {specifications.length === 0 ? (
              <Text type="secondary">Aucune spécification ajoutée</Text>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {specifications.map((spec, index) => (
                  <Row key={index} gutter={[8, 8]} align="middle">
                    <Col flex="1">
                      <Input
                        placeholder="Nom de la spécification (ex: Puissance)"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      />
                    </Col>
                    <Col flex="1">
                      <Input
                        placeholder="Valeur (ex: 5kW)"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleSpecificationRemove(index)}
                      />
                    </Col>
                  </Row>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        {/* Upload de documents */}
        <Col span={24}>
          <Card title="Documents et photos" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Documents techniques</Text>
                  <FileUpload
                    type="document"
                    value={documents}
                    onChange={setDocuments}
                    multiple={true}
                    maxCount={10}
                  />
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Photos</Text>
                  <FileUpload
                    type="image"
                    value={images}
                    onChange={setImages}
                    multiple={true}
                    maxCount={5}
                  />
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Boutons d'action */}
        <Col span={24}>
          <Divider />
          <Row justify="end">
            <Space>
              <Button onClick={onCancel}>
                Annuler
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                {isEdit ? 'Mettre à jour' : 'Créer'} l'équipement
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
