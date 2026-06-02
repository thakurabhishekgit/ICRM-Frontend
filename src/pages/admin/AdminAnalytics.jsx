import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Button, Alert, TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, IconButton, Chip, Divider, CircularProgress,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import aiService from '../../api/services/aiService';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { formatDateTime } from '../../utils/formatters';
import { colors } from '../../theme/theme';

const AdminAnalytics = () => {
  const { showToast } = useToast();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [insights, setInsights] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = () => {
    setHistoryLoading(true);
    aiService.getInsights()
      .then(setInsights)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => { loadHistory(); }, []);

  const handleMonthlyReport = async () => {
    setReportLoading(true);
    setError('');
    try {
      const data = await aiService.generateMonthlyReport(month, year);
      setReport(data);
      showToast('Monthly AI report generated');
      loadHistory();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setReportLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await aiService.deleteInsight(id);
      showToast('Insight deleted');
      loadHistory();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    }
  };

  return (
    <Box>
      <PageHeader title="AI Insights" subtitle="Business intelligence powered by Gemini — not a chatbot." />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <InsightsIcon sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Monthly Portfolio Report</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
              Generates an executive summary from live portfolio metrics. Saved to AI history.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('en-IN', { month: 'long' })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField size="small" label="Year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} sx={{ width: 100 }} />
            </Box>
            <Button variant="contained" startIcon={reportLoading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />} onClick={handleMonthlyReport} disabled={reportLoading}>
              Generate Report
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>ROI Analysis</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Run ROI analysis from any property details page (Admin Properties → View Property, or Agent Properties → Edit Property → Analyze ROI).
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {report && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: colors.surface, border: `1px solid ${colors.primary}`, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{report.title}</Typography>
          <Typography sx={{ color: colors.textSecondary, mb: 2 }}>{report.summary}</Typography>
          {report.highlights?.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Highlights</Typography>
              <List dense>{report.highlights.map((h) => <ListItem key={h} sx={{ py: 0 }}><ListItemText primary={h} /></ListItem>)}</List>
            </>
          )}
          {report.recommendations?.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>Recommendations</Typography>
              <List dense>{report.recommendations.map((r) => <ListItem key={r} sx={{ py: 0 }}><ListItemText primary={r} /></ListItem>)}</List>
            </>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>AI Insight History</Typography>
        {historyLoading ? <Loader message="Loading insights..." /> : insights.length === 0 ? (
          <Typography sx={{ color: colors.textSecondary }}>No saved AI insights yet.</Typography>
        ) : (
          <List>
            {insights.map((item, idx) => (
              <Box key={item.id}>
                {idx > 0 && <Divider sx={{ borderColor: colors.border }} />}
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(item.id)} title="Delete">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={item.type} size="small" color="primary" variant="outlined" />
                        {item.propertyTitle && <Typography variant="body2" component="span">{item.propertyTitle}</Typography>}
                      </Box>
                    }
                    secondary={`${item.generatedByName} · ${formatDateTime(item.generatedAt)}`}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default AdminAnalytics;
