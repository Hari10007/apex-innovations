import React from 'react'
import { useSelector } from 'react-redux'
import { selectPageLoader } from '../../redux-toolkit/loaderSlice'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function ModalLoader() {
    const isLoading = useSelector(selectPageLoader)

  return (
    <>
        {isLoading &&
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        }
    </>
  )
}

export default ModalLoader
