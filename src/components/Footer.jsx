import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const [installedPWA, setInstalledPWA] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setInstalledPWA(isStandalone);
    
    const isFromHomeScreen = window.navigator.standalone === true;
    if (isFromHomeScreen) {
      setInstalledPWA(true);
    }
  }, []);

  return (
    <footer className="bg-light mt-5 py-3">
      <Container>
        <Row className="text-center">
          <Col>
            <p className="mb-0">&copy; {currentYear} Hospital Hospital - Para el curso de Front-End</p>
            {installedPWA && <p className="text-success mb-0">Aplicación instalada</p>}
            <p className="text-muted small mb-0">Versión 1.0.0</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;