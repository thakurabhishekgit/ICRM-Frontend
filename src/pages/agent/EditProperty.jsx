import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropertyForm from '../../components/properties/PropertyForm';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import propertyService from '../../api/services/propertyService';
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

  if (fetching) return <Loader message="Loading property..." />;
  if (!formData) return <Alert severity="error">{error || 'Property not found.'}</Alert>;

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Edit Property" subtitle="Update your property listing details." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 4, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <PropertyForm formData={formData} onChange={handleChange} onTypeChange={handleTypeChange} loading={loading} onSubmit={handleSubmit} submitLabel="Update Property" />
      </Paper>
    </>
  );
};

export default EditProperty;
