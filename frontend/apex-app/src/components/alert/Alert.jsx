import React, { useState } from 'react';
import { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, selectMessage, selectMessageType } from '../../redux-toolkit/messageSlice';
import './Alert.css';

function AlertMessage() {

  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const type = useSelector(selectMessageType);
  const [timer, setTimer] = useState(null);


  useEffect(() => {
    if (message) {
      setTimer(setTimeout(() => {
        dispatch(clearMessage());
        setTimer(null);
      }, 5000)); // 5 seconds
    }
  }, [message]);

  const handleAlert = () =>{
    clearTimeout(timer);
    dispatch(clearMessage());
  }

  if (message) {
    return (
      <div className="alert-container" onClick={() => handleAlert() }>
        <Alert variant={type} >
          <p>
            {message}
          </p>
        </Alert>
      </div>
    );
  }
}

export default AlertMessage