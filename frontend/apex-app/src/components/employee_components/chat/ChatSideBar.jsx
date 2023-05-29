import React, { useEffect, useState } from 'react'
import {
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBTypography,
    MDBInputGroup,
  } from "mdb-react-ui-kit";
import { NavLink, useNavigate} from "react-router-dom";
import useAxios from '../../../utilis/useAxios';
import { baseURL } from '../../../utilis/baseUrl';

function ChatSideBar() {
  const api = useAxios();
  const [keyword, setKeyword] = useState('');
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const response = await api.get(`chat/employees/?keyword=${keyword}`);

    if(response.status === 200){
      setEmployees(response.data)
    }
  };


  useEffect(()=>{
    fetchEmployees();
  },[])

  const handlePageChange = (employee) => {
    navigate(`/chat/${employee?.id}`);
  };


  return (
    <>
      <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0"  >
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Apex Chat
          </h5>

          <MDBCard>
            <MDBCardBody>
                <MDBInputGroup className="rounded mb-3">
                    <input
                    className="form-control rounded"
                    placeholder="Search"
                    type="search"
                    />
                    <span
                    className="input-group-text border-0"
                    id="search-addon"
                    >
                    <MDBIcon fas icon="search" />
                    </span>
                </MDBInputGroup>

              <MDBTypography listUnStyled className="mb-0" style={{  height: "500px", overflowY: "auto", scrollbarWidth: "none" }}>
                {employees?.map((employee, index) =>(
                  <li
                  className="p-2 border-bottom" key={index}
                  style={{ backgroundColor: "#eee" }}
                  onClick={() => handlePageChange(employee)}
                  >
                  <NavLink style={{textDecoration: 'none'}}  className="d-flex justify-content-between">
                    <div className="d-flex flex-row">
                      <img
                        src={`${employee.image ? baseURL + employee.image : "https://bootdey.com/img/Content/avatar/avatar7.png"}`}
                        alt="avatar"
                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                        width="60"
                      />
                      <div className="pt-1">
                        <p className="fw-bold mb-0">{employee.name}</p>
                        {/* <p className="small text-muted">
                          Hello, Are you there?
                        </p> */}
                      </div>
   
                    </div>
                    {/* <div className="pt-1">
                      <p className="small text-muted mb-1">Just now</p>
                      <span className="badge bg-danger float-end">1</span>
                    </div> */}
                  </NavLink>
                </li>
                  ))}

              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
    </>
  )
}

export default ChatSideBar
