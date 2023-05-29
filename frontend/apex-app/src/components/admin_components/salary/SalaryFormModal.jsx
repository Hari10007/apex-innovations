import React, { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import useAxios from '../../../utilis/useAxios';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { toggleValue } from '../../../redux-toolkit/componentUpdateSlice';

function SalaryFormModal(props) {
    const api = useAxios();
    const dispatch = useDispatch();
    const params = useParams();

    const fetchEmployee = async (employeeId)=>{
        try{
            const response = await api.get(`employee/${employeeId}`);

            if (response.status === 200){
                const valuesToUpdate = {
                  name: response.data.first_name + response.data.last_name,
                  salary: response.data.salary,
                }

                formik.setValues(valuesToUpdate);

            }
        }
        catch (error){

        }
    }



    const initialValues = {
        name: '',
        salary: '',
        date: '',
    }
    const validationSchema =  Yup.object().shape({
            name: Yup.string(),
            salary: Yup.string().required('Salary is required'),
            date: Yup.date().required('Date is required'),
        });

        const formik = useFormik({
            initialValues,
            validationSchema,
            onSubmit: async (values) => {

            try {
                const response = await api.post('salary/create', {
                    employee: params?.id,
                    salary: values.salary,
                    date: moment(values.date).format('YYYY-MM-DD'),
                });

                if (response.data) {
                    dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                    props.onHide();
                    dispatch(toggleValue())
                    formik.resetForm();
                }
            } catch (error) {
                dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
                props.onHide();
            }
        },
    });


    useEffect(() => {
        fetchEmployee(params?.id);
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
                    Pay Salary
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
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control type="text" 
                            placeholder="salary" 
                            value={formik.values.salary}
                            onChange={formik.handleChange}
                            name = "salary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            className="form-control"
                            onBlur={formik.handleBlur}
                            selected={formik.values.date}
                            onChange={(date) => formik.setFieldValue('date', date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="MM/yyyy"
                            isInvalid={formik.touched.date && formik.errors.date}
                        />
                        {formik.touched.date  && formik.errors.date &&
                            <Form.Control.Feedback type='invalid'  style={{ display: 'block' }}>
                                {formik.errors.date}
                            </Form.Control.Feedback>
                        }
                    </Form.Group>


                    <Button variant="primary" type="submit" className="text-center">
                        Pay
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
            
        </>
    )
}

export default SalaryFormModal
