import express from 'express'
const app = express()

app.get('/api/bug', (req, res) => {})
app.get('/api/bug/save', (req, res) => {})
app.get('/api/bug/:bugId', (req, res) => {})
app.get('/api/bug/:bugId/remove', (req, res) => {})


app.get('/', (req, res) => res.send('Hello there'))
app.listen(3031, () => console.log('Server ready at port 3031'))
