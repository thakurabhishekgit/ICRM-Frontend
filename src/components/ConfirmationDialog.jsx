import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { colors } from '../theme/theme';

const ConfirmationDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  confirmColor = 'primary',
  loading = false,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { bgcolor: colors.card, border: `1px solid ${colors.border}` } }}
  >
    <DialogTitle sx={{ fontWeight: 700, color: colors.textPrimary }}>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: colors.textSecondary }}>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} disabled={loading}>{cancelText}</Button>
      <Button onClick={onConfirm} color={confirmColor} variant="contained" disabled={loading} autoFocus>
        {loading ? 'Processing...' : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
