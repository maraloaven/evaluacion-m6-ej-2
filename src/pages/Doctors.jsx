import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DoctorList from '../components/DoctorList';
import localStorageService from '../services/localStorage';

const Doctors = () => {
  useEffect(() => {
    const sessionData = localStorageService.getSessionData();
    
    if (!sessionData.temporaryData) {
      sessionData.temporaryData = {};
    }
    
    if (!sessionData.temporaryData.pageVisits) {
      sessionData.temporaryData.pageVisits = {};
    }
    
    const currentCount = sessionData.temporaryData.pageVisits['/doctores'] || 0;
    sessionData.temporaryData.pageVisits['/doctores'] = currentCount + 1;
    
    localStorageService.saveSessionData(sessionData);
  }, []);

  return (
    <Container fluid="lg">
      <Row className="mb-4">
        <Col>
          <h1 className="border-bottom pb-2">Gestión de Doctores</h1>
          <p className="lead">
            Añade, edita o elimina información de los doctores del hospital.
          </p>
        </Col>
      </Row>

      <DoctorList />
    </Container>
  );
};

export default Doctors;