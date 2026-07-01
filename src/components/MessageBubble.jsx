import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PersonIcon from '@mui/icons-material/Person'
import ResultTable from './ResultTable'
import ResultChart from './ResultChart'
import { autColors } from '../theme'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        flexDirection: isUser ? 'row-reverse' : 'row',
        mb: 2.5,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? autColors.blue : autColors.navy,
          width: 32,
          height: 32,
        }}
      >
        {isUser ? (
          <PersonIcon fontSize="small" />
        ) : (
          <AutoAwesomeIcon fontSize="small" />
        )}
      </Avatar>

      <Box sx={{ maxWidth: '78%', width: isUser ? 'auto' : '78%' }}>
        <Paper
          elevation={0}
          variant={isUser ? 'elevation' : 'outlined'}
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: 3,
            bgcolor: isUser ? autColors.navy : 'background.paper',
            color: isUser ? '#fff' : 'text.primary',
            border: isUser ? 'none' : `1px solid ${autColors.border}`,
          }}
        >
          {isUser && <Typography variant="body1">{message.text}</Typography>}

          {!isUser && message.loading && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}
            >
              <CircularProgress size={18} thickness={5} />
              <Typography variant="body2" color="text.secondary">
                Querying the enrolments data...
              </Typography>
            </Box>
          )}

          {!isUser && !message.loading && message.error && (
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
              {message.error}
            </Alert>
          )}

          {!isUser && !message.loading && !message.error && (
            <>
              <Typography variant="body1">{message.summary}</Typography>

              <ResultChart chart={message.chart} />
              <ResultTable table={message.table} />

              {message.sql && (
                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{
                    mt: 1.5,
                    bgcolor: 'transparent',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon fontSize="small" />}
                    sx={{
                      minHeight: 32,
                      px: 0,
                      '& .MuiAccordionSummary-content': { my: 0.5 },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      View generated SQL
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0 }}>
                    <Box
                      component="pre"
                      sx={{
                        bgcolor: autColors.navy,
                        color: '#e7f7ff',
                        p: 1.5,
                        borderRadius: 2,
                        fontSize: 12.5,
                        overflowX: 'auto',
                        m: 0,
                      }}
                    >
                      {message.sql}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}
