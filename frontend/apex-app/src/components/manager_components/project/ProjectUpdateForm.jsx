import React, { useState } from 'react'
import { Autocomplete, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import useAxios from '../../../utilis/useAxios';
import { useParams } from 'react-router-dom';
import { setMessage } from '../../../redux-toolkit/messageSlice';

function ProjectUpdateForm() {
    const dispatch = useDispatch();
    const api = useAxios();
    const params= useParams();
    
    const [statusChoices, setStatusChoices] = useState([])
    const [employees, setEmployees] = useState([]);
    const[project, setProject] = useState();


    const initialValues = {
        Image: null,
        Title: '',
        Description: '',
        Employees: [ ],
        status: '',
    }

    const validationSchema =  Yup.object().shape({
        Title: Yup.string().required('Project Title is required'),
        Description: Yup.string().required('Project Description is required'),
        Employees: Yup.array().min(1, 'Assign at least one employee'),
        status: Yup.string().required('Status is required'),
        Image: Yup.mixed().required('Project Image is required'),
    })
    
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('image', values.Image);
                formData.append('title', values.Title);
                formData.append('description', values.Description);
                formData.append('employee_mails', JSON.stringify(values.Employees));
                formData.append('status', values.status);

                const response = await api.post(`api/project/update/${project.id}`, formData,
                    {
                        headers: {'Content-Type': 'multipart/form-data',}
                    });

                if (response.data) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                }
            } 
            catch (error) {
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
            }
        },
    });

    const fetchEmployees = async ()=>{
        try{
            const response = await api.get('api/project/list_employees');

            if (response.status === 200){
                setEmployees(response.data)
            }
        }
        catch(error){

        }
    }

    const fetchStatusField = async()=>{
        try{
            const response = await api.get('api/project/status_choices');
            if(response.status === 200){
                setStatusChoices(response.data)
            }
        }
        catch(error){

        }
    }


    const fetchProject = async (projectId)=>{
        try{
            const response = await api.get(`api/project/${projectId}`);

            if (response.status === 200){
                formik.setValues({
                    Image: response.data.image,
                    Title: response.data.title,
                    Description: response.data.description,
                    Employees: response.data.employee_emails,
                    status: response.data.status,
                });
                setProject(response.data)
            }
        }
        catch (error){

        }
    }


    useEffect(() =>{
        fetchEmployees();
        fetchStatusField();
        fetchProject(params?.projectId);
    }, [])


  return (
    <>
        <h2>Update Project</h2>
        <Form onSubmit={formik.handleSubmit}>
            <div className="container overflow-hidden my-4">
                <div className="row gy-3">

                    <div className="col-3 d-flex align-items-center justify-content-start">
                        <Form.Label><h6>Project Image *</h6></Form.Label>
                    </div>

                    <div className='col-9'>
                        {formik.values.Image && (
                            <img  id="previewImage" src={`http://localhost:8000/api${formik.values.Image}`} className="img-thumbnail img-fluid" alt="Project" />
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
                            <Button className='my-4' variant="outlined" component="span">
                                Update Project Image
                            </Button>
                        </label>
                        {formik.touched.Image && formik.errors.Image && (
                            <span style={{ color: 'red' }}>{formik.errors.Image}</span>
                        )}
                    </div>

                    <div className="col-3 d-flex justify-content-start">
                        <Form.Label><h6>Project Title *</h6></Form.Label>
                    </div>

                    <div className="col-9">
                        <Form.Control 
                            type="text"
                            placeholder="Title"
                            name='Title'
                            value={formik.values.Title}
                            isInvalid={formik.touched.Title && formik.errors.Title}
                            onChange={formik.handleChange}
                         />
                         <Form.Control.Feedback type="invalid">
                                <h6>{formik.errors.Title}</h6>
                        </Form.Control.Feedback>
                    </div>

                    <div className="col-3 d-flex justify-content-start">
                        <Form.Label><h6>Project Description *</h6></Form.Label>
                    </div>

                    <div className="col-9">
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder='Project Description'
                            value={formik.values.Description}
                            isInvalid={formik.touched.Description && formik.errors.Description}
                            onChange={formik.handleChange}
                            name="Description"
                        />
                        <Form.Control.Feedback type="invalid">
                            <h6>{formik.errors.Description}</h6>
                        </Form.Control.Feedback>
                    </div>

                    <div className="col-3 d-flex justify-content-start">
                        <Form.Label><h6>Assign Employees</h6></Form.Label>
                    </div>

                    <div className="col-9">
                        <Autocomplete
                            filterSelectedOptions
                            multiple
                            limitTags={2}
                            options={employees || []}
                            getOptionLabel={(option) => option?.email || ''}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Assign Employees" />
                            )}
                            sx={{ width: '100%', backgroundColor: 'white' }}
                            value={formik.values.Employees ? formik.values.Employees.map((email) => employees.find((employee) => employee.email === email)) : []}
                            onChange={(event, value) => {
                                const employeeEmails = value.map((employee) => employee.email);
                                formik.setFieldValue('Employees', employeeEmails);
                            }}
                            isOptionEqualToValue={(option, value) => option?.email === value?.email}
                        />
                        {formik.touched.Employees && formik.errors.Employees && (
                            <span style={{ color: 'red' }}>{formik.errors.Employees}</span>
                        )}
                    </div>

                    <div className="col-3 d-flex justify-content-start">
                        <Form.Label><h6>Status</h6></Form.Label>
                    </div>

                    <div className='col-9'>
                        <FormControl fullWidth>
                            <Select
                            value={formik.values.status}
                            label="status"
                            onChange={formik.handleChange}
                            name='status'
                            sx={{ width: '100%', backgroundColor: 'white' }}
                            >
                                {statusChoices.map(key => (
                                    <MenuItem key={key[0]} value={key[0]}>{key[1]}</MenuItem>
                                )) }
                            </Select>
                            {formik.touched.status && formik.errors.status && (
                                <span style={{ color: 'red' }}>{formik.errors.status}</span>
                            )}
                        </FormControl>
                    </div>

                    <div className="col-3">
                    </div>
                    
                    <div className='col-9 my-5'>
                        <Button variant="contained" color="primary" type="submit">Update Project</Button>
                    </div>
                </div>
            </div>
        </Form>
    </>
  )
}

export default ProjectUpdateForm
