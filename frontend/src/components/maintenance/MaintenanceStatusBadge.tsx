import React from 'react';
import { Tag } from 'antd';
import { 
  MaintenanceStatus, 
  InterventionStatus, 
  MAINTENANCE_STATUS_OPTIONS, 
  INTERVENTION_STATUS_OPTIONS 
} from '../../types/maintenance';

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus | InterventionStatus;
  type?: 'maintenance' | 'intervention';
}

export const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({ 
  status, 
  type = 'maintenance' 
}) => {
  const getStatusConfig = () => {
    if (type === 'intervention') {
      const config = INTERVENTION_STATUS_OPTIONS.find(option => option.value === status);
      return config || { label: status, color: 'default' };
    } else {
      const config = MAINTENANCE_STATUS_OPTIONS.find(option => option.value === status);
      return config || { label: status, color: 'default' };
    }
  };

  const config = getStatusConfig();

  return (
    <Tag color={config.color}>
      {config.label}
    </Tag>
  );
};
