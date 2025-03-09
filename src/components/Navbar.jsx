import { Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <Container>
      <Nav className="mb-4 bg-light rounded p-2" variant="pills">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            Inicio
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/citas" className={({ isActive }) => isActive ? "active" : ""}>
            Citas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/doctores" className={({ isActive }) => isActive ? "active" : ""}>
            Doctores
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/configuracion" className={({ isActive }) => isActive ? "active" : ""}>
            Configuración
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default Navbar;