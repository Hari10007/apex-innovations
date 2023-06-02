import { useEffect, useState } from 'react';
import './App.css';
import EmployeeRoutes from './routes/EmployeeRoutes';
import { baseURL } from './utilis/baseUrl';
import ErrorPage from './pages/employee/503Page';
import { css } from '@emotion/react';
import { PuffLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;


function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/check_connection`);
        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          setLoading(false);
          setError(false);
        } else {
          console.log('Error:', response.status); 
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    checkBackendConnection();
  }, []);
  
  return (
    <div className="App">
      {loading ? (
        <div className="overlay">
          <PuffLoader css={override} size={150} color={'#E50914'} loading={loading} />
        </div>
      ) : error ? (
        <ErrorPage />
      ) : (
        <EmployeeRoutes />
      )}
      </div>
  );
}
export default App;
