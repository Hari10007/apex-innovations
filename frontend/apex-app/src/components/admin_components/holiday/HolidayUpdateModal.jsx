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

function HolidayUpdateModal(props) {
    const api = useAxios();
    const dispatch = useDispatch();
    const { holiday } = props;

    const initialValues = {
        id: '',
        name: '',
        date: '',
    }

    const validationSchema =  Yup.object().shape({
            name: Yup.string().required('Name is required'),
            date: Yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
        });

        const formik = useFormik({
            initialValues,
            validationSchema,
            onSubmit: async (values) => {

            try {
                const response = await api.post(`holiday/update/${values.id}`, {
                    name: values.name,
                    date: moment(values.date).format('YYYY-MM-DD'),
                });

                if (response.data) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                    props.onHide();
                    props.handle_holiday();
                    formik.resetForm();
                }
            } catch (error) {
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
                props.onHide();
            }
        },
    });

    const fetchDetails = ()=>{
        formik.setValues({
            id: holiday?.id,
            name: holiday?.name,
            date: moment(holiday?.date).toDate(),
        });
    }

    useEffect(() => {
        fetchDetails();
    }, [holiday]);

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
                    Update Holiday
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

                    <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date:</Form.Label>
                        <DatePicker
                            className="form-control"
                            onBlur={formik.handleBlur}
                            selected={formik.values.date}
                            onChange={(date) => formik.setFieldValue('date', date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText='yyyy-MM-dd'
                            isInvalid={formik.touched.date && formik.errors.date}
                        />
                        {formik.touched.date  && formik.errors.date &&
                            <Form.Control.Feedback type='invalid'  style={{ display: 'block' }}>
                                {formik.errors.date}
                            </Form.Control.Feedback>
                        }
                    </Form.Group>

                    <Button variant="primary" type="submit" className="text-center">
                       Update
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
        
    </>
  )
}

export default HolidayUpdateModal
