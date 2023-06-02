import React, { useEffect, useState } from 'react'
import '../assets/css/Login.css'
import EmployeeLogin from '../../components/employee_components/EmployeeLogin'
import { css } from '@emotion/react';
import { PuffLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function EmployeeLoginPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = './images/logo.jpg';
    image.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  return (
    <>
      {imageLoaded ? (
        <div
          style={{
            backgroundImage: "url(./images/logo.jpg)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          className="login_image"
        >
          <h4 className="title">Welcome to Apex Innovations</h4>
          <div className="login_content">
            <EmployeeLogin />
          </div>
        </div>
      ) : (
        <div className="overlay">
          <PuffLoader css={override} size={150} color={'#E50914'} loading={!imageLoaded} />
        </div>
      )}
    </>
  )
}

export default EmployeeLoginPage