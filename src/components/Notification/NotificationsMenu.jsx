import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notifications } from '../../services/Notification';
import Divider from '@mui/material/Divider';

const NotificationsMenu = () => {
  const [notificationsList, setNotificationsList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await notifications();
        // console.log('🔥 Notifications data:', data);
        setNotificationsList(data?.data ?? data ?? []);
      } catch (err) {
        console.error('خطأ في جلب الإشعارات:', err);
      }
    };
    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-controls="notification-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge badgeContent={notificationsList?.length ?? 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <h4 style={{ margin: '8px 16px 0' }}>🔔 إشعاراتك</h4>
        <Divider />
        {notificationsList?.length === 0 ? (
          <MenuItem onClick={handleClose}>لا توجد إشعارات</MenuItem>
        ) : (
          notificationsList.map((n) => (
            <MenuItem key={n.id} onClick={handleClose}>
              <ListItemText
                primary={n.data?.title}
                secondary={n.data?.caption}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
