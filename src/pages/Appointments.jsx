import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import localStorageService from '../services/localStorage';

const Appointments = () => {
  const [showForm, setShowForm] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [refreshList, setRefreshList] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  
  useEffect(() => {
    const sessionData = localStorageService.getSessionData();
    if (sessionData.temporaryData && sessionData.temporaryData.appointmentsViewMode) {
      setViewMode(sessionData.temporaryData.appointmentsViewMode);
    }
  }, []);
  
  useEffect(() => {
    const sessionData = localStorageService.getSessionData();
    if (!sessionData.temporaryData) {
      sessionData.temporaryData = {};
    }
    sessionData.temporaryData.appointmentsViewMode = viewMode;
    localStorageService.saveSessionData(sessionData);
  }, [viewMode]);

  const handleEdit = (appointment) => {
    setAppointmentToEdit(appointment);
    setShowForm(true);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setAppointmentToEdit(null);
  };

  const handleAppointmentUpdated = () => {
    setShowForm(false);
    setAppointmentToEdit(null);
    setRefreshList(prev => prev + 1);
  };

  return (
    <Container fluid="lg">
      <Row className="mb-4">
        <Col>
          <h1 className="border-bottom pb-2">Gestión de Citas</h1>
          <div className="d-flex gap-2 mt-3">
            {!showForm && (
              <Button 
                variant="primary"
                onClick={() => setShowForm(true)}
              >
                ➕ Nueva cita
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <AppointmentForm 
              onAppointmentAdded={handleAppointmentUpdated}
              appointmentToEdit={appointmentToEdit}
              onUpdate={handleAppointmentUpdated}
              onCancel={handleFormClose}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <AppointmentList 
            onEdit={handleEdit} 
            refreshTrigger={refreshList} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Appointments;