import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useEditProfile from '../../hooks/edite-hooks';
import '../profiledeatiles/edit-profile/edit-profile.css';
import { MenuItem, Select } from '@mui/material';


const ProfileEditDialog = ({ user, onProfileUpdated }) => {
  const [open, setOpen] = useState(false);
  const { editProfile, loading, error, response } = useEditProfile();
  const seekingMapToText = {
    1: "Part-time",
    2: "Fulltime",
    3: "Freelancer"
  };

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    figma: user.figma || '',
    experience: user.experience || '',
    birth_date: user.birth_date || '',
    cover_photo: user.cover_photo || '',
    profile_picture: user.profile_picture || '',
    seeking: user.seeking ? parseInt(user.seeking) : '',
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0]
        : name === "seeking" ? parseInt(value)
          : value
    }));
  };


  const handleSubmit = async () => {
    const data = new FormData();

    for (const key in formData) {
      const originalValue = user[key];

      if ((key === 'cover_photo' || key === 'profile_picture') && formData[key] instanceof File) {
        data.append(key, formData[key]);
        data.append('figma', formData.figma);
      } else if (String(formData[key]) !== String(originalValue)) {
        data.append(key, formData[key]);
      }
    }


    if (!Array.from(data.keys()).length) {
      setOpen(false);
      return;
    }

    await editProfile(data);
    if (!error) setOpen(false);
    if (onProfileUpdated) onProfileUpdated();
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        className="edit-icon"
        title="edit-profile"
      >
        <EditIcon />
      </IconButton>



      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle> edite profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label=" email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label=" phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="figma"
            name="figma"
            value={formData.figma}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="experince"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            fullWidth
          />
          <Select
            labelId="seeking-label"
            name="seeking"
            value={formData.seeking}
            onChange={handleChange}
            label="Seeking"
          >
            <MenuItem value={1}>Part-time</MenuItem>
            <MenuItem value={2}>Fulltime</MenuItem>
            <MenuItem value={3}>Freelancer</MenuItem>
          </Select>

          <TextField
            margin="dense"
            label=" birth_date"
            name="birth_date"
            type="date"
            value={formData.birth_date || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Cover Photo"
            name="cover_photo"
            type="file"
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Profile Picture"
            name="profile_picture"
            type="file"
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />


          {user.cover_photo && (
            <img
              src={`http://localhost:8000/storage/${user.cover_photo.replace(/^uploads\//, '')}`}
              alt="Cover"
              style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '10px' }}
            />
          )}

          {user.profile_picture && (
            <img
              src={`http://localhost:8000/storage/${user.profile_picture.replace(/^uploads\//, '')}`}
              alt="Profile"
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }}
            />
          )}


          {error && <p style={{ color: 'red' }}>error: {error.message}</p>}
          {response && <p style={{ color: 'green' }}> save success</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? ' loading...' : 'save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileEditDialog;
