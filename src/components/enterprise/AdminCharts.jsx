import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { colors } from '../../theme/theme';

const CHART_COLORS = [colors.primary, '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

export const RevenueTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.primary} stopOpacity={0.4} />
          <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
      <XAxis dataKey="month" stroke={colors.textSecondary} fontSize={12} />
      <YAxis stroke={colors.textSecondary} fontSize={12} />
      <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.border}` }} />
      <Area type="monotone" dataKey="revenue" stroke={colors.primary} fill="url(#revGrad)" strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);

export const LeaseStatusChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
        {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
      </Pie>
      <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.border}` }} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const OccupancyChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
      <XAxis type="number" domain={[0, 100]} stroke={colors.textSecondary} fontSize={12} />
      <YAxis type="category" dataKey="name" width={100} stroke={colors.textSecondary} fontSize={11} />
      <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.border}` }} />
      <Bar dataKey="occupancy" fill={colors.primary} radius={[0, 4, 4, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const UserDistributionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
      <XAxis dataKey="role" stroke={colors.textSecondary} fontSize={12} />
      <YAxis stroke={colors.textSecondary} fontSize={12} />
      <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.border}` }} />
      <Bar dataKey="count" fill={colors.primaryLight} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
