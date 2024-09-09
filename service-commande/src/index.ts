import { serve } from '@hono/node-server'
import { Hono } from 'hono'
const {pool, testConnection} = require('./config/db'); // Importe le pool MySQL
const app = new Hono()

testConnection();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
