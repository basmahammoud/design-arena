import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useNotifications } from "../../hooks/useNotification";

const NotificationsMenu = () => {
  const { notifications, loading, error, markAllRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

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
        <Badge badgeContent={notifications?.length ?? 0} color="error">
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px" }}>
          <h4 style={{ margin: 0 }}>🔔 إشعاراتك</h4>
          {notifications?.length > 0 && (
            <Button size="small" onClick={markAllRead}>
              تمييز الكل كمقروء
            </Button>
          )}
        </div>
        <Divider />

        {loading ? (
          <MenuItem disabled>⏳ جاري التحميل...</MenuItem>
        ) : error ? (
          <MenuItem disabled>⚠️ حدث خطأ أثناء جلب الإشعارات</MenuItem>
        ) : notifications?.length === 0 ? (
          <MenuItem onClick={handleClose}>لا توجد إشعارات</MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem key={n.id} onClick={handleClose}>
              <ListItemText
                primary={n.data?.title ?? "بدون عنوان"}
                secondary={n.data?.caption ?? ""}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
