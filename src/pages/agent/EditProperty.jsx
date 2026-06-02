import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Alert, Button, Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PropertyForm from '../../components/properties/PropertyForm';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import propertyService from '../../api/services/propertyService';
import aiService from '../../api/services/aiService';
import { useToast } from '../../context/ToastContext';
import { buildPropertyPayload, normalizePropertyType } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { colors } from '../../theme/theme';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roiLoading, setRoiLoading] = useState(false);
  const [roiResult, setRoiResult] = useState(null);

  useEffect(() => {
    propertyService
      .getMyPropertyById(id)
      .then((data) => {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          price: String(data.price ?? ''),
          propertyType: normalizePropertyType(data.propertyType) ?? 1,
          totalUnits: String(data.totalUnits ?? ''),
          occupiedUnits: String(data.occupiedUnits ?? '0'),
          monthlyMaintenanceCost: String(data.monthlyMaintenanceCost ?? ''),
          monthlyRevenue: String(data.monthlyRevenue ?? ''),
          roi: String(data.roi ?? ''),
          amenities: data.amenities || '',
          thumbnailUrl: data.thumbnailUrl || '',
        });
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleTypeChange = (e) => setFormData((f) => ({ ...f, propertyType: parseInt(e.target.value, 10) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await propertyService.updateProperty(id, buildPropertyPayload(formData));
      showToast('Property updated successfully');
      navigate('/agent/properties');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRoiAnalysis = async () => {
    setRoiLoading(true);
    try {
      const data = await aiService.analyzeRoi(id);
      setRoiResult(data);
      showToast('ROI analysis complete');
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setRoiLoading(false);
    }
  };

  if (fetching) return <Loader message="Loading property..." />;
  if (!formData) return <Alert severity="error">{error || 'Property not found.'}</Alert>;

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Edit Property" subtitle="Update your property listing details." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" startIcon={roiLoading ? <CircularProgress size={18} /> : <AutoAwesomeIcon />} onClick={handleRoiAnalysis} disabled={roiLoading}>
          Analyze ROI with AI
        </Button>
      </Box>

      {roiResult && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: colors.surface, border: `1px solid ${colors.primary}`, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>ROI Score: {roiResult.roiScore}/10</Typography>
          <Typography sx={{ color: colors.textSecondary, mb: 2 }}>{roiResult.analysis}</Typography>
          {roiResult.recommendations?.length > 0 && (
            <List dense>
              {roiResult.recommendations.map((r) => (
                <ListItem key={r} sx={{ py: 0 }}><ListItemText primary={r} /></ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 4, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <PropertyForm formData={formData} onChange={handleChange} onTypeChange={handleTypeChange} loading={loading} onSubmit={handleSubmit} submitLabel="Update Property" />
      </Paper>
    </>
  );
};

export default EditProperty;
