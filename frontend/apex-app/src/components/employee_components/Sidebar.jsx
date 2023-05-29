import React, { useEffect, useState } from 'react'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, {  NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../redux-toolkit/userSlice'
import { useMediaQuery } from 'react-responsive';
import Cookies from 'js-cookie';
import useAxios from '../../utilis/useAxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGauge,
    faClipboardUser,
    faUser,
    faDiagramProject,
    faPersonWalkingArrowRight,
    faCalendar,
    faPeopleRoof,
    faListCheck,
    faRightFromBracket,
    faMoneyBills,
    faMessage,
    } 
from '@fortawesome/free-solid-svg-icons';


function Sidebar() {
    // let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    const employee = useSelector(selectUser);
    let refresh_token = Cookies.get('refresh_token') ? Cookies.get('refresh_token') : null
    const navigate = useNavigate();
    const dispatch = useDispatch('')
    const [defaultSelected, setDefaultSelected] = useState("");
    const location = useLocation();
    const api = useAxios();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const sidebarWidth = isMobile ? '10px' : '20px';

    

    useEffect(() => {
        let path = location.pathname.split('/');
        setDefaultSelected(path[1]);
    }, [location]);

    const handleLogout = async () => {
        const response = await api.post('logout', {'refresh':refresh_token});

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
            style={{ backgroundColor: !employee.admin ? '#055160' : '#000',  width: sidebarWidth  }}
            >
            <SideNav.Toggle />

            <SideNav.Nav key={defaultSelected} defaultSelected={defaultSelected}>
                {/* {employee?.manager && 
                    <NavItem eventKey="dashboard">
                        <NavIcon>
                            <FontAwesomeIcon icon={faGauge} style={{  fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Dashboard</NavText>            
                    </NavItem>
                } */}
                {employee?.admin && 
                        <NavItem eventKey="admin_dashboard">
                            <NavIcon>
                                <FontAwesomeIcon icon={faGauge} style={{  fontSize: '1.0rem' }} />
                            </NavIcon>
                            <NavText>Dashboard</NavText>            
                        </NavItem>
                }

                {employee?.admin && 
                    <NavItem eventKey="employees">
                        <NavIcon>
                            <FontAwesomeIcon icon={faPeopleRoof} style={{  fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Employees</NavText>            
                    </NavItem>
                }

                {employee?.admin ? (
                    <NavItem eventKey="attendances">
                        <NavIcon>
                            <FontAwesomeIcon icon={faClipboardUser}  style={{  fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Attendance Log</NavText>            
                    </NavItem>
                    ) : (
                    <NavItem eventKey="attendance">
                        <NavIcon>
                            <FontAwesomeIcon icon={faClipboardUser}  style={{  fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Attendance</NavText>            
                    </NavItem>
                )
                }

                {employee?.manager && !employee?.hr_manager&& 
                    <NavItem eventKey="leave_management">
                        <NavIcon>
                            <FontAwesomeIcon icon={faListCheck}  style={{  fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Leave Management</NavText>            
                    </NavItem>
                }
                
                <NavItem eventKey="profile">
                    <NavIcon>
                        <FontAwesomeIcon icon={faUser} style={{  fontSize: '1.0rem' }} />
                    </NavIcon>
                    <NavText>Profile</NavText>            
                </NavItem>

                
                {!employee?.admin &&
                    <NavItem eventKey="project">
                        <NavIcon>
                            <FontAwesomeIcon icon={faDiagramProject} style={{  fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Project</NavText>            
                    </NavItem>
                }
                
                {!employee?.admin && 
                    <NavItem eventKey="leave">
                        <NavIcon>
                            <FontAwesomeIcon icon={faPersonWalkingArrowRight} style={{  fontSize: '1.0rem' }}  />
                        </NavIcon>
                        <NavText>Leave</NavText>            
                    </NavItem>
                }

                

                <NavItem eventKey="holiday">
                    <NavIcon>
                        <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '1.0rem' }} />
                    </NavIcon>
                    <NavText>Holiday</NavText>            
                </NavItem>

                <NavItem eventKey="chat">
                    <NavIcon>
                    <FontAwesomeIcon icon={faMessage} />
                    </NavIcon>
                    <NavText>Chat</NavText>            
                </NavItem>

                <NavItem eventKey="salary">
                        <NavIcon>
                        <FontAwesomeIcon icon={faMoneyBills} style={{ fontSize: '1.0rem' }} />
                        </NavIcon>
                        <NavText>Salary</NavText>            
                </NavItem>

                <NavItem eventKey="exit" >
                    <NavIcon>
                        <FontAwesomeIcon icon={faRightFromBracket } style={{ fontSize: '1.0rem' , color: 'red' }} />
                    </NavIcon>
                    <NavText style={{color: 'red', fontSize:'15px'}}>Exit</NavText>            
                </NavItem>
            </SideNav.Nav>

        </SideNav>
    )
}

export default Sidebar
