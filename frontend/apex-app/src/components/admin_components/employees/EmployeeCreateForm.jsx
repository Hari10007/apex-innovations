import React, { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import useAxios from '../../../utilis/useAxios';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { baseURL } from '../../../utilis/baseUrl';
import moment from 'moment';


function EmployeeCreateForm() {
    const dispatch = useDispatch();
    const api = useAxios();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    const [managers, setManagers] = useState([]);
    const [designations, setDesignations] = useState([]);

    const initialValues = {
        FirstName: '',
        LastName: '',
        Email: '',
        PhoneNo: '',
        Image: null,
        Password: '',
        ConfirmPassword: '',
        Manager: '',
        Designation: '',
        Qualification: '',
        DateJoined: '',
        City: '',
        State: '',
        Salary: '',
        IsAdmin: false,
        IsManager: false,
        IsActive: false,
        IsSuperUser: false,
        IsStaff: false,
        IsHRManager: false,

    }

    const validationSchema = Yup.object().shape({
      FirstName: Yup.string().required('First Name is required'),
      LastName: Yup.string().required('Last Name is required'),
      Email: Yup.string().email('Invalid email address').required('Email is required'),
      Password: Yup.lazy((value) =>
        value ? Yup.string().required('Password is required') : Yup.string()
      ),
      ConfirmPassword: Yup.lazy((value) =>
        value ? Yup.string().required('Confirm Password is required')
          .oneOf([Yup.ref('Password'), null], 'Passwords must match') : Yup.string()
      ),
      PhoneNo: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone Number is required'),
      Image: Yup.mixed().nullable(),
      Manager: Yup.string(),
      Designation: Yup.string(),
      Qualification: Yup.string(),
      DateJoined: Yup.string().required('DateJoined is required'),
      City: Yup.string().required('City is required'),
      State: Yup.string().required('State is required'),
      Salary: Yup.number().positive('Salary must be greater than 0').nullable(),
      IsAdmin: Yup.boolean(),
      IsManager: Yup.boolean(),
      IsActive: Yup.boolean(),
      IsSuperUser: Yup.boolean(),
      IsStaff: Yup.boolean(),
      IsHRManager: Yup.boolean(),
    });
    

    const fetchManagers = async ()=>{
        try{
            const response = await api.get('managers');

            if (response.status === 200){
                setManagers(response.data)
            }
        }
        catch(error){

        }
    }

    const fetchDesignation = async ()=>{
      try{
          const response = await api.get('designation/list');

          if (response.status === 200){
              setDesignations(response.data)
          }
      }
      catch(error){

      }
  }


    useEffect(() =>{
        fetchManagers();
        fetchDesignation()
    }, [])


        
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('image', values.Image);
                formData.append('first_name', values.FirstName);
                formData.append('last_name', values.LastName);
                formData.append('email', values.Email);
                formData.append('phone', values.PhoneNo);
                formData.append('password', values.Password);
                formData.append('password2', values.ConfirmPassword);
                formData.append('designation_id', values.Designation);
                formData.append('qualification', values.Qualification);
                formData.append('manager_id', values.Manager);
                formData.append('date_joined', moment(values.DateJoined).format('YYYY-MM-DD'));
                formData.append('city', values.City);
                formData.append('state', values.State);
                formData.append('salary', values.Salary);
                formData.append('is_admin', values.IsAdmin);
                formData.append('is_manager', values.IsManager);
                formData.append('is_active', values.IsActive);
                formData.append('is_superuser', values.IsSuperUser);
                formData.append('is_staff', values.IsStaff);
                formData.append('is_hr_manager', values.IsHRManager);
 

                const response = await api.post('create', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    }});

                if (response.status === 201) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                    navigate('/employees/page/1');
                }
            } 
            catch (error) {
                console.log(error.response.data.error)
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
            }
        },
    });

    console.log(formik.values)

  return (
    <>
        <h2>Register New Employee</h2>
        <Form onSubmit={formik.handleSubmit}>
            <div className="container overflow-hidden my-4">
                <div className="row gy-3">

                    <div className=" d-flex align-items-center justify-content-start">
                        <Form.Label><h6>Image *</h6></Form.Label>
                    </div>

                    <div className='d-flex flex-column align-items-center'>
                        {formik.values.Image && (
                            <img  id="previewImage" 
                              src={`${baseURL + formik.values.Image}`} 
                              className="img-thumbnail img-fluid" 
                              alt="Avatar" 
                              style={{
                                maxWidth: "150px",
                                maxHeight: "150px",
                                borderRadius: "50%",
                              }}/>
                        )}
                        <input
                            accept="image/*"
                            id="Image"
                            type="file"
                            name="Image"
                            onChange={(event) => {
                                const file = event.target.files[0];
                                formik.setFieldValue("Image", file);

                                const reader = new FileReader();

                                reader.onload = (e) => {
                                    document.getElementById("previewImage").src = e.target.result;
                                };

                                reader.readAsDataURL(file);
                            }}
                            style={{ display: "none" }}
                        />
                        
                        <label htmlFor="Image">
                            <Button className='my-1' variant="outlined" component="span">
                                Upload Profile Photo
                            </Button>
                        </label>
                        {formik.touched.Image && formik.errors.Image && (
                            <span style={{ color: 'red' }}>{formik.errors.Image}</span>
                        )}
                    </div>
                        
                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>First Name *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <Form.Control 
                              type="text"
                              placeholder="first name"
                              name='FirstName'
                              value={formik.values.FirstName}
                              isInvalid={formik.touched.FirstName && formik.errors.FirstName}
                              onChange={formik.handleChange}
                          />
                          <Form.Control.Feedback type="invalid">
                                  <h6>{formik.errors.FirstName}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>
                    
                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex ">
                          <Form.Label><h6>Last Name *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <Form.Control 
                              type="text"
                              placeholder="last name"
                              name='LastName'
                              value={formik.values.LastName}
                              isInvalid={formik.touched.LastName && formik.errors.LastName}
                              onChange={formik.handleChange}
                              />
                          <Form.Control.Feedback type="invalid">
                                  <h6>{formik.errors.LastName}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>
                    
                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Email *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <Form.Control 
                              type="email"
                              placeholder="email"
                              name='Email'
                              value={formik.values.Email}
                              isInvalid={formik.touched.Email && formik.errors.Email}
                              onChange={formik.handleChange}
                              />
                          <Form.Control.Feedback type="invalid">
                                  <h6>{formik.errors.Email}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Password *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <InputGroup>
                            <Form.Control 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="password"
                                name='Password'
                                value={formik.values.Password}
                                isInvalid={formik.touched.Password && formik.errors.Password}
                                onChange={formik.handleChange}
                              />
                            <InputGroup.Text onClick={()=>setShowPassword(!showPassword)}>
                              <i className={showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'} />
                            </InputGroup.Text>
                          </InputGroup>

                          <Form.Control.Feedback type="password">
                            <h6 style={{ color: 'red' }}>{formik.errors.Password}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Confirm Password *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <InputGroup>
                            <Form.Control 
                                type={confirmPassword ? 'text' : 'password'}
                                placeholder="confirm password"
                                name='ConfirmPassword'
                                value={formik.values.ConfirmPassword}
                                isInvalid={formik.touched.ConfirmPassword && formik.errors.ConfirmPassword}
                                onChange={formik.handleChange}
                                />
                            <InputGroup.Text onClick={()=>setConfirmPassword(!confirmPassword)}>
                              <i className={confirmPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'} />
                            </InputGroup.Text>
                          </InputGroup>

                          <Form.Control.Feedback type="password">
                            <h6 style={{ color: 'red' }}>{formik.errors.ConfirmPassword}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>
      
                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Phone Number *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <Form.Control 
                              type="text"
                              placeholder="phone number"
                              name='PhoneNo'
                              value={formik.values.PhoneNo}
                              isInvalid={formik.touched.PhoneNo && formik.errors.PhoneNo}
                              onChange={formik.handleChange}
                              />
                          <Form.Control.Feedback type="invalid">
                                  <h6>{formik.errors.PhoneNo}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Designation </h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                        <Form.Select 
                          name='Designation'
                          value={formik.values.Designation}
                          isInvalid={formik.touched.Designation && formik.errors.Designation}
                          onChange={formik.handleChange}
                        >
                          <option value="">Choose designation</option>
                          {designations?.map(designation => (
                            <option key={designation.id} value={designation.id}>
                              {designation.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          <h6>{formik.errors.Designation}</h6>
                        </Form.Control.Feedback>
                      </div>
                    </div>


                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Date Joined *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <DatePicker
                              className="form-control"
                              onBlur={formik.handleBlur}
                              selected={formik.values.DateJoined}
                              onChange={(DateJoined) => formik.setFieldValue('DateJoined', DateJoined)}
                              dateFormat="yyyy-MM-dd"
                              placeholderText='yyyy-MM-dd'
                              isInvalid={formik.touched.DateJoined && formik.errors.DateJoined}
                          />
                          {formik.touched.DateJoined  && formik.errors.DateJoined &&
                              <Form.Control.Feedback type='invalid'  style={{ display: 'block', fontSize: '16px'}}>
                                  {formik.errors.DateJoined}
                              </Form.Control.Feedback>
                          }
  
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                        <Form.Label><h6>Manager </h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                        <Form.Select 
                          name='Manager'
                          value={formik.values.Manager}
                          isInvalid={formik.touched.Manager && formik.errors.Manager}
                          onChange={formik.handleChange}
                        >
                          <option value="">Choose manager</option>
                          {managers?.map(manager => (
                            <option key={manager.id} value={manager.id}>
                              {manager.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          <h6>{formik.errors.Manager}</h6>
                        </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center my-2">
                      <div className="col-12 col-md-3 d-flex">
                        <Form.Label><h6>Employee Type</h6></Form.Label>
                      </div>
                      <div className="col-12 col-md-9 d-flex flex-wrap justify-content-between">
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Super User"
                          name="IsSuperUser"
                          checked={formik.values.IsSuperUser}
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Admin"
                          name="IsAdmin"
                          checked={formik.values.IsAdmin}
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Manager"
                          name="IsManager"
                          checked={formik.values.IsManager}
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Staff"
                          name="IsStaff"
                          checked={formik.values.IsStaff}
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Active"
                          name="IsActive"
                          checked={formik.values.IsActive}
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="checkbox"
                          label="HRManager"
                          name="IsHRManager"
                          checked={formik.values.IsHRManager}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                        <Form.Label><h6>City *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                        <Form.Control 
                          type="text"
                          placeholder="City"
                          name='City'
                          value={formik.values.City}
                          isInvalid={formik.touched.City && formik.errors.City}
                          onChange={formik.handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          <h6>{formik.errors.City}</h6>
                        </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                        <Form.Label><h6>State *</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                        <Form.Control 
                          type="text"
                          placeholder="State"
                          name='State'
                          value={formik.values.State}
                          isInvalid={formik.touched.State && formik.errors.State}
                          onChange={formik.handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          <h6>{formik.errors.State}</h6>
                        </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                        <Form.Label><h6>Salary</h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                        <Form.Control 
                          type="number"
                          placeholder="Salary"
                          name='Salary'
                          value={formik.values.Salary}
                          isInvalid={formik.touched.Salary && formik.errors.Salary}
                          onChange={formik.handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          <h6>{formik.errors.Salary}</h6>
                        </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className='row d-flex align-items-center justify-content-center my-2'>
                      <div className="d-flex">
                          <Form.Label><h6>Qualification </h6></Form.Label>
                      </div>

                      <div className="d-flex flex-column">
                          <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder='Qualification'
                              value={formik.values.Qualification}
                              isInvalid={formik.touched.Qualification && formik.errors.Qualification}
                              onChange={formik.handleChange}
                              name="Qualification"
                          />
                          <Form.Control.Feedback type="invalid">
                              <h6>{formik.errors.Qualification}</h6>
                          </Form.Control.Feedback>
                      </div>
                    </div>
 
                    
                    <div className='col-12 my-5'>
                        <Button variant="contained" color="primary" type="submit">Create Employee</Button>
                    </div>
                </div>
            </div>
        </Form>
    </>
  )
}

export default EmployeeCreateForm
