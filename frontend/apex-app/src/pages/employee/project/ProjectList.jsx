import React, { useState } from 'react'
import ProjectButton from '../../../components/manager_components/project/ProjectButton'
import SearchBar from '../../../components/manager_components/project/SearchBar'
import ProjectCard from '../../../components/manager_components/project/ProjectCard'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux-toolkit/userSlice';
import EmployeeProjectCard from '../../../components/employee_components/project/EmployeeProjectCard';
import AllProjectCard from '../../../components/primary_manager_components/project/AllProjectCard';

function ProjectList() {
  const [searchValue, setSearchValue] = useState('');
  const employee = useSelector(selectUser);

  const handleSearch = (e) =>{
    setSearchValue(e.target.value);
  }

  return (
    <>  
      {employee?.manager  &&
        <>   
          <ProjectButton />
          <SearchBar handleSearch={handleSearch} searchValue={searchValue}/>
          <ProjectCard searchValue={searchValue}/>
        </>
      }
      {employee?.admin ? 
        <>   
          <SearchBar handleSearch={handleSearch} searchValue={searchValue}/>
          <AllProjectCard searchValue={searchValue} />
        </>
        : !employee?.manager && (
        <>
          <SearchBar handleSearch={handleSearch} searchValue={searchValue} />
          <EmployeeProjectCard searchValue={searchValue} />
        </>)
      }
    </>
  )
}

export default ProjectList
