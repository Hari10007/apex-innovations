import React from 'react'
import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import useAxios from '../../../utilis/useAxios';


function UpdatePassword({employee}) {

  const api = useAxios();
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const[showNewPassword, setShowNewPassword] = useState(false);
  const[showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleEditClick = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    const data = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const response = await api.post('/api/update_password', data);
      if (response.data){
        console.log(response.data)
        dispatch(setMessage({ message: response.data.message , type: 'success' }));
        setShowPasswordForm(!showPasswordForm)
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.log(error)
      dispatch(setMessage({ message: error.response.data.message , type: 'danger' }));
    }
  };


  return (
   <>
      <div className="col-md-6 d-flex justify-content-between align-items-start">
        <h3>Password</h3>
        <Link to="#" onClick={handleEditClick}>
          {showPasswordForm ? 'cancel' : 'edit'}
        </Link>
      </div>

      {showPasswordForm && (
        <Form onSubmit={updatePassword}>
          <div className="row align-items-center">
            <Form.Group className="mb-3" controlId="formOldPassword">
              <div className='row'>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <Form.Label>Old Password</Form.Label>
                </div>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <Form.Control type="password" value={oldPassword} placeholder="Old Password" onChange={(e)=>setOldPassword(e.target.value)} />
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewPassword">
              <div className='row'>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <Form.Label>New Password</Form.Label>
                </div>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <InputGroup>
                    <Form.Control type={showNewPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                    <InputGroup.Text onClick={()=>setShowNewPassword(!showNewPassword)}>
                      <i className={showNewPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'} />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <div className='row'>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <Form.Label>Confirm Password</Form.Label>
                </div>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <InputGroup>
                    <Form.Control type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                    <InputGroup.Text onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                      <i className={showConfirmPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'} />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
            </Form.Group>
            <div className='col-md-6 d-flex justify-content-between'>
              <Button variant="primary" type="submit">Submit</Button>
            </div>
          </div>
        </Form>)
        }

        {!showPasswordForm && (
          <div className="row align-items-center">
            <Form.Group className="mb-3" controlId="formPassword">
              <div className='row'>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <Form.Label>Password</Form.Label>
                </div>
                <div className='col-md-6 d-flex flex-column align-items-start'>
                  <Form.Control type="password" defaultValue={employee.password} readOnly/>
                </div>
              </div>
            </Form.Group>
          </div>
        )}
   </>
  )
}

export default UpdatePassword
