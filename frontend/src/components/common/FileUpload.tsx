// Composant d'upload de fichiers personnalisé
import React, { useState } from 'react';
import {
  Upload,
  Button,
  List,
  Progress,
  message,
  Typography,
  Space,
  Popconfirm
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { uploadService, UploadResponse } from '../../services/uploadService';

const { Text } = Typography;

interface FileUploadProps {
  type: 'document' | 'image';
  multiple?: boolean;
  value?: UploadResponse[];
  onChange?: (files: UploadResponse[]) => void;
  maxCount?: number;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  multiple = true,
  value = [],
  onChange,
  maxCount,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async (file: File): Promise<boolean> => {
    // Validation du fichier
    const validation = uploadService.validateFile(file, type);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }

    try {
      setUploading(true);

      // Mode mock - créer un objet fichier simulé
      const mockUploadedFile: UploadResponse = {
        id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file) // URL temporaire pour prévisualisation
      };

      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ajouter le fichier à la liste
      const newFiles = [...value, mockUploadedFile];
      onChange?.(newFiles);

      message.success(`${file.name} ajouté avec succès`);
      return true;
    } catch (error) {
      message.error(`Erreur lors de l'ajout de ${file.name}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (fileToRemove: UploadResponse) => {
    try {
      // Mode mock - pas besoin d'appel API
      const newFiles = value.filter(file => file.id !== fileToRemove.id);
      onChange?.(newFiles);

      // Libérer l'URL temporaire si c'est un blob
      if (fileToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      message.success('Fichier supprimé');
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handlePreview = (file: UploadResponse) => {
    // Ouvrir le fichier dans un nouvel onglet
    window.open(file.url, '_blank');
  };

  const handleDownload = (file: UploadResponse) => {
    // Télécharger le fichier
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadProps: UploadProps = {
    multiple,
    fileList,
    beforeUpload: (file) => {
      handleUpload(file);
      return false; // Empêcher l'upload automatique d'Ant Design
    },
    onRemove: () => false, // Désactiver la suppression automatique
    showUploadList: false, // Nous gérons notre propre liste
    disabled: disabled || (maxCount ? value.length >= maxCount : false),
  };

  const getAccept = () => {
    if (type === 'image') {
      return 'image/*';
    } else {
      return '.pdf,.doc,.docx,.xls,.xlsx';
    }
  };

  const getUploadText = () => {
    if (type === 'image') {
      return 'Sélectionner des images';
    } else {
      return 'Sélectionner des documents';
    }
  };

  const getHelpText = () => {
    if (type === 'image') {
      return 'Formats acceptés: JPG, PNG, GIF, WEBP (max 10MB)';
    } else {
      return 'Formats acceptés: PDF, DOC, DOCX, XLS, XLSX (max 10MB)';
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* Bouton d'upload */}
      <Upload {...uploadProps} accept={getAccept()}>
        <Button 
          icon={<UploadOutlined />} 
          loading={uploading}
          disabled={disabled || (maxCount ? value.length >= maxCount : false)}
        >
          {getUploadText()}
        </Button>
      </Upload>
      
      {/* Texte d'aide */}
      <Text type="secondary" style={{ fontSize: '12px' }}>
        {getHelpText()}
        {maxCount && ` (${value.length}/${maxCount})`}
      </Text>

      {/* Liste des fichiers */}
      {value.length > 0 && (
        <List
          size="small"
          dataSource={value}
          renderItem={(file) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(file)}
                  title="Prévisualiser"
                />,
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(file)}
                  title="Télécharger"
                />,
                <Popconfirm
                  title="Supprimer ce fichier ?"
                  onConfirm={() => handleRemove(file)}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={disabled}
                    title="Supprimer"
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: '16px' }}>{uploadService.getFileIcon(file.mimeType)}</span>}
                title={file.originalName}
                description={uploadService.formatFileSize(file.size)}
              />
            </List.Item>
          )}
        />
      )}

      {/* Indicateur de progression */}
      {uploading && (
        <Progress percent={100} status="active" showInfo={false} />
      )}
    </Space>
  );
};
