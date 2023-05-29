import React, { useState } from 'react'
import { Button , Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik , FieldArray} from 'formik';
import {  Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import useAxios from '../../../utilis/useAxios';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { format, parse, addHours, addMinutes } from 'date-fns';

const initialValues = {
    date: '',
    attendanceTimes: [{ check_in: '', check_out: '' }],
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  attendanceTimes: Yup.array().of(
    Yup.object().shape({
      check_in: Yup.string().required('Check-in time is required'),
      check_out: Yup.string().required('Check Out time is required'),
    })
  ),
});

function AttendanceRequestModal(props) {
  const api = useAxios();
  const dispatch = useDispatch();

  const [attendanceTimes, setAttendanceTimes] = useState([{ check_in: '', check_out: '' }]);

  const addAttendanceTime = () => {
    setAttendanceTimes((prevAttendanceTimes) => [...prevAttendanceTimes, { check_in: '', check_out: '' }]);
  };

  const removeAttendanceTime = (index) => {
    setAttendanceTimes((prevAttendanceTimes) => prevAttendanceTimes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.post('attendance/create', {
            date: moment(values.date).format('YYYY-MM-DD'),
            attendanceTimes: values.attendanceTimes,
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

  useEffect(() => {
    formik.resetForm(initialValues);
    setAttendanceTimes([{ check_in: '', check_out: '' }]);
  }, [props.show]);

  const handleCheckInChange = (index, time) => {
    const dateValue = new Date(time.$d);
    const formattedTime = moment(dateValue).format('HH:mm:ss');
    const updatedAttendanceTimes = [...attendanceTimes];
    updatedAttendanceTimes[index].check_in = formattedTime;
    formik.setFieldValue('attendanceTimes', updatedAttendanceTimes);
  };

  const handleCheckOutChange = (index, time) => {
    const dateValue = new Date(time.$d);
    const formattedTime = moment(dateValue).format('HH:mm:ss');
    const updatedAttendanceTimes = [...attendanceTimes];
    updatedAttendanceTimes[index].check_out = formattedTime;
    formik.setFieldValue('attendanceTimes', updatedAttendanceTimes);
  };

  return (
    <>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
               Request for attendance
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Form className="d-grid gap-3">
                <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Date:</Form.Label>
                    <DatePicker
                        className="form-control"
                        onBlur={formik.handleBlur}
                        selected={formik.values.date}
                        onChange={(date) => formik.setFieldValue('date', date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="yyyy-MM-dd"
                        isInvalid={formik.touched.date && formik.errors.date}
                    />
                    {formik.touched.date && formik.errors.date && (
                        <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        {formik.errors.date}
                        </Form.Control.Feedback>
                    )}
                    </Form.Group>
                    
                    {attendanceTimes.map((attendanceTime, index) => (
                    <div key={index}>
                        <Form.Group className="mb-3" controlId={`formCheckIn${index}`}>
                        <Form.Label>Check In:</Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                            <TimePicker
                                value={attendanceTime.check_in}
                                onChange={(time) => handleCheckInChange(index, time)}
                            />
                            </DemoContainer>
                        </LocalizationProvider>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId={`formCheckOut${index}`}>
                        <Form.Label>Check Out:</Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                            <TimePicker
                                value={attendanceTime.check_out}
                                onChange={(time) => handleCheckOutChange(index, time)}
                            />
                            </DemoContainer>
                        </LocalizationProvider>
                        </Form.Group>

                        <Button variant="danger" onClick={() => removeAttendanceTime(index)}>
                            <FontAwesomeIcon icon={faSquareMinus} />
                        </Button>
                    </div>
                    ))}

                    <Button variant="success" onClick={addAttendanceTime}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>

            </Form>
         </div>
        </Modal.Body>

        <Modal.Footer className='justify-content-center'>
            <Button variant="primary" onClick={handleSubmit}>
                Apply
            </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AttendanceRequestModal
