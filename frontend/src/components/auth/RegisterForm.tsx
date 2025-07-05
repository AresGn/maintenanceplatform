// Composant de formulaire d'inscription
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Card, Typography, Space, Alert, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterRequest } from '../../types/auth';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'supervisor' | 'technician';
}

export const RegisterForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const userData: RegisterRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role
      };

      await registerUser(userData);

      // Redirection après inscription réussie
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrateur', description: 'Accès complet à la plateforme' },
    { value: 'supervisor', label: 'Superviseur', description: 'Gestion et supervision des opérations' },
    { value: 'technician', label: 'Technicien', description: 'Exécution des tâches de maintenance' }
  ];

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
          maxWidth: '500px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            🔧 Maintenance Platform
          </Title>
          <Text type="secondary">
            Créez votre compte
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
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              label="Prénom"
              name="firstName"
              style={{ width: '50%', marginRight: '8px' }}
              rules={[
                { required: true, message: 'Le prénom est requis' },
                { min: 2, message: 'Le prénom doit contenir au moins 2 caractères' }
              ]}
            >
              <Input
                size="large"
                placeholder="Prénom"
              />
            </Form.Item>

            <Form.Item
              label="Nom"
              name="lastName"
              style={{ width: '50%' }}
              rules={[
                { required: true, message: 'Le nom est requis' },
                { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
              ]}
            >
              <Input
                size="large"
                placeholder="Nom"
              />
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Nom d'utilisateur"
            name="username"
            rules={[
              { required: true, message: 'Le nom d\'utilisateur est requis' },
              { min: 3, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Seuls les lettres, chiffres et underscore sont autorisés' }
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Nom d'utilisateur unique"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'L\'email est requis' },
              { type: 'email', message: 'Format d\'email invalide' }
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="votre.email@exemple.com"
            />
          </Form.Item>

          <Form.Item
            label="Rôle"
            name="role"
            rules={[{ required: true, message: 'Le rôle est requis' }]}
          >
            <Select
              size="large"
              placeholder="Sélectionnez votre rôle"
            >
              {roleOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{option.label}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{option.description}</div>
                  </div>
                </Option>
              ))}
            </Select>
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
              placeholder="Mot de passe (min. 6 caractères)"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            label="Confirmer le mot de passe"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'La confirmation du mot de passe est requise' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Confirmez votre mot de passe"
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
              {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Text type="secondary">
            Déjà un compte ?{' '}
            <Link to="/login" style={{ fontWeight: '500' }}>
              Se connecter
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};
