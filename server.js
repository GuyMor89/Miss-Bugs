import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

// app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/favicon.ico', (req, res) => res.status(204))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            // loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {

    if (!req.query.title || !req.query.severity) return res.send('Cannot save bug')

    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        _id: req.query._id,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            // loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})

app.get('/api/bug/:bugID', (req, res) => {
    const { bugID } = req.params

    let visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length === 2) return res.status(401).send('Wait for a bit')

    const seenBugsID = visitedBugs.find(currentID => currentID === bugID)
    if (!seenBugsID) visitedBugs.push(bugID)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

    bugService.getById(bugID)
        .then(bug => res.send(bug))
        .catch(err => {
            // loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

app.get('/api/bug/:bugID/remove', (req, res) => {
    const { bugID } = req.params
    bugService.remove(bugID)
        .then(() => res.send('Bug removed successfully'))
        .catch(err => {
            // loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

