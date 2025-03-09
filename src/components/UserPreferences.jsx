import { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import localStorageService from '../services/localStorage';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState(localStorageService.getUserPreferences());
  const [saveStatus, setSaveStatus] = useState({
    show: false,
    message: '',
    variant: 'success'
  });
  
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setPreferences(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const savePreferences = () => {
    const success = localStorageService.saveUserPreferences(preferences);
    
    if (success) {
      setSaveStatus({
        show: true,
        message: 'Preferencias guardadas correctamente',
        variant: 'success'
      });
      
      document.body.className = preferences.theme;
      
      document.documentElement.style.fontSize = 
        preferences.fontSize === 'small' ? '14px' :
        preferences.fontSize === 'medium' ? '16px' : '18px';
    } else {
      setSaveStatus({
        show: true,
        message: 'Error al guardar preferencias',
        variant: 'danger'
      });
    }
    
    setTimeout(() => {
      setSaveStatus({ show: false, message: '', variant: 'success' });
    }, 3000);
  };
  
  const restoreDefaults = () => {
    const defaultPreferences = {
      theme: 'light',
      fontSize: 'medium',
      notifications: true,
      language: 'es'
    };
    
    setPreferences(defaultPreferences);
    const success = localStorageService.saveUserPreferences(defaultPreferences);
    
    if (success) {
      setSaveStatus({
        show: true,
        message: 'Preferencias restauradas a valores predeterminados',
        variant: 'success'
      });
      
      document.body.className = defaultPreferences.theme;
      
      document.documentElement.style.fontSize = '16px';
    } else {
      setSaveStatus({
        show: true,
        message: 'Error al restaurar preferencias',
        variant: 'danger'
      });
    }
    
    setTimeout(() => {
      setSaveStatus({ show: false, message: '', variant: 'success' });
    }, 3000);
  };

  return (
    <Card>
      <Card.Header as="h5">Preferencias de Usuario</Card.Header>
      <Card.Body>
        {saveStatus.show && (
          <Alert variant={saveStatus.variant} dismissible onClose={() => setSaveStatus({ ...saveStatus, show: false })}>
            {saveStatus.message}
          </Alert>
        )}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tema</Form.Label>
            <Form.Select
              name="theme"
              value={preferences.theme}
              onChange={handlePreferenceChange}
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="warning" 
              onClick={restoreDefaults}
            >
              Restaurar valores predeterminados
            </Button>
            <Button 
              variant="success" 
              onClick={savePreferences}
            >
              Guardar preferencias
            </Button>
          </div>
        </Form>
        
        <hr className="my-4" />
        
        <div className="storage-info">
          <h5>Información de almacenamiento</h5>
          <p className="text-muted">
            Las preferencias se guardan en el almacenamiento local del navegador (LocalStorage).
            Los datos de sesión temporales se almacenan en SessionStorage y se eliminan al cerrar el navegador.
            La información de citas y doctores se almacena en IndexedDB.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserPreferences;