import { createTheme } from '@mui/material/styles'

export const autColors = {
  navy: '#092A4A',
  navyLight: '#14456F',
  blue: '#0073C9',
  cyan: '#00A9E0',
  paper: '#F4F8FC',
  ink: '#14233B',
  muted: '#5D6B7D',
  border: '#D9E5F0',
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: autColors.navy,
      light: autColors.navyLight,
      contrastText: '#fff',
    },
    secondary: { main: autColors.cyan, contrastText: autColors.navy },
    background: { default: autColors.paper, paper: '#ffffff' },
    text: { primary: autColors.ink, secondary: autColors.muted },
    divider: autColors.border,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', boxShadow: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${autColors.border}` },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fff',
          },
        },
      },
    },
  },
})

export default theme
export const CHART_COLORS = [
  autColors.blue,
  autColors.cyan,
  '#34B9C6',
  '#7C4DFF',
  '#FF6B6B',
  '#FFB84D',
]
