// Widget d'alertes
import React from 'react';
import { Card, List, Badge, Typography, Empty, Button } from 'antd';
import { 
  ExclamationCircleOutlined, 
  WarningOutlined, 
  InfoCircleOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import { AlertItem } from '../../../types/dashboard';

const { Text, Title } = Typography;

interface AlertsWidgetProps {
  alerts: AlertItem[];
  loading?: boolean;
  showAll?: boolean;
  onViewAll?: () => void;
}

export const AlertsWidget: React.FC<AlertsWidgetProps> = ({
  alerts,
  loading = false,
  showAll = false,
  onViewAll
}) => {
  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#666' }} />;
    }
  };

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical': return '#ff4d4f';
      case 'warning': return '#faad14';
      case 'info': return '#1890ff';
      default: return '#666';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Alertes récentes
          </Title>
          {alerts.length > 0 && (
            <Badge count={alerts.length} style={{ backgroundColor: '#ff4d4f' }} />
          )}
        </div>
      }
      extra={
        !showAll && alerts.length > 5 && onViewAll && (
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={onViewAll}
            size="small"
          >
            Voir tout
          </Button>
        )
      }
      style={{ height: '100%' }}
    >
      {alerts.length === 0 ? (
        <Empty
          description="Aucune alerte"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '20px 0' }}
        />
      ) : (
        <List
          loading={loading}
          dataSource={displayedAlerts}
          renderItem={(alert) => (
            <List.Item
              style={{
                borderLeft: `3px solid ${getAlertColor(alert.type)}`,
                paddingLeft: '12px',
                marginBottom: '8px',
                backgroundColor: '#fafafa',
                borderRadius: '4px'
              }}
            >
              <List.Item.Meta
                avatar={getAlertIcon(alert.type)}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ color: getAlertColor(alert.type) }}>
                      {alert.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatTimestamp(alert.timestamp)}
                    </Text>
                  </div>
                }
                description={
                  <div>
                    <Text style={{ fontSize: '13px' }}>{alert.description}</Text>
                    {alert.equipment && (
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Équipement: {alert.equipment}
                        </Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};
