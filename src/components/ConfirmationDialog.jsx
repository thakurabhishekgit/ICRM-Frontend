import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export const ConfirmationDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  confirmColor = 'primary',
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 600, color: '#0f172a' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#475569', fontSize: '0.95rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="secondary" variant="text">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
