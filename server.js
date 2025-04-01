import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './public/services/logger.service.js'
const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Get all bugs
app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

    bugService.query(queryOptions)
        .then((bugs => res.send(bugs)))
        .catch(err => {
            loggerService.error('Cannot load bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }
    
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx : 0,
        pageSize: +queryParams.pageSize || 4,
    }
    
    return { filterBy, sortBy, pagination }
}

// Get bug by ID
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

// Create a new bug
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

// Update bug
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

// Delete bug
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