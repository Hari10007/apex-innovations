import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function ProjectButton() {
  const navigate = useNavigate();
  const handleButton  = () =>{
    navigate('/project/create_project');
  }

  return (
    <>
      <div className='row my-4 d-flex align-items-right justify-content-end'>
        <div className='col-md-3'>
            <Button onClick={() => handleButton()}> <i className="fa-solid fa-plus"></i> Create Project</Button>
        </div>
      </div>
    </>
  )
}

export default ProjectButton
