import { useState } from 'react';
import { Container, Row, Col, Card, Alert, ListGroup } from 'react-bootstrap';
import UserPreferences from '../components/UserPreferences';

const Settings = () => {
  const [pwaStatus, setPwaStatus] = useState({
    isUpdateAvailable: false,
    updateMessage: '',
    isInstalled: window.matchMedia('(display-mode: standalone)').matches
  });

  return (
    <Container fluid="lg">
      <Row className="mb-4">
        <Col>
          <h1 className="border-bottom pb-2">Configuración</h1>
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col lg={6}>
          <UserPreferences />
        </Col>
        
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Información de la PWA</Card.Header>
            <Card.Body>
              <p>
                <b>Estado:</b> {pwaStatus.isInstalled ? 'Instalada' : 'No instalada'}
              </p>
              
              {pwaStatus.updateMessage && (
                <Alert variant="info">
                  {pwaStatus.updateMessage}
                </Alert>
              )}
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header as="h5">Acerca de</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item><b>Aplicación:</b> Hospital Hospital PWA</ListGroup.Item>
                <ListGroup.Item><b>Versión:</b> 1.0.0</ListGroup.Item>
                <ListGroup.Item><b>Desarrollado con:</b> React, Vite, Bootstrap, IndexedDB</ListGroup.Item>
                <ListGroup.Item><b>Año:</b> 2025</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;