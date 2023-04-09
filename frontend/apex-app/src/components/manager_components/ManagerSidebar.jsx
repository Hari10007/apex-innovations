import React, { useEffect, useState } from 'react'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, {  NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux-toolkit/userSlice'
import Cookies from 'js-cookie';
import useAxios from '../../utilis/useAxios';
import { Badge } from 'react-bootstrap';


function ManagerSidebar() {
    let refresh_token = Cookies.get('refresh_token') ? Cookies.get('refresh_token') : null
    const navigate = useNavigate();
    const dispatch = useDispatch('')
    const [defaultSelected, setDefaultSelected] = useState("");
    const location = useLocation();
    const api = useAxios();
    

    useEffect(() => {
        let path = location.pathname.split('/');
        setDefaultSelected(path[2]);
    }, [location]);

    const handleLogout = async () => {
        const response = await api.post('api/logout', {'refresh':refresh_token});

        if (response.status === 205) {
          dispatch(logout());
        }
    };
    
    
    return (
            <SideNav
            onSelect={(selected) => {
                if (selected === 'exit') {
                    handleLogout();
                } 
                else {
                    setDefaultSelected(selected);
                    navigate('/manager/' + selected);
                }
            }}
            style={{ backgroundColor: '#055160' }}
            >
            <SideNav.Toggle />
            <SideNav.Nav key={defaultSelected} defaultSelected={defaultSelected}>
                <NavItem eventKey="dashboard">
                    <NavIcon>
                        <Badge pill bg="primary" style={{ marginRight: '5px' }}>
                            <i className="fa-solid fa-d" style={{fontSize:'2'}}></i>
                        </Badge>
                    </NavIcon>
                    <NavText>dashboard</NavText>            
                </NavItem>
                <NavItem eventKey="leave_management">
                    <NavIcon>
                        <Badge pill bg="primary" style={{ marginRight: '5px' }}>
                            <i className="fa-solid fa-l" style={{fontSize:'2'}}></i>
                        </Badge>
                    </NavIcon>
                    <NavText>Leave Management</NavText>            
                </NavItem>
                <NavItem eventKey="exit" >
                    <NavIcon>
                        <Badge pill bg="danger" style={{ marginRight: '5px' }}>
                            <i className="fa-solid fa-e" style={{ fontSize: '2' }}></i>
                        </Badge>    
                    </NavIcon>
                    <NavText style={{color: 'red', fontSize:'15px'}}>Exit</NavText>            
                </NavItem>
            </SideNav.Nav>

            
        </SideNav>
    )
}

export default ManagerSidebar
