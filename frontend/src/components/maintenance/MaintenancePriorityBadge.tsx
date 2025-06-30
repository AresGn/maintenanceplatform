import React from 'react';
import { Tag } from 'antd';
import { MaintenancePriority, MAINTENANCE_PRIORITY_OPTIONS } from '../../types/maintenance';

interface MaintenancePriorityBadgeProps {
  priority: MaintenancePriority;
}

export const MaintenancePriorityBadge: React.FC<MaintenancePriorityBadgeProps> = ({ priority }) => {
  const config = MAINTENANCE_PRIORITY_OPTIONS.find(option => option.value === priority);
  
  if (!config) {
    return <Tag>{priority}</Tag>;
  }

  return (
    <Tag color={config.color}>
      {config.label}
    </Tag>
  );
};
