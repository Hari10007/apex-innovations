import React from 'react'
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';
import { selectLoading } from '../../redux-toolkit/userSlice';

function Loader() {
  const isLoading = useSelector(selectLoading)
  
  return (
    <>  
        {isLoading &&
            <div className='d-flex justify-content-center align-items-center' 
                style={{
                    backgroundColor:"#adb5bd",
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    zIndex: 1 }}>
                <Spinner animation="border" role="status" style={{zIndex: 9999}}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        }
    </>
  )
}

export default Loader
