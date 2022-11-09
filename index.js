import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res, next) => {
  res.send('Hello World!')
  next
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})