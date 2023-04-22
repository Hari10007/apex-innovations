import React from 'react'

function SearchBar({handleSearch, searchValue}) {
  
  return (
    <>
     <div className='row justify-content-center'>
        <div className='col-md-6'>
            <input type="text" className="form-control" onChange={handleSearch} value={searchValue}  placeholder='Search Project here ....' />
        </div>
     </div>
    </>
  )
}

export default SearchBar
