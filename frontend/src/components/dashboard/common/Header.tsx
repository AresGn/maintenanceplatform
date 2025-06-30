// Header du tableau de bord
import React from 'react';
import { Layout, Typography, Space, Button, Avatar, Dropdown, Badge } from 'antd';
import { 
  LogoutOutlined, 
  SettingOutlined, 
  BellOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Header: React.FC<DashboardHeaderProps> = ({ title, subtitle, collapsed, onCollapse }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ff4d4f';
      case 'supervisor': return '#1890ff';
      case 'technician': return '#52c41a';
      default: return '#666';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'supervisor': return 'Superviseur';
      case 'technician': return 'Technicien';
      default: return role;
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mon profil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Paramètres',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      onClick: handleLogout,
    },
  ];

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <AntHeader
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        padding: isMobile ? '0 20px' : '0 40px',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div style={{
        flex: 1,
        minWidth: 0,
        paddingRight: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: subtitle ? '4px' : '0'
        }}>
          <div style={{
            fontSize: isMobile ? '24px' : '28px',
            lineHeight: 1
          }}>
            🔧
          </div>
          <Title level={isMobile ? 4 : 3} style={{
            margin: 0,
            color: '#1890ff',
            fontSize: isMobile ? '20px' : '26px',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.5px'
          }}>
            {title}
          </Title>
        </div>
        {subtitle && (
          <Text style={{
            fontSize: isMobile ? '13px' : '15px',
            color: '#8c8c8c',
            fontWeight: '500',
            marginLeft: isMobile ? '36px' : '40px',
            lineHeight: '1.3'
          }}>
            {subtitle}
          </Text>
        )}
      </div>

      <Space size="large" align="center">
        {/* Notifications */}
        <Badge count={3} size="small" offset={[-2, 2]}>
          <Button
            type="text"
            icon={<BellOutlined />}
            size="large"
            style={{
              color: '#666',
              fontSize: '18px',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#666';
            }}
          />
        </Badge>

        {/* Séparateur visuel */}
        <div style={{
          width: '1px',
          height: '32px',
          backgroundColor: '#e8e8e8',
          margin: '0 8px'
        }} />

        {/* Menu utilisateur */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div style={{
            cursor: 'pointer',
            padding: '10px 18px',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid transparent',
            minWidth: isMobile ? '140px' : '220px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(24, 144, 255, 0.04)';
            e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <Avatar
              style={{
                backgroundColor: getRoleColor(user?.role || ''),
                color: 'white',
                flexShrink: 0
              }}
              icon={<UserOutlined />}
              size={isMobile ? 'default' : 'large'}
            />
            <div style={{
              textAlign: 'left',
              minWidth: 0,
              flex: 1,
              lineHeight: '1.3'
            }}>
              <div style={{
                fontWeight: '600',
                fontSize: isMobile ? '13px' : '15px',
                color: '#262626',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '2px'
              }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div
                style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: getRoleColor(user?.role || ''),
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {getRoleLabel(user?.role || '')}
              </div>
            </div>
            {/* Icône de dropdown */}
            <div style={{
              fontSize: '12px',
              color: '#bfbfbf',
              flexShrink: 0,
              marginLeft: '4px'
            }}>
              ▼
            </div>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};
