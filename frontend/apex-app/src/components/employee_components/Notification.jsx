import { useState, useEffect} from 'react';
import React from 'react';
import '../css/Notification.css'
import Spinner from 'react-bootstrap/Spinner';
import useAxios from '../../utilis/useAxios';
import { useSelector } from 'react-redux';
import { selectNotificationLoader } from '../../redux-toolkit/loaderSlice';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import { Divider, Tooltip } from '@mui/material';
import moment from 'moment';
import { selectUser } from '../../redux-toolkit/userSlice';

function Notification() {
  const employee = useSelector(selectUser);
  const [unread, setUnread] = useState(0);
  const [notifications ,setNotifications] = useState(false);
  const api = useAxios();
  const loading = useSelector(selectNotificationLoader)
  const [anchorEl, setAnchorEl] = useState(null);

  
  const open = Boolean(anchorEl);
  const id = open && 'notification-popover'   

  const fetchNotification = async() =>{
    try {
      const response = await api.get("notification/notifications");
      if (response.status === 200) {
        setNotifications(response.data.notifications);
        setUnread(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const resetCount = async()=>{
    const response = await api.post("notification/reset_notification");
    
    if (response.status === 200){
        setUnread(response.data)
    }
  }

  const connectWebsocket = () => {
    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${employee.id}/`);

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection established');
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        fetchNotification();
    });

    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed');
    });

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });
  }

  useEffect(() => {
    connectWebsocket();
    fetchNotification();
  }, []);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    resetCount();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // useEffect(() => {
  //   if (open) {
  //     console.log(open)
  //     resetCount();
  //   }
  // }, [open]);


  return (
    <div className="notification mx-4">
      <Tooltip title="Notifications">
        <IconButton color="primary" onClick={handleClick}>
          <Badge badgeContent={unread} color="secondary" overlap="rectangular">
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List
          subheader={<ListSubheader  style={{ backgroundColor: 'lightgray' }}>Notifications</ListSubheader>}
        > 
          <div style={{ maxHeight: 300, minWidth: 300, overflow: 'auto' }}>
            <style>
            {`
              ::-webkit-scrollbar {
                width: 10px;
              }
              ::-webkit-scrollbar-track {
                background-color: #f5f5f5;
              }
              ::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 5px;
              }
            `}
          </style>
          {loading ? (
            <div className="spinner-wrapper my-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
              <>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={notification.message}
                          secondary={moment(notification.date_created).format('MMM D, YYYY')}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))
                  ) : 
                  ( 
                  <p className='text-center my-3'>No Notifications</p>
                  )
                }
              </>
              )}
            </div>
        </List>
      </Popover>
    </div>
  );
}

export default Notification