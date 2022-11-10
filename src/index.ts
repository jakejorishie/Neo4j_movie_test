import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan' 

dotenv.config()
import './config/index'

const app = express()
const port = 3000

app.use(morgan('combined'))

app.get('/', (req, res, next) => {
  res.send('Hello World!')
  next
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})