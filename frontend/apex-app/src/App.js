import './App.css';

import { useSelector } from 'react-redux'
import { selectUser } from './redux-toolkit/userSlice';
import AdminRoutes from './routes/AdminRoutes';
import EmployeeRoutes from './routes/EmployeeRoutes';
import ManagerRoutes from './routes/ManagerRoutes';


function App() {
  const employee = useSelector(selectUser)

  return (
    <div className="App">
        <EmployeeRoutes /> 
        <AdminRoutes />
        <ManagerRoutes />
            
      </div>
  );
}
export default App;
