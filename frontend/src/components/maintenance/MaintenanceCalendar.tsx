import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Modal, message } from 'antd';
import { 
  CalendarOutlined, 
  UnorderedListOutlined, 
  AppstoreOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarEvent } from '../../types/maintenance';
import { maintenanceService } from '../../services/maintenanceService';

interface MaintenanceCalendarProps {
  filters?: {
    equipment_id?: number;
    technician_id?: number;
    maintenance_type?: string;
  };
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (eventId: string, newStart: Date, newEnd: Date) => void;
  height?: string | number;
}

export const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({
  filters = {},
  onEventClick,
  onEventDrop,
  height = 'auto'
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      const start = calendarApi.view.activeStart;
      const end = calendarApi.view.activeEnd;

      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];

      const calendarEvents = await maintenanceService.getCalendarEvents(
        startDate,
        endDate,
        filters
      );

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      message.error('Erreur lors du chargement du calendrier');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const calendarEvent: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      resource: event.extendedProps.resource,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      textColor: event.textColor,
      extendedProps: event.extendedProps
    };

    if (onEventClick) {
      onEventClick(calendarEvent);
    } else {
      // Afficher un modal par défaut avec les détails
      showEventDetails(calendarEvent);
    }
  };

  const handleEventDrop = async (dropInfo: any) => {
    const eventId = dropInfo.event.id;
    const newStart = dropInfo.event.start;
    const newEnd = dropInfo.event.end;

    try {
      if (onEventDrop) {
        await onEventDrop(eventId, newStart, newEnd);
      } else {
        // Appeler l'API pour déplacer l'événement
        await maintenanceService.moveCalendarEvent(
          eventId,
          newStart.toISOString(),
          newEnd.toISOString()
        );
      }
      
      message.success('Événement déplacé avec succès');
      loadEvents(); // Recharger les événements
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      message.error('Erreur lors du déplacement de l\'événement');
      dropInfo.revert(); // Annuler le déplacement
    }
  };

  const showEventDetails = (event: CalendarEvent) => {
    const { extendedProps } = event;
    
    Modal.info({
      title: event.title,
      width: 600,
      content: (
        <div>
          <p><strong>Type:</strong> {extendedProps?.type === 'scheduled' ? 'Maintenance planifiée' : 'Intervention'}</p>
          <p><strong>Statut:</strong> {extendedProps?.status}</p>
          <p><strong>Priorité:</strong> {extendedProps?.priority}</p>
          <p><strong>Équipement:</strong> {extendedProps?.equipment_name}</p>
          {extendedProps?.technician_name && (
            <p><strong>Technicien:</strong> {extendedProps.technician_name}</p>
          )}
          <p><strong>Début:</strong> {event.start.toLocaleString('fr-FR')}</p>
          <p><strong>Fin:</strong> {event.end?.toLocaleString('fr-FR')}</p>
        </div>
      ),
    });
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  const handleDatesSet = () => {
    // Recharger les événements quand la vue change (navigation)
    loadEvents();
  };

  const getEventColor = (event: any) => {
    const { extendedProps } = event;
    
    // Couleurs par priorité
    const priorityColors = {
      low: '#52c41a',
      medium: '#faad14',
      high: '#fa8c16',
      critical: '#f5222d'
    };

    // Couleurs par statut
    const statusColors = {
      scheduled: '#1890ff',
      in_progress: '#fa8c16',
      completed: '#52c41a',
      overdue: '#f5222d',
      cancelled: '#d9d9d9'
    };

    // Priorité d'abord, puis statut
    return priorityColors[extendedProps?.priority as keyof typeof priorityColors] ||
           statusColors[extendedProps?.status as keyof typeof statusColors] ||
           '#1890ff';
  };

  return (
    <Card 
      title={
        <Space>
          <CalendarOutlined />
          Calendrier des Maintenances
        </Space>
      }
      extra={
        <Space>
          <Button
            type={currentView === 'dayGridMonth' ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => handleViewChange('dayGridMonth')}
          >
            Mois
          </Button>
          <Button
            type={currentView === 'timeGridWeek' ? 'primary' : 'default'}
            icon={<CalendarOutlined />}
            onClick={() => handleViewChange('timeGridWeek')}
          >
            Semaine
          </Button>
          <Button
            type={currentView === 'timeGridDay' ? 'primary' : 'default'}
            icon={<ClockCircleOutlined />}
            onClick={() => handleViewChange('timeGridDay')}
          >
            Jour
          </Button>
          <Button
            type={currentView === 'listWeek' ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => handleViewChange('listWeek')}
          >
            Liste
          </Button>
        </Space>
      }
      loading={loading}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={events.map(event => ({
          ...event,
          backgroundColor: getEventColor(event),
          borderColor: getEventColor(event),
          textColor: '#fff'
        }))}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        editable={true}
        droppable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height={height}
        locale="fr"
        buttonText={{
          today: 'Aujourd\'hui',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          list: 'Liste'
        }}
        datesSet={handleDatesSet}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        allDayText="Toute la journée"
        noEventsText="Aucune maintenance planifiée"
        eventDisplay="block"
        displayEventTime={true}
        eventClassNames="maintenance-event"
      />
      
      <style>{`
        .maintenance-event {
          border-radius: 4px;
          font-size: 12px;
          padding: 2px 4px;
        }
        
        .fc-event-title {
          font-weight: 500;
        }
        
        .fc-daygrid-event {
          margin: 1px 0;
        }
        
        .fc-timegrid-event {
          border-radius: 4px;
        }
        
        .fc-list-event:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </Card>
  );
};
