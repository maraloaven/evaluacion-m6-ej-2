import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table } from 'react-bootstrap';
import indexedDBService from '../services/indexedDB';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: ''
  });
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    let isMounted = true; 
    
    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        const doctorsList = await indexedDBService.getAllDoctors();
        
        if (isMounted) {
          setDoctors(doctorsList);
        }
      } catch (error) {
        console.error('Error al cargar doctores:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDoctors();
    
    return () => {
      isMounted = false; 
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone
    });
  };

  const cancelEditing = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialty: '',
      email: '',
      phone: ''
    });
    setValidated(false);
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    try {
      if (editingDoctor) {
        await indexedDBService.updateDoctor(editingDoctor.id, formData);
        
        setDoctors(prev => 
          prev.map(doc => 
            doc.id === editingDoctor.id ? { ...doc, ...formData } : doc
          )
        );
        
        setEditingDoctor(null);
      } else {
        const newDoctorId = await indexedDBService.addDoctor(formData);
        
        setDoctors(prev => [...prev, { id: newDoctorId, ...formData }]);
      }
      
      setFormData({
        name: '',
        specialty: '',
        email: '',
        phone: ''
      });
      setValidated(false);
    } catch (error) {
      console.error('Error al guardar doctor:', error);
      alert('No se pudo guardar la información del doctor. Intente nuevamente.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este doctor?')) {
      try {
        const doctorAppointments = await indexedDBService.getAppointmentsByDoctor(id);
        
        if (doctorAppointments.length > 0) {
          alert(`No se puede eliminar este doctor porque tiene ${doctorAppointments.length} citas asignadas.`);
          return;
        }
        
        await indexedDBService.deleteDoctor(id);
        
        setDoctors(prev => prev.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error al eliminar doctor:', error);
        alert('No se pudo eliminar el doctor. Intente nuevamente.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando doctores...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col md={4} lg={3}>
        <Card className="mb-4">
          <Card.Header as="h5">{editingDoctor ? 'Editar Doctor' : 'Añadir Nuevo Doctor'}</Card.Header>
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nombre completo"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese el nombre.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Especialidad</Form.Label>
                <Form.Control
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  placeholder="Especialidad médica"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese la especialidad.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese un email válido.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="555-1234"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese un teléfono.
                </Form.Control.Feedback>
              </Form.Group>
              
              <div className="d-flex justify-content-end gap-2 mt-4">
                {editingDoctor && (
                  <Button variant="secondary" onClick={cancelEditing}>
                    Cancelar
                  </Button>
                )}
                <Button variant="primary" type="submit">
                  {editingDoctor ? 'Actualizar' : 'Añadir'} Doctor
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={8} lg={9}>
        <Card>
          <Card.Header as="h5">Lista de Doctores</Card.Header>
          <Card.Body>
            {doctors.length === 0 ? (
              <div className="text-center my-5">
                <p className="text-muted">No hay doctores registrados</p>
              </div>
            ) : (
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialty}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.phone}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => startEditing(doctor)} 
                            title="Editar doctor"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(doctor.id)} 
                            title="Eliminar doctor"
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
      </Col>
    </Row>
  );
};

export default DoctorList;