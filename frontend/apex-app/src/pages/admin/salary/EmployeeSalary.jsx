import React from 'react'
import SalaryTable from '../../../components/admin_components/salary/SalaryTable'
import { useState } from 'react';


function EmployeeSalary() {

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) =>{
        setSearchValue(e.target.value);
    }

    return (
        <div className='d-flex flex-column my-1'>
            <div className='col-md-3 my-3'>
                <input type="text" className="form-control" onChange={handleSearch} value={searchValue}  placeholder='Search Employee here' />
            </div>
            <SalaryTable  searchValue={searchValue} />
        </div>
    )
}

export default EmployeeSalary
