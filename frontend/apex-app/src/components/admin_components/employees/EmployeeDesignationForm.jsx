import React from 'react'
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import useAxios from '../../../utilis/useAxios';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function EmployeDesignationForm(props) {
    const api = useAxios();
    const dispatch = useDispatch();

    const initialValues = {
        name: '',
    }
    const validationSchema =  Yup.object().shape({
            name: Yup.string().required('Name is required'),
        });

        const formik = useFormik({
            initialValues,
            validationSchema,
            onSubmit: async (values) => {

            try {
                const response = await api.post('designation/create', {
                    name: values.name,
                });

                if (response.data) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                    props.onHide();
                    props.handle_designation();
                    formik.resetForm();
                }
            } catch (error) {
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
                props.onHide();
            }
        },
    });


    useEffect(() => {
        formik.resetForm();
    }, [props.show]);


  return (
    <>
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Designation
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="d-grid gap-3"  onSubmit={formik.handleSubmit} >
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" 
                            placeholder="Name" 
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            name = "name"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="text-center">
                        Add Designation
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
        
    </>
  )
}

export default EmployeDesignationForm
