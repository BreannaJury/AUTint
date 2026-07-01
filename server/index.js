const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
})

app.listen(3001, () => console.log('API running on port 3001'))
