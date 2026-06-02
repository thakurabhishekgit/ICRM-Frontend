import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropertyForm from '../../components/properties/PropertyForm';
import PageHeader from '../../components/dashboard/PageHeader';
import propertyService from '../../api/services/propertyService';
import { useToast } from '../../context/ToastContext';
import { buildPropertyPayload } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { colors } from '../../theme/theme';

const initialForm = {
  title: '', description: '', location: '', price: '', propertyType: 1,
  totalUnits: '', occupiedUnits: '0', monthlyMaintenanceCost: '', monthlyRevenue: '', roi: '', amenities: '', thumbnailUrl: '',
};

const CreateProperty = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleTypeChange = (e) => setFormData((f) => ({ ...f, propertyType: parseInt(e.target.value, 10) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await propertyService.createProperty(buildPropertyPayload(formData));
      showToast('Property created successfully');
      navigate('/agent/properties');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Create Property" subtitle="Add a new commercial property listing." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 4, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <PropertyForm formData={formData} onChange={handleChange} onTypeChange={handleTypeChange} loading={loading} onSubmit={handleSubmit} submitLabel="Create Property" />
      </Paper>
    </>
  );
};

export default CreateProperty;
