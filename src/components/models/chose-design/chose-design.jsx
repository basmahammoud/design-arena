import React, { useRef } from 'react';
import { Modal, Box, Button, Typography, Stack } from '@mui/material';
import './chose-design.css';
import useUploadDesign from '../../../hooks/uploadDesignImage';

const ChoseDesign = ({ open, handleClose, handleChoose }) => {
  const fileInputRef = useRef(null);
  const { uploadDesign, uploading } = useUploadDesign();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await uploadDesign(file); 
      console.log('Upload successful:', result);
      handleClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <Typography variant="h6" gutterBottom>
          what do you want to create
        </Typography>
        <Stack direction="column" spacing={2} mt={2}>
          <Button
            variant="contained"
            onClick={() => handleChoose('web')}
            className="choose-btn"
          >
            web design
          </Button>
          <Button
            variant="contained"
            onClick={() => handleChoose('mobile')}
            className="choose-btn"
          >
            mobile design
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadClick}
            className="choose-btn"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload design'}
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChoseDesign;
