import { useState, useEffect } from 'react';
import { Table, Form, Card, Badge, Button, InputGroup, ListGroup } from 'react-bootstrap';
import indexedDBService from '../services/indexedDB';
import localStorageService from '../services/localStorage';

const AppointmentList = ({ onEdit, refreshTrigger }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  useEffect(() => {
    let isMounted = true; 
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doctorsList = await indexedDBService.getAllDoctors();
        const doctorsMap = {};
        doctorsList.forEach(doctor => {
          doctorsMap[doctor.id] = doctor;
        });
        
        const appointmentsList = await indexedDBService.getAllAppointments();
        
        if (isMounted) {
          setDoctors(doctorsMap);
          setAppointments(appointmentsList);
          
          const sessionData = localStorageService.getSessionData();
          setSearchHistory(sessionData.searchHistory || []);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    
    return () => {
      isMounted = false; 
    };
  }, [refreshTrigger]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      setShowSearchHistory(true);
    } else {
      setShowSearchHistory(false);
    }
    
    if (e.key === 'Enter' && term.trim() !== '') {
      localStorageService.addToSearchHistory(term);
      const sessionData = localStorageService.getSessionData();
      setSearchHistory(sessionData.searchHistory || []);
      setShowSearchHistory(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const patientNameMatch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const doctorMatch = doctors[appointment.doctorId]?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const reasonMatch = appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    return patientNameMatch || doctorMatch || reasonMatch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      try {
        await indexedDBService.deleteAppointment(id);
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment.id !== id)
        );
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
        alert('No se pudo eliminar la cita. Intente nuevamente.');
      }
    }
  };

  const useSearchTerm = (term) => {
    setSearchTerm(term);
    setShowSearchHistory(false);
  };

  const clearSearchHistory = () => {
    localStorageService.clearSearchHistory();
    setSearchHistory([]);
    setShowSearchHistory(false);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pendiente': return 'secondary';
      case 'confirmada': return 'primary';
      case 'completada': return 'success';
      case 'cancelada': return 'danger';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando citas...</p>
      </div>
    );
  }

  return (
    <Card>
      <Card.Body>
        <div className="mb-4 position-relative">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Buscar por paciente, doctor o motivo..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyUp={handleSearch}
              onFocus={() => searchTerm && setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
            />
          </InputGroup>
          
          {showSearchHistory && searchHistory.length > 0 && (
            <Card className="position-absolute w-100 z-index-1 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center py-2">
                <span>Búsquedas recientes</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 text-decoration-none"
                  onClick={clearSearchHistory}
                >
                  Limpiar
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                {searchHistory.map((term, index) => (
                  <ListGroup.Item 
                    key={index} 
                    action 
                    onClick={() => useSearchTerm(term)}
                    className="py-2"
                  >
                    {term}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </div>
        
        {filteredAppointments.length === 0 ? (
          <div className="text-center my-5">
            <p className="text-muted">No hay citas que coincidan con su búsqueda</p>
          </div>
        ) : (
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Fecha y Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                <tr key={appointment.id} className={`status-${appointment.status}`}>
                  <td>{appointment.patientName}</td>
                  <td>{doctors[appointment.doctorId]?.name || 'Doctor no disponible'}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <Badge bg={getStatusVariant(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => onEdit(appointment)} 
                        title="Editar cita"
                      >
                        ✏️
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(appointment.id)} 
                        title="Eliminar cita"
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default AppointmentList;