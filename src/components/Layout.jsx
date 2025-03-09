import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import localStorageService from '../services/localStorage';

const Layout = () => {
  const location = useLocation();

  // Actualizar la última página visitada
  useEffect(() => {
    localStorageService.updateLastVisitedPage(location.pathname);
  }, [location]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navbar />
      <Container className="flex-grow-1 mb-4">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;