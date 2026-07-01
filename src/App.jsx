import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import SendIcon from '@mui/icons-material/Send'
import SchoolIcon from '@mui/icons-material/School'
import MessageBubble from './components/MessageBubble'
import { askQuestion } from './api.js'
import { autColors } from './theme.js'

const SUGGESTIONS = [
  'How many students were in the Business programme by year for the last 5 years?',
  'Compare domestic vs international students in 2024',
  'Which faculty had the most enrolments last year?',
  'Show postgraduate enrolment trend for Computer Science',
]

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      summary:
        "Kia ora! I'm a prototype chat-with-data assistant for AUT enrolments. Ask me about student numbers by year, programme, faculty, level, or domestic/international split.",
      table: null,
      chart: null,
      sql: null,
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  async function handleSend(text) {
    const question = (text ?? input).trim()
    if (!question || busy) return

    setInput('')
    setBusy(true)
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', loading: true },
    ])

    try {
      const data = await askQuestion(question)
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          role: 'assistant',
          summary: data.summary,
          table: data.table,
          chart: data.chart,
          sql: data.sql,
        }
        return next
      })
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', error: err.message }
        return next
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: autColors.navy }}>
        <Toolbar>
          <SchoolIcon sx={{ mr: 1.5 }} />
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
              AUT · Chat with your Data
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Enrolments prototype &middot; ask a question in plain English
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 3,
          minHeight: 0,
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            pr: 1,
            mb: 2,
          }}
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
        </Box>

        {messages.length <= 1 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            {SUGGESTIONS.map((s) => (
              <Chip
                key={s}
                label={s}
                onClick={() => handleSend(s)}
                sx={{
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  border: `1px solid ${autColors.cyan}44`,
                  '&:hover': { borderColor: autColors.blue, bgcolor: '#fff' },
                }}
                clickable
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask about student enrolments..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            size="medium"
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
            disabled={busy}
          />
          <IconButton
            onClick={() => handleSend()}
            disabled={busy || !input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': { bgcolor: 'primary.light' },
              '&.Mui-disabled': { bgcolor: '#cfd6e0' },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  )
}

export default App
