import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Notification from '../employee_components/Notification';

function Header() {
  const location = useLocation();
  const [header, setHeader] = useState("");
    
  useEffect(() => {
      let path = location.pathname.split('/');
      const header= path[1].split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      setHeader(header);
  }, [location]);


  return (
    <Navbar bg="dark" variant="dark" className="justify-content-center mb-4" style={{ zIndex: 100 }}>
        <Container>
            <Navbar.Brand>{header}</Navbar.Brand>
            <div className="d-flex align-items-center">
              <Notification />

            </div>
        </Container>
    </Navbar>
  )
}

export default Header
