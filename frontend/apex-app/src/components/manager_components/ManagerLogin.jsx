import React , {useState} from 'react'
import '../css/Login.css'
import jwt from 'jwt-decode'
import {useDispatch} from 'react-redux'
import { login } from '../../redux-toolkit/userSlice'
import Cookies from 'js-cookie';

function ManagerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch('')

  const submit = async (e) => {
      e.preventDefault();

      const response =  await fetch('http://localhost:8000/api/manager_login', 
      {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              'email':email,
              'password':password
          })
      });

      const content = await response.json();

      if (response.status === 200){
        const decode_token = jwt(content.access)

        const ACCESS_TOKEN_LIFETIME = 1; // hour
        const accessTokenExpires = new Date(Date.now() + ACCESS_TOKEN_LIFETIME * 60 * 60 * 1000);

        Cookies.set('access_token', content.access, { expires: accessTokenExpires});
        Cookies.set('refresh_token', content.refresh, { expires: 90});

        dispatch(login(decode_token));
      }
      else{
        setMessage(content.detail)
      }
  }

  return (
      <main className="form-sign-in w-100 m-auto">
        <form onSubmit={submit}>
          <h1 className="h3 mb-3 fw-normal">Manager Login</h1>
          <p className='text-danger'>{message}</p>
          <div className="form-floating">
            <input type="email" className="form-control" onChange={e => setEmail(e.target.value)}/>
            <label>Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
            <label>Password</label>
          </div>

          <button className="w-100 btn btn-lg btn-secondary" type="submit">Log in</button>
        </form>
        
      </main>
  )
}

export default ManagerLogin
