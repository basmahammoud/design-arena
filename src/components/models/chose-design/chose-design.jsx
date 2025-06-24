import React from 'react';
import { Modal, Box, Button, Typography, Stack } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  minWidth: 300,
  textAlign: 'center',
  overflow: 'hidden'
};

const buttonStyle = {
  backgroundColor: '#830061',
  '&:hover': {
    backgroundColor: '#6b004f'
  }
};


const ChoseDesign = ({ open, handleClose, handleChoose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          ماذا تريد أن تبتكر اليوم؟
        </Typography>
        <Stack direction="column" spacing={2} mt={2}>
         <Button variant="contained" onClick={() => handleChoose('web')} sx={buttonStyle}>
            تصميم موقع ويب
           </Button>
        <Button variant="contained" onClick={() => handleChoose('mobile')} sx={buttonStyle}>
           تصميم تطبيق موبايل
            </Button>

        </Stack>
      </Box>
    </Modal>
  );
};

export default ChoseDesign;
