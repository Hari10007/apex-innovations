import React , {useState} from 'react'
import '../css/Login.css'
import jwt from 'jwt-decode'
import {useDispatch} from 'react-redux'
import Cookies from 'js-cookie';
import { login } from '../../redux-toolkit/userSlice'
import { baseURL } from '../../utilis/baseUrl';
import { ClipLoader } from 'react-spinners';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'react-bootstrap';

const initialValues = {
  email: '',
  password: '',
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});


function EmployeeLogin() {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch('')
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const response =  await fetch(`${baseURL}/login`,  {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              'email': values.email,
              'password': values.password
          })
      });

      const content = await response.json();

      if (response.status === 200){
        setIsLoading(false);
        const decode_token = jwt(content.access)

        const ACCESS_TOKEN_LIFETIME = 1; // hour
        const accessTokenExpires = new Date(Date.now() + ACCESS_TOKEN_LIFETIME * 60 * 60 * 1000);

        Cookies.set('access_token', content.access, { expires: accessTokenExpires});
        Cookies.set('refresh_token', content.refresh, { expires: 90});

        dispatch(login(decode_token));
      }
      else{
        setMessage(content.detail)
        setIsLoading(false);
      }
    },
  });
  

  return (
      <main className="form-sign-in w-100 m-auto">
        <Form onSubmit={formik.handleSubmit}>
          <h1 className="h3 mb-1">Login Page</h1>
          <p className='text-danger'>{message}</p>

          <div className="form-floating">
            <input 
              type="email" 
              className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`} 
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
              placeholder="Email"
              />
            {formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            <label>Email Address: </label>
          </div>

          <div className="form-floating mb-2">
              <input 
                type='password'
                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`} 
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
                placeholder="Password"
              />
            {formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
            <label>Password</label>
          </div>
  

          <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <ClipLoader size={20} color={'#ffffff'} loading={isLoading} />
            ) : (
              'Log in'
            )}
          </button>
        </Form>
        
      </main>
  )
}

export default EmployeeLogin
