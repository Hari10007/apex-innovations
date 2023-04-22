import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Notification from './Notification';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux-toolkit/userSlice';

function Header() {
  const location = useLocation();
  const [header, setHeader] = useState("");
  const employee = useSelector(selectUser);
  const imageURL = employee.image && "http://localhost:8000/api" + employee.image;
  console.log(employee)
    
  useEffect(() => {
      let path = location.pathname.split('/');
      const header= path[1].split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      setHeader(header);
  }, [location]);


  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between mb-4" style={{ zIndex: 100 }}>
        <Container>
            <Navbar.Brand>{header}</Navbar.Brand>
            <div className="d-flex align-items-center">
              <Notification />
              <Stack direction="row" spacing={3}>
                <Avatar alt="Remy Sharp" src={imageURL} />
              </Stack>
            </div>
        </Container>
    </Navbar>
  )
}

export default Header
