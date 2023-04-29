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

function Notification() {
  const [unread, setUnread] = useState(0);
  const [notifications ,setNotifications] = useState(false);
  const api = useAxios();
  const loading = useSelector(selectNotificationLoader)
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchNotification = async() =>{


    try {
      const response = await api.get("api/notification/notifications");
      if (response.status === 200) {
        setNotifications(response.data.notifications);
        setUnread(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const resetCount = async()=>{
    const response = await api.post("api/notification/reset_notification");
    
    if (response.status === 200){
        setUnread(response.data)
    }
  }

  useEffect(() => {
    fetchNotification();
  }, []);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    resetCount();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;


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
      {/* <i className="fa-regular fa-bell" onClick={handleClick} />
      {unread > 0 && <span className="badge">{unread}</span>}
      {showList &&
         <div className="notification-list">
           {loading ? (
              <Spinner animation="border" role="status" style={{zIndex: 9999}}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
            <ul>
              {notifications && notifications.length > 0  ? notifications?.map((notification, index) => (
                <li key={index}>{notification.message}</li>
              )) : (
                <p>No Notifications</p>
              )}
            </ul>
          )}
       </div>
      } */}
    </div>
  );
}

export default Notification