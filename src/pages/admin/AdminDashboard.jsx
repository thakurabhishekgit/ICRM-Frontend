import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArticleIcon from '@mui/icons-material/Article';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import { adminDashboardData } from '../../data/dummyDashboardData';
import { colors } from '../../theme/theme';

const tableSx = {
  head: { color: colors.textSecondary, fontWeight: 600, borderColor: colors.border },
  cell: { borderColor: colors.border },
};

const AdminDashboard = () => {
  const { stats, usersOverview, propertiesOverview, requestsOverview } = adminDashboardData;

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="System-wide overview of users, properties, requests, and leases."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard title="Total Users" value={stats.totalUsers} icon={PeopleIcon} accent="#3b82f6" />
        <StatCard title="Total Properties" value={stats.totalProperties} icon={HomeWorkIcon} accent="#22c55e" />
        <StatCard title="Lease Requests" value={stats.totalLeaseRequests} icon={ListAltIcon} accent="#f59e0b" />
        <StatCard title="Total Leases" value={stats.totalLeases} icon={ArticleIcon} accent="#8b5cf6" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <OverviewTable title="Users Overview" columns={['Name', 'Email', 'Role', 'Status']} rows={usersOverview} type="users" />
        <OverviewTable
          title="Properties Overview"
          columns={['Property', 'Location', 'Agent', 'Status']}
          rows={propertiesOverview}
          type="properties"
        />
        <OverviewTable
          title="Lease Requests Overview"
          columns={['Tenant', 'Property', 'Submitted', 'Status']}
          rows={requestsOverview}
          type="requests"
        />
      </Box>
    </>
  );
};

const OverviewTable = ({ title, columns, rows, type }) => (
  <Paper elevation={0} sx={{ bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{ p: 2.5, borderBottom: `1px solid ${colors.border}` }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={tableSx.head}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              {type === 'users' && (
                <>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textPrimary }}>{row.name}</TableCell>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textSecondary }}>{row.email}</TableCell>
                  <TableCell sx={tableSx.cell}>
                    <Chip label={row.role} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={tableSx.cell}>
                    <Chip label={row.status} size="small" color="success" variant="outlined" />
                  </TableCell>
                </>
              )}
              {type === 'properties' && (
                <>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textPrimary }}>{row.title}</TableCell>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textSecondary }}>{row.location}</TableCell>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textSecondary }}>{row.agent}</TableCell>
                  <TableCell sx={tableSx.cell}>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === 'Available' ? 'success' : 'primary'}
                      variant="outlined"
                    />
                  </TableCell>
                </>
              )}
              {type === 'requests' && (
                <>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textPrimary }}>{row.tenant}</TableCell>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textSecondary }}>{row.property}</TableCell>
                  <TableCell sx={{ ...tableSx.cell, color: colors.textSecondary }}>{row.submitted}</TableCell>
                  <TableCell sx={tableSx.cell}>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === 'Approved' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default AdminDashboard;
