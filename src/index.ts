import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan' 


dotenv.config()
import { neo4jDriver, findPersons } from './config/index'


const app = express()
const port = 3000

app.use(morgan('combined'))

app.get('/', (req, res, next) => {
  console.log('HELLO NEO4J')
  next()
})

app.get('/persons', async (req, res, next) => {
  try {
    const result = await neo4jDriver(findPersons)
    res.json(result)
  } catch(error) {
    res.status(500).json({ error })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

