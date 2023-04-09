import React, { useEffect, useState } from 'react';
import useAxios from '../../../utilis/useAxios';
import Image from 'react-bootstrap/Image';
import BankAccount from './BankAccount';
import { Badge, Button} from 'react-bootstrap';
import UpdatePassword from './UpdatePassword';


function EmployeeDetail({ profileUpdated }) {
  
  const [modalShow, setModalShow] = useState(false);
  const [employee, setEmployee] = useState([]);
  const imageURL = "http://localhost:8000/api" + employee.image || "https://bootdey.com/img/Content/avatar/avatar7.png";
  const api = useAxios();

  useEffect(() => {
    async function fetchData() {

      let response = await api.get('api/profile');

      if (response.status === 200) {
        setEmployee(response.data);
      }
    }
    fetchData();
  }, [profileUpdated]);

  
  return (
    <>
        <div className="row  align-items-center">
            <div className="col-md-2 text-center">
                <Image src={imageURL } 
                    className="avatar rounded-circle img-thumbnail"
                    alt="profile-img" 
                />
            </div>
            <div className="col-md-10">
              <div className='row'>
                <div className='col-md-12 d-flex flex-column align-items-start'>
                    <h4 >{employee.first_name} {employee.last_name}</h4>
                    <Badge bg="success">{employee.designation_name}</Badge>
                    <p >Employee Id: {employee.employee_id}</p>
                </div>
                <hr />
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <h6>{employee.phone}</h6>
                </div>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <h6>{employee.email}</h6>
                </div>
                <hr />
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <h6><i className="fa fa-map-marker" style={{fontSize:'2'}}></i>  {employee.city},{employee.state}</h6>
                </div>
              </div>
                    
            </div>
        </div>
        <hr/>
        <div className="row  align-items-center">
          <div className='col-md-6 d-flex flex-column align-items-start'>
              <h3>General Informations</h3>
              <h6>Joining Date</h6><p>{employee.date_joined}</p>
              <h6>Department</h6>
          </div>
        </div>
        <hr/>
        <div className="row ">
          <div className='col-md-6 d-flex flex-column align-items-start'>
            <h3>Educational Details</h3>
              <h6>Highest Qualification</h6><p>{employee.qualification}</p>
            <hr/>
            <h3>Bank Details</h3>

            <Button variant="primary" onClick={() => setModalShow(true)}>
              <i className="fa-solid fa-plus" style={{fontSize:'2'}}></i> Add Bank Account
            </Button>
          
            <BankAccount show={modalShow} onHide={() => setModalShow(false)}/>
          </div>

          <div  className='col-md-6 d-flex flex-column '>
            <UpdatePassword employee={employee}/>
          </div>
        </div>

        
    </>
  );
}

export default EmployeeDetail;
