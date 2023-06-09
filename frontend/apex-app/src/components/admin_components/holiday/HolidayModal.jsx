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
import '../../css/Holiday.css'

function HolidayModal(props) {
    const api = useAxios();
    const dispatch = useDispatch();

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const highlightWeekends = (date) => {
        return isWeekend(date) ? 'highlight-weekend' : null;
    };

    const initialValues = {
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
                const response = await api.post('holiday/create', {
                    name: values.name,
                    date: moment(values.date).format('YYYY-MM-DD'),
                });

                if (response.data) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                    if (response.data.status === "success"){
                        props.onHide();
                        props.handle_holiday();
                        formik.resetForm();
                    }
                }
            } catch (error) {
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
                props.onHide();
            }
        },
    });


    useEffect(() => {
        if (!formik.isSubmitting) {
            formik.resetForm();
        }
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
                    Create Holiday
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
                            className={`form-control ${formik.touched.date && formik.errors.date ? 'is-invalid' : ''}`}
                            onBlur={formik.handleBlur}
                            selected={formik.values.date}
                            onChange={(date) => formik.setFieldValue('date', date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="yyyy-MM-dd"
                            highlightDates={[
                                {
                                  'background-color': '#ff0000', // Red color
                                  'border-radius': '50%',
                                  color: '#fff',
                                  start: new Date().getTime(),
                                  end: new Date().getTime(),
                                  daysOfWeek: [0, 6] // 0 for Sunday, 6 for Saturday
                                }
                              ]}
                        />
                        {formik.touched.date  && formik.errors.date &&
                            <Form.Control.Feedback type='invalid'  style={{ display: 'block' }}>
                                {formik.errors.date}
                            </Form.Control.Feedback>
                        }
                    </Form.Group>


                    <Button variant="primary" type="submit" className="text-center">
                        Add Holiday
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
        
    </>
  )
}

export default HolidayModal
