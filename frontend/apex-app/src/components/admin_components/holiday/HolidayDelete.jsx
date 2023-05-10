import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useAxios from '../../../utilis/useAxios';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { useDispatch } from 'react-redux';

function HolidayDelete({ open, onClose, holiday, handle_holiday }) {
    const api = useAxios();
    const dispatch = useDispatch();

    const handleClose = () => {
      onClose();
    };

    const deleteHoliday = async(holiday) =>{
        const response = await api.delete(`holiday/delete/${holiday.id}`)

        if(response.status === 200){
            dispatch(setMessage({ message: response.data.message, type: response.data.status }));
            handle_holiday(holiday);
            handleClose();
        }
    }
  
    const handleAgree = () => {
      // call API to delete holiday
      deleteHoliday(holiday);
    };
    
  return (
    <>

      <Dialog
        open={open} 
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete this holiday?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
             {holiday.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" color="error" autoFocus onClick={handleAgree}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default HolidayDelete