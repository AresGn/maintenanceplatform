import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Button, 
  Card, 
  Space, 

  List,
  Modal,
  Typography,
  Switch,
  message
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { 
  MaintenancePlanCreate, 
  MaintenancePlanUpdate,

  MAINTENANCE_TYPE_OPTIONS,
  MAINTENANCE_PRIORITY_OPTIONS
} from '../../types/maintenance';
import { Equipment } from '../../types/equipment';
import { equipmentService } from '../../services/equipmentService';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface MaintenancePlanFormProps {
  initialData?: Partial<MaintenancePlanCreate>;
  onSubmit: (data: MaintenancePlanCreate | MaintenancePlanUpdate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

interface TaskFormData {
  name: string;
  description?: string;
  estimated_duration: number;
  required_skills?: string[];
  tools_required?: string[];
  safety_requirements?: string[];
  is_mandatory: boolean;
  order: number;
}

export const MaintenancePlanForm: React.FC<MaintenancePlanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create'
}) => {
  const [form] = Form.useForm();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [tasks, setTasks] = useState<TaskFormData[]>([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<{ index: number; task: TaskFormData } | null>(null);
  const [taskForm] = Form.useForm();

  useEffect(() => {
    loadEquipments();
    if (initialData) {
      form.setFieldsValue(initialData);
      if (initialData.tasks) {
        setTasks(initialData.tasks.map((task, index) => ({
          ...task,
          order: index + 1
        })));
      }
    }
  }, [initialData, form]);

  const loadEquipments = async () => {
    try {
      const data = await equipmentService.getEquipments();
      setEquipments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des équipements:', error);
      message.error('Erreur lors du chargement des équipements');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData: MaintenancePlanCreate | MaintenancePlanUpdate = {
        ...values,
        tasks: tasks.map((task, index) => ({
          ...task,
          order: index + 1
        }))
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    taskForm.resetFields();
    setTaskModalVisible(true);
  };

  const handleEditTask = (index: number) => {
    const task = tasks[index];
    setEditingTask({ index, task });
    taskForm.setFieldsValue(task);
    setTaskModalVisible(true);
  };

  const handleDeleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleTaskSubmit = (values: TaskFormData) => {
    if (editingTask !== null) {
      // Modification d'une tâche existante
      const newTasks = [...tasks];
      newTasks[editingTask.index] = values;
      setTasks(newTasks);
    } else {
      // Ajout d'une nouvelle tâche
      setTasks([...tasks, { ...values, order: tasks.length + 1 }]);
    }
    setTaskModalVisible(false);
    setEditingTask(null);
    taskForm.resetFields();
  };



  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          maintenance_type: 'preventive',
          priority: 'medium',
          frequency_days: 30,
          estimated_duration: 60
        }}
      >
        <Card title="Informations générales" style={{ marginBottom: 16 }}>
          <Form.Item
            name="name"
            label="Nom du plan de maintenance"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input placeholder="Ex: Maintenance préventive mensuelle" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={3} 
              placeholder="Description détaillée du plan de maintenance"
            />
          </Form.Item>

          <Form.Item
            name="equipment_id"
            label="Équipement"
            rules={[{ required: true, message: 'L\'équipement est requis' }]}
          >
            <Select
              placeholder="Sélectionner un équipement"
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

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="maintenance_type"
              label="Type de maintenance"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Le type est requis' }]}
            >
              <Select placeholder="Sélectionner un type">
                {MAINTENANCE_TYPE_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label="Priorité"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'La priorité est requise' }]}
            >
              <Select placeholder="Sélectionner une priorité">
                {MAINTENANCE_PRIORITY_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="frequency_days"
              label="Fréquence (jours)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'La fréquence est requise' }]}
            >
              <InputNumber
                min={1}
                max={365}
                placeholder="30"
                style={{ width: '100%' }}
                addonAfter="jours"
              />
            </Form.Item>

            <Form.Item
              name="estimated_duration"
              label="Durée estimée (minutes)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'La durée est requise' }]}
            >
              <InputNumber
                min={1}
                max={1440}
                placeholder="60"
                style={{ width: '100%' }}
                addonAfter="min"
              />
            </Form.Item>
          </div>
        </Card>

        <Card 
          title="Tâches de maintenance"
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddTask}
            >
              Ajouter une tâche
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              Aucune tâche définie. Cliquez sur "Ajouter une tâche" pour commencer.
            </div>
          ) : (
            <List
              dataSource={tasks}
              renderItem={(task, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditTask(index)}
                    />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteTask(index)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{task.name}</Text>
                        {task.is_mandatory && <Text type="danger">(Obligatoire)</Text>}
                      </Space>
                    }
                    description={
                      <div>
                        {task.description && <p>{task.description}</p>}
                        <Text type="secondary">
                          Durée estimée: {task.estimated_duration} minutes
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Créer le plan' : 'Mettre à jour'}
            </Button>
          </Space>
        </div>
      </Form>

      <Modal
        title={editingTask ? 'Modifier la tâche' : 'Ajouter une tâche'}
        open={taskModalVisible}
        onCancel={() => {
          setTaskModalVisible(false);
          setEditingTask(null);
          taskForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleTaskSubmit}
          initialValues={{
            estimated_duration: 30,
            is_mandatory: true
          }}
        >
          <Form.Item
            name="name"
            label="Nom de la tâche"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input placeholder="Ex: Vérification des niveaux d'huile" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={3} 
              placeholder="Description détaillée de la tâche"
            />
          </Form.Item>

          <Form.Item
            name="estimated_duration"
            label="Durée estimée (minutes)"
            rules={[{ required: true, message: 'La durée est requise' }]}
          >
            <InputNumber
              min={1}
              max={480}
              style={{ width: '100%' }}
              addonAfter="min"
            />
          </Form.Item>

          <Form.Item
            name="is_mandatory"
            label="Tâche obligatoire"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setTaskModalVisible(false)}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTask ? 'Modifier' : 'Ajouter'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </>
  );
};
