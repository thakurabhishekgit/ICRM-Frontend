import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Button, Alert, TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, CircularProgress, Card, CardContent, CardActions,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PageHeader from '../../components/dashboard/PageHeader';
import aiService from '../../api/services/aiService';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { PROPERTY_TYPE_OPTIONS } from '../../utils/formatters';
import { colors } from '../../theme/theme';

const TenantRecommendations = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ location: '', budget: '', propertyType: 'Office' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const data = await aiService.recommendProperties({
        location: form.location.trim(),
        budget: parseFloat(form.budget),
        propertyType: form.propertyType,
      });
      setResults(data?.recommendedProperties ?? []);
      if (!data?.recommendedProperties?.length) {
        showToast('No matching properties found for your criteria', 'info');
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader title="AI Property Recommendations" subtitle="Get personalized property suggestions based on your preferences." />

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField required fullWidth label="Preferred Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Mumbai" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField required fullWidth type="number" label="Max Monthly Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} InputProps={{ inputProps: { min: 1 } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Property Type</InputLabel>
              <Select label="Property Type" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                {PROPERTY_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.label}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />} disabled={loading}>
              Get AI Recommendations
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {results.length > 0 && (
        <Grid container spacing={3}>
          {results.map((rec) => (
            <Grid key={rec.propertyId} size={{ xs: 12, md: 6 }}>
              <Card sx={{ bgcolor: colors.card, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{rec.propertyName}</Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1 }}>{rec.reason}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/properties/${rec.propertyId}`)}>View Property</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TenantRecommendations;
