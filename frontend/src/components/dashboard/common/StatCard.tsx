// Composant de carte de statistique réutilisable
import React from 'react';
import { Card, Statistic, Skeleton } from 'antd';
import { StatCardProps } from '../../../types/dashboard';

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  suffix,
  prefix,
  loading = false
}) => {
  return (
    <Card
      style={{
        borderLeft: `4px solid ${color}`,
        height: '120px',
        minHeight: '120px'
      }}
      bodyStyle={{ padding: '16px', height: '100%' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 0
      }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} />
          ) : (
            <Statistic
              title={title}
              value={value}
              valueStyle={{
                color: color,
                fontSize: '20px',
                fontWeight: 'bold',
                lineHeight: 1.2
              }}
              suffix={suffix}
              prefix={prefix}
            />
          )}
        </div>
        <div
          style={{
            fontSize: '28px',
            color: color,
            opacity: 0.8,
            marginLeft: '12px',
            flexShrink: 0
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
