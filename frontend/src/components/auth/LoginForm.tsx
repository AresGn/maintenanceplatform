// Composant de formulaire de connexion
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Card, Typography, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('Form values:', values); // Debug

      const credentials: LoginRequest = {
        username: values.username,
        password: values.password
      };

      await login(credentials);

      // Redirection après connexion réussie
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            🔧 Maintenance Platform
          </Title>
          <Text type="secondary">
            Connectez-vous à votre compte
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Nom d'utilisateur"
            name="username"
            rules={[
              { required: true, message: 'Le nom d\'utilisateur est requis' },
              { min: 3, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' }
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Entrez votre nom d'utilisateur"
            />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[
              { required: true, message: 'Le mot de passe est requis' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Entrez votre mot de passe"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              block
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Space direction="vertical" size="small">
            <Text type="secondary">
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ fontWeight: '500' }}>
                S'inscrire
              </Link>
            </Text>
            <Link to="/forgot-password" style={{ fontSize: '14px' }}>
              Mot de passe oublié ?
            </Link>
          </Space>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
            <strong>Comptes de test :</strong>
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            • Admin: admin / admin123
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            • Superviseur: super1 / super123
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            • Technicien: tech1 / tech123
          </Text>
        </div>
      </Card>
    </div>
  );
};
