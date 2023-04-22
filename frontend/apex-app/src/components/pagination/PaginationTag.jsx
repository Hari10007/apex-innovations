import React from 'react'
import { Pagination } from 'react-bootstrap'

function PaginationTag({currentPage, pageNumbers, handlePageChange}) {

  return (
    <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination >
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {pageNumbers.map((pageNumber) => (
                    <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageNumbers.length} />
                <Pagination.Last onClick={() => handlePageChange(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
            </Pagination>
        </div>
    </>
  )
}

export default PaginationTag
