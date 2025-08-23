import React from 'react';
import { Modal, Box, Button, Typography, Stack } from '@mui/material';
import './chose-design.css';

const ChoseDesign = ({ open, handleClose, handleChoose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <Typography variant="h6" gutterBottom>
          ماذا تريد أن تبتكر اليوم؟
        </Typography>
        <Stack direction="column" spacing={2} mt={2}>
          <Button
            variant="contained"
            onClick={() => handleChoose('web')}
            className="choose-btn"
          >
            تصميم موقع ويب
          </Button>
          <Button
            variant="contained"
            onClick={() => handleChoose('mobile')}
            className="choose-btn"
          >
            تصميم تطبيق موبايل
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChoseDesign;
