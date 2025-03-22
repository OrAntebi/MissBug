import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './public/services/logger.service.js'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())


app.get('/api/bug', (req, res) => {
    bugService.query()
        .then((bugs => res.send(bugs)))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

app.get('/api/bug/save', (req, res) => {

    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitCountMap = [] } = req.cookies

    if (visitCountMap.length >= 3) return res.status(401).send('Wait for a bit')
    if (visitCountMap.inCludes(bugId)) visitCountMap.push(bugId)

    res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 10 })
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

app.listen(3031, () => loggerService.info('Server ready at port 3031'))