import { createTheme, alpha } from '@mui/material/styles';

const colors = {
  background: '#0f1117',
  surface: '#181c25',
  card: '#202632',
  border: '#2d3443',
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  textPrimary: '#ffffff',
  textSecondary: '#a0a7b5',
  success: '#22c55e',
  error: '#ef4444',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.textSecondary,
      contrastText: colors.textPrimary,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    divider: colors.border,
    success: { main: colors.success },
    error: { main: colors.error },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontFamilyHeading: '"Outfit", "Inter", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: '1.35rem',
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: '1.15rem',
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      color: colors.textSecondary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.textSecondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.4)',
    '0 4px 12px rgba(0,0,0,0.35)',
    '0 8px 24px rgba(0,0,0,0.4)',
    '0 12px 40px rgba(0,0,0,0.45)',
    '0 16px 48px rgba(0,0,0,0.5)',
    ...Array(19).fill('0 16px 48px rgba(0,0,0,0.5)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
          color: colors.textPrimary,
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          boxShadow: 'none',
          transition: 'all 0.25s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
            boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`,
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: alpha(colors.primary, 0.5),
          '&:hover': {
            borderColor: colors.primary,
            backgroundColor: alpha(colors.primary, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha(colors.surface, 0.6),
            borderRadius: 10,
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: alpha(colors.primary, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha(colors.background, 0.75),
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.primaryLight,
          textDecoration: 'none',
          '&:hover': {
            color: colors.primary,
          },
        },
      },
    },
  },
});

export { colors };
export default theme;
