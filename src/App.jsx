import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { ping } from './api.js'

function App() {
  const [response, setResponse] = useState(null)

  const handlePing = async () => {
    const data = await ping()
    setResponse(data.message)
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Hello World!
        </Typography>
        <Button variant="contained" onClick={handlePing}>
          Ping
        </Button>
        {response && (
          <Typography variant="body1" color="text.secondary">
            {response}
          </Typography>
        )}
      </Box>
    </Container>
  )
}

export default App
