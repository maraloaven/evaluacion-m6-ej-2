import { useState, useEffect } from 'react';
import { Navbar, Container, Button, Badge } from 'react-bootstrap';
import localStorageService from '../services/localStorage';

const Header = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [preferences, setPreferences] = useState(localStorageService.getUserPreferences());

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
      } else {
        console.log('Usuario rechazó la instalación');
      }
      setInstallPrompt(null);
    });
  };

  const bgVariant = preferences.theme === 'dark' ? 'dark' : 'primary';
  const textVariant = preferences.theme === 'dark' ? 'white' : 'light';

  return (
    <Navbar bg={bgVariant} variant={textVariant} expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand href="/" className="fs-3 fw-bold">Hospital Hospital</Navbar.Brand>
        <div className="d-flex align-items-center">
          {!isOnline && (
            <Badge bg="warning" text="dark" className="me-2">
              Modo sin conexión
            </Badge>
          )}
          
          {installPrompt && (
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={handleInstallClick}
            >
              Instalar aplicación
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;