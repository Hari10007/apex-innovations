import React from 'react'
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import useAxios from '../../../utilis/useAxios';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { useDispatch } from 'react-redux';

function SalarySlipModal(props) {
    const api = useAxios();
    const dispatch = useDispatch();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            let response = await api.post('salary/generate_slip',{
                'employee': props.employee_salary.employee,
                'employee_salary': props.employee_salary.id,
                'date': moment(new Date()).format('YYYY-MM-DD')
            })
            
            console.log(response.data)
            if (response.data){
                props.onHide();
                dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                props.handle_salary();
            }
        }catch (error) {
            console.error(error);
            dispatch(setMessage({ message: error.response.data.error, type: 'danger' }));
            props.onHide();
        }
    }

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
                        Generate Salary Slip
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form className="d-grid gap-3"  onSubmit={handleSubmit} >

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" 
                                value={props.employee_salary?.employee_name}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" 
                                value={moment(new Date()).format('YYYY-MM-DD')}
                                readOnly
                            />
                        </Form.Group>

                        <Button variant="warning" type="submit" className="text-center">
                            Generate
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
            
        </>
    )
}

export default SalarySlipModal
