import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

const EditDesignModal = ({ isOpen, onClose, design, onSave, navigate }) => {
  const [name, setName] = useState('');
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    if (design) {
      setName(design.name || '');
      setJsonData(JSON.stringify(design.json_data || {}, null, 2));
    }
  }, [design]);

  if (!isOpen || !design) return null;

  const handleSubmit = () => {
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonData);
    } catch (e) {
      alert('⚠️ JSON غير صالح!');
      return;
    }
    parsedJson.name = name;
    onSave({ name, json_data: parsedJson });
  };

  const handleEditDesign = () => {
    localStorage.removeItem('editor-elements-desktop');
    navigate(`/editor?type=desktop/${design.id}`, {
      state: { designId: design.id },
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>تعديل التصميم</DialogTitle>

      <DialogContent dividers>
        <TextField
          label="اسم التصميم"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          حفظ
        </Button>
        <Button onClick={handleEditDesign} variant="outlined" color="secondary">
          تعديل في المحرر
        </Button>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDesignModal;
