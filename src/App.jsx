import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import indexedDBService from './services/indexedDB';
import localStorageService from './services/localStorage';
import { register } from './services/serviceWorkerRegistration';

import Layout from './components/Layout';

import Home from './pages/Home';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Settings from './pages/Settings';

import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    register();

    const userPrefs = localStorageService.getUserPreferences();
    setPreferences(userPrefs);

    const initializeDB = async () => {
      try {
        if (!sessionStorage.getItem('dbInitialized')) {
          await indexedDBService.initSampleData();
          sessionStorage.setItem('dbInitialized', 'true');
          console.log('Base de datos inicializada correctamente');
        } else {
          console.log('Base de datos ya inicializada en esta sesión');
        }
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
      }
      setLoading(false);
    };

    initializeDB();
    
    const updatePageVisit = () => {
      const currentPage = window.location.pathname;
      localStorageService.updateLastVisitedPage(currentPage);
    };

    // Registrar eventos para actualizar la última página visitada
    window.addEventListener('beforeunload', updatePageVisit);
    updatePageVisit();

    return () => {
      window.removeEventListener('beforeunload', updatePageVisit);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  if (preferences) {
    document.documentElement.className = preferences.theme;
    document.documentElement.style.fontSize = 
      preferences.fontSize === 'small' ? '14px' : '16px';
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="citas" element={<Appointments />} />
          <Route path="doctores" element={<Doctors />} />
          <Route path="configuracion" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;