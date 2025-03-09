import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import indexedDBService from '../services/indexedDB';

const Home = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const doctors = await indexedDBService.getAllDoctors();
        const appointments = await indexedDBService.getAllAppointments();
        
        const pending = appointments.filter(app => app.status === 'pendiente');
        
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        
        const todayApps = appointments.filter(app => {
          const appDate = new Date(app.date);
          return appDate >= startOfDay && appDate <= endOfDay;
        });
        
        setStats({
          totalDoctors: doctors.length,
          totalAppointments: appointments.length,
          pendingAppointments: pending.length,
          todayAppointments: todayApps.length
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };
    
    loadStats();
    
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);
    
    const checkInstallState = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFromHomeScreen = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isFromHomeScreen);
    };
    
    checkInstallState();
    window.addEventListener('appinstalled', checkInstallState);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
      window.removeEventListener('appinstalled', checkInstallState);
    };
  }, []);

  return (
    <Container>
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-4 text-primary mb-3">Bienvenido al Hospital Hospital</h1>
          <p className="lead mb-4">Sistema de gestión de citas y personal médico</p>
          
          {!isInstalled && (
            <Alert variant="info">
              <Alert.Heading>Instala esta aplicación</Alert.Heading>
              <p>Para un acceso más rápido y uso sin conexión, instala esta aplicación en tu dispositivo.</p>
            </Alert>
          )}
          
          {!isOnline && (
            <Alert variant="warning">
              <p className="mb-0">Estás navegando sin conexión. Algunas funciones pueden estar limitadas.</p>
            </Alert>
          )}
        </Col>
      </Row>

      <h2 className="mb-4 border-bottom pb-2">Estadísticas</h2>
      <Row className="mb-5">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="display-4 text-primary">{stats.totalDoctors}</Card.Title>
              <Card.Text>Doctores</Card.Text>
              <Link to="/doctores" className="btn btn-outline-primary btn-sm">Ver todos</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="display-4 text-primary">{stats.totalAppointments}</Card.Title>
              <Card.Text>Citas totales</Card.Text>
              <Link to="/citas" className="btn btn-outline-primary btn-sm">Ver todas</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100 border-danger">
            <Card.Body>
              <Card.Title className="display-4 text-danger">{stats.pendingAppointments}</Card.Title>
              <Card.Text>Citas pendientes</Card.Text>
              <Link to="/citas" className="btn btn-outline-danger btn-sm">Gestionar</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="display-4 text-primary">{stats.todayAppointments}</Card.Title>
              <Card.Text>Citas para hoy</Card.Text>
              <Link to="/citas" className="btn btn-outline-primary btn-sm">Ver detalles</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-4 border-bottom pb-2">Acciones rápidas</h2>
      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">📅</div>
              <Card.Title>Crear nueva cita</Card.Title>
              <Card.Text>Agendar una nueva cita médica</Card.Text>
              <Link to="/citas" className="btn btn-primary">Crear cita</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">👨‍⚕️</div>
              <Card.Title>Añadir doctor</Card.Title>
              <Card.Text>Registrar un nuevo médico</Card.Text>
              <Link to="/doctores" className="btn btn-primary">Añadir doctor</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">⚙️</div>
              <Card.Title>Configuración</Card.Title>
              <Card.Text>Personalizar preferencias</Card.Text>
              <Link to="/configuracion" className="btn btn-primary">Configurar</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-4 border-bottom pb-2">Características de la aplicación</h2>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row xs={1} md={2}>
                <Col className="mb-3">
                  <div className="d-flex">
                    <div className="me-3 fs-3">📱</div>
                    <div>
                      <h5>Instalable</h5>
                      <p className="text-muted">Instala la aplicación en tu dispositivo</p>
                    </div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="d-flex">
                    <div className="me-3 fs-3">🔄</div>
                    <div>
                      <h5>Modo offline</h5>
                      <p className="text-muted">Funciona sin conexión a internet</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;