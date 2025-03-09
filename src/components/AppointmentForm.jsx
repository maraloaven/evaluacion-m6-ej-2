import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import indexedDBService from '../services/indexedDB';

const AppointmentForm = ({ onAppointmentAdded, appointmentToEdit, onUpdate, onCancel }) => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    status: 'pendiente'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorsList = await indexedDBService.getAllDoctors();
      setDoctors(doctorsList);
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    if (appointmentToEdit) {
      setIsEditing(true);
      
      const dateObj = new Date(appointmentToEdit.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      
      setFormData({
        patientName: appointmentToEdit.patientName,
        doctorId: appointmentToEdit.doctorId,
        date: formattedDate,
        time: formattedTime,
        reason: appointmentToEdit.reason,
        status: appointmentToEdit.status
      });
    } else {
      setIsEditing(false);
      setFormData({
        patientName: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        status: 'pendiente'
      });
    }
  }, [appointmentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    const [year, month, day] = formData.date.split('-');
    const [hours, minutes] = formData.time.split(':');
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    
    const appointmentData = {
      patientName: formData.patientName,
      doctorId: parseInt(formData.doctorId),
      date: appointmentDate,
      reason: formData.reason,
      status: formData.status
    };
    
    try {
      if (isEditing && appointmentToEdit) {
        await indexedDBService.updateAppointment(appointmentToEdit.id, appointmentData);
        onUpdate && onUpdate();
      } else {
        await indexedDBService.addAppointment(appointmentData);
        onAppointmentAdded && onAppointmentAdded();
      }
      
      setFormData({
        patientName: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        status: 'pendiente'
      });
      setValidated(false);
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      alert('No se pudo guardar la cita. Intente nuevamente.');
    }
  };
  
  const handleCancel = () => {
    setFormData({
      patientName: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      status: 'pendiente'
    });
    setValidated(false);
    onCancel && onCancel();
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">{isEditing ? 'Editar Cita' : 'Nueva Cita'}</Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Paciente</Form.Label>
            <Form.Control
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              placeholder="Nombre completo del paciente"
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingrese el nombre del paciente.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Doctor</Form.Label>
            <Form.Select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor seleccione un doctor.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor seleccione una fecha.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor seleccione una hora.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Motivo de la consulta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="Describa brevemente el motivo de la consulta"
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingrese el motivo de la consulta.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor seleccione un estado.
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Actualizar' : 'Agendar'} Cita
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AppointmentForm;