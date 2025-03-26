import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './public/services/logger.service.js'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || ''
    }

    bugService.query(filterBy)
        .then((bugs => res.send(bugs)))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => {
            loggerService.info(`Bug ${bug._id} saved successfully`)
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => {
            loggerService.info(`Bug ${bug._id} updated successfully`)
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Cannot update bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitCountMap = [] } = req.cookies

    if (visitCountMap.length >= 3) return res.status(401).send('Wait for a bit')
    if (visitCountMap.includes(bugId)) visitCountMap.push(bugId)

    res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 10 })
    bugService.getById(bugId)
        .then(bug => {
            loggerService.info(`Bug ${bugId} loaded successfully`)
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId)
        .then(bug => {
            loggerService.info(`Bug ${bugId} removed successfully`)
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

app.listen(3031, () => loggerService.info('Server ready at port 3031'))