require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { errorHandler, notFound } = require('./middleware/error')
const routes = require('./routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString(encoding || 'utf8'))
    } catch (e) {
      console.log('JSON Parse Error:', e.message)
      console.log('Request Body:', buf.toString())
      throw e
    }
  }
}))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', routes.api)
app.use('/admin', routes.admin)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
