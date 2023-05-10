import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import useAxios from '../../../utilis/useAxios';

function BankAccount(props) {
  const api = useAxios();
  const dispatch = useDispatch();


  const[accountNumber, setAccountNumber] = useState('');
  const[name, setName] = useState('');
  const[ifsc, setIfsc] = useState('');

  const addAccount = async (e) => {
    e.preventDefault();

    try {
      let response = await api.post('add_account', 
        {
          'account_number': accountNumber,
          'name': name,
          'ifsc_code': ifsc
      });
      if (response.data){
        dispatch(setMessage({ message: response.data.message , type: 'success' }));
        props.onHide();
      }
    } catch (error) {
      dispatch(setMessage({ message: error.response.data.error , type: 'danger' }));
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
            Add Bank Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="d-grid gap-3" onSubmit={addAccount}>
            <Form.Group className="mb-3" controlId="formAccountNumber">
              <Form.Label>Account Number</Form.Label>
              <Form.Control type="text" placeholder="Account Number" onChange={(e)=>setAccountNumber(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIfscCode">
              <Form.Label>IFSC Code</Form.Label>
              <Form.Control type="text" placeholder="IFSC Code" onChange={(e)=>setIfsc(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRecipientName">
              <Form.Label>Recipient Name</Form.Label>
              <Form.Control type="text" placeholder="Recipient Name" onChange={(e)=>setName(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit" className="text-center">
              Add Account
            </Button>
          </Form>
        </Modal.Body>
        
      </Modal>
    </>
  );
}

export default BankAccount;
