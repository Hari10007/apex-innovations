import React, { useEffect, useState } from 'react'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, {  NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux-toolkit/userSlice'
import Cookies from 'js-cookie';
import useAxios from '../../utilis/useAxios';



function Sidebar() {
    // let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    let refresh_token = Cookies.get('refresh_token') ? Cookies.get('refresh_token') : null
    const navigate = useNavigate();
    const dispatch = useDispatch('')
    const [defaultSelected, setDefaultSelected] = useState("");
    const location = useLocation();
    const api = useAxios();
    

    useEffect(() => {
        let path = location.pathname.split('/');
        setDefaultSelected(path[1]);
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
                    navigate('/' + selected);
                }
            }}
            style={{ backgroundColor: '#055160' }}
            >
            <SideNav.Toggle />
            <SideNav.Nav key={defaultSelected} defaultSelected={defaultSelected}>
                <NavItem eventKey="attendance">
                    <NavIcon><i className="fa-solid fa-a" style={{fontSize:'2'}}></i></NavIcon>
                    <NavText>Attendance</NavText>            
                </NavItem>
                <NavItem eventKey="profile">
                    <NavIcon><i className="fa-solid fa-p" style={{fontSize:'2'}}></i></NavIcon>
                    <NavText>Profile</NavText>            
                </NavItem>
                <NavItem eventKey="project">
                    <NavIcon><i className="fa-solid fa-p" style={{fontSize:'2'}}></i></NavIcon>
                    <NavText>Project</NavText>            
                </NavItem>
                <NavItem eventKey="leave">
                    <NavIcon><i className="fa-solid fa-l" style={{fontSize:'2'}}></i></NavIcon>
                    <NavText>Leave</NavText>            
                </NavItem>
                <NavItem eventKey="holiday">
                    <NavIcon><i className="fa-solid fa-h" style={{fontSize:'2'}}></i></NavIcon>
                    <NavText>Holiday</NavText>            
                </NavItem>
                <NavItem eventKey="exit" >
                    <NavIcon><i className="fa-solid fa-e" style={{fontSize:'2'}}></i></NavIcon>
                    <NavText style={{color: 'red', fontSize:'15px'}}>Exit</NavText>            
                </NavItem>
            </SideNav.Nav>

            
        </SideNav>
    )
}

export default Sidebar
