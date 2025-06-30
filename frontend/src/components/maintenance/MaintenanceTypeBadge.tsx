import React from 'react';
import { Tag } from 'antd';
import { MaintenanceType, MAINTENANCE_TYPE_OPTIONS } from '../../types/maintenance';

interface MaintenanceTypeBadgeProps {
  type: MaintenanceType;
}

export const MaintenanceTypeBadge: React.FC<MaintenanceTypeBadgeProps> = ({ type }) => {
  const config = MAINTENANCE_TYPE_OPTIONS.find(option => option.value === type);
  
  if (!config) {
    return <Tag>{type}</Tag>;
  }

  return (
    <Tag color={config.color}>
      {config.label}
    </Tag>
  );
};
