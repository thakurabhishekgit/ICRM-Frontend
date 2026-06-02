import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { colors } from '../../theme/theme';

const LeaseRequestModal = ({ open, property, message, loading, error, onClose, onChange, onSubmit }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: colors.card, border: `1px solid ${colors.border}` } }}>
    <DialogTitle sx={{ fontWeight: 700 }}>Submit Lease Request</DialogTitle>
    <DialogContent>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
        Property: <strong style={{ color: colors.textPrimary }}>{property?.title}</strong>
      </Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        autoFocus
        fullWidth
        multiline
        rows={4}
        label="Message"
        value={message}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        placeholder="Introduce your business and leasing requirements..."
      />
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button onClick={onSubmit} variant="contained" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default LeaseRequestModal;
