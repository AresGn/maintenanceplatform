import React, { useState } from 'react';
import { List, Checkbox, Input, Button, Space, Typography, Card, Divider } from 'antd';
import { CheckOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { InterventionTask } from '../../types/maintenance';

const { TextArea } = Input;
const { Text } = Typography;

interface MaintenanceTaskListProps {
  tasks: InterventionTask[];
  onTaskUpdate: (taskId: number, updates: Partial<InterventionTask>) => void;
  readOnly?: boolean;
  showProgress?: boolean;
}

export const MaintenanceTaskList: React.FC<MaintenanceTaskListProps> = ({
  tasks,
  onTaskUpdate,
  readOnly = false,
  showProgress = true
}) => {
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const completedTasks = tasks.filter(task => task.is_completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskToggle = (task: InterventionTask) => {
    if (readOnly) return;
    
    const updates: Partial<InterventionTask> = {
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : undefined
    };
    
    onTaskUpdate(task.id, updates);
  };

  const handleEditNotes = (task: InterventionTask) => {
    setEditingTask(task.id);
    setEditNotes(task.completion_notes || '');
  };

  const handleSaveNotes = (task: InterventionTask) => {
    onTaskUpdate(task.id, { completion_notes: editNotes });
    setEditingTask(null);
    setEditNotes('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditNotes('');
  };

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <Card 
      title="Checklist des tâches"
      extra={
        showProgress && (
          <Text>
            Progression: {completedTasks}/{totalTasks} ({progressPercent}%)
          </Text>
        )
      }
    >
      {showProgress && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            width: '100%', 
            height: 8, 
            backgroundColor: '#f0f0f0', 
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent === 100 ? '#52c41a' : '#1890ff',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      <List
        dataSource={sortedTasks}
        renderItem={(task) => (
          <List.Item
            style={{
              padding: '12px 0',
              opacity: task.is_completed ? 0.7 : 1
            }}
          >
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
                <Checkbox
                  checked={task.is_completed}
                  onChange={() => handleTaskToggle(task)}
                  disabled={readOnly}
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Text 
                    strong={!task.is_completed}
                    delete={task.is_completed}
                    style={{ fontSize: '14px' }}
                  >
                    {task.name}
                  </Text>
                  {task.description && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {task.description}
                      </Text>
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditNotes(task)}
                    title="Ajouter des notes"
                  />
                )}
              </div>

              {task.is_completed && task.completed_at && (
                <div style={{ marginLeft: 24, marginBottom: 8 }}>
                  <Text type="success" style={{ fontSize: '12px' }}>
                    <CheckOutlined style={{ marginRight: 4 }} />
                    Terminée le {new Date(task.completed_at).toLocaleString('fr-FR')}
                  </Text>
                </div>
              )}

              {editingTask === task.id ? (
                <div style={{ marginLeft: 24 }}>
                  <TextArea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Notes sur la réalisation de cette tâche..."
                    rows={3}
                    style={{ marginBottom: 8 }}
                  />
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      icon={<SaveOutlined />}
                      onClick={() => handleSaveNotes(task)}
                    >
                      Sauvegarder
                    </Button>
                    <Button
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={handleCancelEdit}
                    >
                      Annuler
                    </Button>
                  </Space>
                </div>
              ) : (
                task.completion_notes && (
                  <div style={{ 
                    marginLeft: 24, 
                    padding: 8, 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 4,
                    border: '1px solid #e8e8e8'
                  }}>
                    <Text style={{ fontSize: '12px' }}>
                      <strong>Notes:</strong> {task.completion_notes}
                    </Text>
                  </div>
                )
              )}
            </div>
          </List.Item>
        )}
      />

      {totalTasks === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          Aucune tâche définie pour cette intervention
        </div>
      )}

      {showProgress && totalTasks > 0 && (
        <>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            {progressPercent === 100 ? (
              <Text type="success">
                <CheckOutlined style={{ marginRight: 8 }} />
                Toutes les tâches sont terminées !
              </Text>
            ) : (
              <Text type="secondary">
                {totalTasks - completedTasks} tâche{totalTasks - completedTasks > 1 ? 's' : ''} restante{totalTasks - completedTasks > 1 ? 's' : ''}
              </Text>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
