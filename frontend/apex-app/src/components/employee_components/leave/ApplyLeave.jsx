import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import useAxios from '../../../utilis/useAxios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';


function ApplyLeave(props) {
    const api = useAxios();
    const dispatch = useDispatch();

    const [leaveTypes, setLeaveTypes] = useState([]);


    const fetchLeaveType = async ()=>{
        try{
            const response = await api.get('api/leave/leave_types');
            if(response.status === 200){
                setLeaveTypes(response.data);
            }
        }
         catch (error) {
             console.error('fetchLeaveTypes error:', error);
        }
    }

    useEffect(() => {
        fetchLeaveType();
    }, []);
    

    const initialValues = {
        leaveType: '',
        startDate: '',
        endDate: '',
        halfDay: false,
        reason: '',
    }
    const validationSchema =  Yup.object().shape({
        leaveType: Yup.string().required('Leave type is required'),
        startDate: Yup.date().required('Start date is required').min(new Date(), 'Start date cannot be in the past'),
        endDate: Yup.date().required('End Date is required'),
        reason: Yup.string().required('Reason is required').max(200, 'Reason must be at most 200 characters')});
        
        const formik = useFormik({
            initialValues,
            validationSchema,
            onSubmit: async (values) => {

            try {
                const response = await api.post('api/leave/leave_request', {
                    leave_type: values.leaveType,
                    start_date: moment(values.startDate).format('YYYY-MM-DD'),
                    end_date: moment(values.endDate).format('YYYY-MM-DD'),
                    half_day: values.halfDay,
                    reason: values.reason,
                });

                if (response.data) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                    props.onHide();
                    props.handleLeaveUpdate();
                    formik.resetForm();
                }
            } catch (error) {
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
                props.onHide();
            }
        },
    });


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
                        Apply for Leave
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form className="d-grid gap-3" onSubmit={formik.handleSubmit}>
                        <Form.Group className='mb-3' controlId='formLeaveType'>
                            <Form.Label>Leave Type:</Form.Label>
                            <Form.Control
                                as='select'
                                name='leaveType'
                                value={formik.values.leaveType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.leaveType && formik.errors.leaveType}
                            >
                                <option value=''>-Select Leave Type-</option>
                                {leaveTypes.map((leaveType) => (
                                    <option key={leaveType.id} value={leaveType.name}>
                                        {leaveType.name}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type='invalid'>{formik.errors.leaveType}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formStartDate">
                            <Form.Label>Start Date:</Form.Label>
                            <DatePicker
                                className="form-control"
                                onBlur={formik.handleBlur}
                                selected={formik.values.startDate}
                                onChange={(date) => formik.setFieldValue('startDate', date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText='yyyy-MM-dd'
                                isInvalid={formik.touched.startDate && formik.errors.startDate}
                            />
                            {formik.touched.endDate  && formik.errors.endDate &&
                                <Form.Control.Feedback type='invalid'  style={{ display: 'block' }}>
                                    {formik.errors.startDate}
                                </Form.Control.Feedback>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEndDate">
                            <Form.Label>End Date:</Form.Label>
                            <DatePicker
                                className="form-control"
                                selected={formik.values.endDate}
                                onBlur={formik.handleBlur}
                                onChange={(date) => formik.setFieldValue('endDate', date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText='yyyy-MM-dd'
                                isInvalid={formik.touched.endDate  && formik.errors.endDate}
                            />
                            {formik.touched.endDate && formik.errors.endDate &&
                                <Form.Control.Feedback type="invalid"  style={{ display: 'block' }}>
                                    {formik.errors.endDate}
                                </Form.Control.Feedback>
                            }
                        </Form.Group>
      
                        {formik.values.startDate && formik.values.endDate && formik.values.startDate.getTime() === formik.values.endDate.getTime() && (
                            <Form.Group className="mb-3" controlId="formHalfDay">
                                <Form.Label>Half Day:</Form.Label>
                                <Form.Check type="checkbox" checked={formik.values.halfDay} onChange={(event) => formik.setFieldValue('halfDay', event.target.checked)} />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3" controlId="formReason">
                            <Form.Label>Reason:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formik.values.reason}
                                isInvalid={formik.touched.reason && formik.errors.reason}
                                onChange={formik.handleChange}
                                name="reason"
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.reason}
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                    </Form>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default ApplyLeave
