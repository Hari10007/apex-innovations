import React, { useEffect, useState } from 'react'
import useAxios from '../../../utilis/useAxios'
import PaginationTag from '../../pagination/PaginationTag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeProjectCard({searchValue}) {
  const[projects, setProjects] = useState([]);
  const api = useAxios();

  const params = useParams();
  const itemsPerPage = 6;
  const [pages, setPages] = useState();
  const navigate = useNavigate();
  const currentPage = parseInt(params.pageNumber);
  

  const fetchProjects = async ()=>{
    try{
      const response = await api.get(`api/project/employee_projects?page=${currentPage}&perPage=${itemsPerPage}&keyword=${searchValue}`)

      if (response.status === 200){
        setProjects(response.data.project)
        setPages(response.data.page_count)
      }
    }
    catch(error){

    }
  }

  useEffect(()=>{
    fetchProjects();
  },[currentPage, itemsPerPage, searchValue])

  const handlePageChange = (pageNumber) => {
    navigate(`/project/page/${pageNumber}`);
  };

  //convert pages to array for pagination
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);


  return (
    <>
      <div className="my-5 d-flex justify-content-between align-items-center">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-5">
          {projects.map((project, index) => (
            <div className="col-md-6 col-lg-4" key={index} style={{ cursor: 'pointer' }}>
              <div className="card border-info text-center h-100">
                <img src={project.image ? `http://localhost:8000/api${project.image}` : ''} className="card-img-top img-fluid" alt="Project" />
                <div className="card-body">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text">{project.description}</p>
                </div>
                <div className='card-footer'>
                  {project.status === "active" && <p><FontAwesomeIcon icon={faCircle} style={{ color: 'green', fontSize: '0.8rem' }} /><span style={{ marginLeft: '0.3rem' }}>Active</span></p>}
                  {project.status === "on_hold" && <p><FontAwesomeIcon icon={faCircle} style={{ color: 'orange', fontSize: '0.8rem' }} /><span style={{ marginLeft: '0.3rem' }}> On Hold</span></p>}
                  {project.status === "cancelled" && <p><FontAwesomeIcon icon={faCircle} style={{ color: 'red', fontSize: '0.8rem' }} /><span style={{ marginLeft: '0.3rem' }}> Cancelled</span></p>}
                  {project.status === "completed" && <p><FontAwesomeIcon icon={faCircle} style={{ color: 'blue', fontSize: '0.8rem' }} /><span style={{ marginLeft: '0.3rem' }}> Completed</span></p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
    </>
  )
}

export default EmployeeProjectCard