import React from 'react';
import { Card, Typography, Space, Button, Tooltip, Divider } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  ToolOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { ScheduledMaintenance, MaintenanceIntervention } from '../../types/maintenance';
import { MaintenanceStatusBadge } from './MaintenanceStatusBadge';
import { MaintenancePriorityBadge } from './MaintenancePriorityBadge';
import { MaintenanceTypeBadge } from './MaintenanceTypeBadge';

const { Text, Title } = Typography;

interface MaintenanceCardProps {
  maintenance: ScheduledMaintenance | MaintenanceIntervention;
  type: 'scheduled' | 'intervention';
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStart?: (id: number) => void;
  onComplete?: (id: number) => void;
  onValidate?: (id: number) => void;
  showActions?: boolean;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  maintenance,
  type,
  onEdit,
  onDelete,
  onStart,
  onComplete,
  onValidate,
  showActions = true
}) => {
  const isScheduled = type === 'scheduled';
  const scheduledMaintenance = maintenance as ScheduledMaintenance;
  const intervention = maintenance as MaintenanceIntervention;

  const getMaintenanceType = () => {
    if (isScheduled) {
      return scheduledMaintenance.maintenance_plan?.maintenance_type || 'preventive';
    }
    return intervention.maintenance_type;
  };

  const getEquipmentName = () => {
    return maintenance.equipment?.name || `Équipement #${maintenance.equipment_id}`;
  };

  const getTechnicianName = () => {
    if (isScheduled) {
      const tech = scheduledMaintenance.assigned_technician;
      return tech ? `${tech.first_name} ${tech.last_name}` : 'Non assigné';
    } else {
      const tech = intervention.technician;
      return tech ? `${tech.first_name} ${tech.last_name}` : 'Non assigné';
    }
  };

  const getDateInfo = () => {
    if (isScheduled) {
      return {
        date: new Date(scheduledMaintenance.scheduled_date).toLocaleDateString('fr-FR'),
        time: `${scheduledMaintenance.estimated_start_time} - ${scheduledMaintenance.estimated_end_time}`
      };
    } else {
      const scheduledDate = intervention.scheduled_date 
        ? new Date(intervention.scheduled_date).toLocaleDateString('fr-FR')
        : 'Non planifiée';
      const actualTime = intervention.actual_start_time && intervention.actual_end_time
        ? `${intervention.actual_start_time} - ${intervention.actual_end_time}`
        : 'Non renseigné';
      return {
        date: scheduledDate,
        time: actualTime
      };
    }
  };

  const renderActions = () => {
    if (!showActions) return undefined;

    const actions = [];

    if (onEdit) {
      actions.push(
        <Tooltip key="edit" title="Modifier">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(maintenance.id)}
          />
        </Tooltip>
      );
    }

    if (isScheduled && onStart && scheduledMaintenance.status === 'scheduled') {
      actions.push(
        <Tooltip key="start" title="Démarrer">
          <Button 
            type="text" 
            icon={<PlayCircleOutlined />} 
            onClick={() => onStart(maintenance.id)}
          />
        </Tooltip>
      );
    }

    if (!isScheduled && onComplete && intervention.status === 'in_progress') {
      actions.push(
        <Tooltip key="complete" title="Terminer">
          <Button 
            type="text" 
            icon={<CheckCircleOutlined />} 
            onClick={() => onComplete(maintenance.id)}
          />
        </Tooltip>
      );
    }

    if (!isScheduled && onValidate && intervention.status === 'completed') {
      actions.push(
        <Tooltip key="validate" title="Valider">
          <Button 
            type="text" 
            icon={<CheckCircleOutlined />} 
            onClick={() => onValidate(maintenance.id)}
          />
        </Tooltip>
      );
    }

    if (onDelete) {
      actions.push(
        <Tooltip key="delete" title="Supprimer">
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(maintenance.id)}
          />
        </Tooltip>
      );
    }

    return actions;
  };

  const dateInfo = getDateInfo();

  return (
    <Card
      size="small"
      actions={renderActions()}
      style={{ marginBottom: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={5} style={{ margin: 0 }}>
              {getEquipmentName()}
            </Title>
            <Space>
              <MaintenanceTypeBadge type={getMaintenanceType()} />
              <MaintenancePriorityBadge priority={maintenance.priority} />
            </Space>
          </div>
          
          <MaintenanceStatusBadge 
            status={maintenance.status} 
            type={type === 'scheduled' ? 'maintenance' : 'intervention'} 
          />
        </Space>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <Text>{dateInfo.date}</Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          <Text>{dateInfo.time}</Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          <Text>{getTechnicianName()}</Text>
        </div>

        {isScheduled && scheduledMaintenance.maintenance_plan && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ToolOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
            <Text>{scheduledMaintenance.maintenance_plan.name}</Text>
          </div>
        )}

        {!isScheduled && intervention.description && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {intervention.description.length > 100 
                ? `${intervention.description.substring(0, 100)}...` 
                : intervention.description
              }
            </Text>
          </div>
        )}

        {(isScheduled ? scheduledMaintenance.notes : null) && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <strong>Notes:</strong> {isScheduled && scheduledMaintenance.notes && scheduledMaintenance.notes.length > 100
                ? `${scheduledMaintenance.notes.substring(0, 100)}...`
                : scheduledMaintenance.notes
              }
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};
