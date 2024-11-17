import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/favicon.ico', (req, res) => res.status(204))

app.get('/api/bug', (req, res) => {

    bugService.query(req.query)
        .then(bugs => res.send(bugs))
        .catch(err => {
            // loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

app.get('/api/bug/pdf', (req, res) => {
    bugService.setupPDF()
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

app.post('/api/bug', (req, res) => {

    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Cannot add bug')

    bugService.save(req.body, user)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            // loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

app.put('/api/bug/:bugID', (req, res) => {

    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Cannot add bug')

    if (!req.body.title || !req.body.severity || !req.body.description) return res.send('Cannot update bug')

    bugService.save(req.body, user)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            // loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

app.delete('/api/bug/:bugID', (req, res) => {

    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Cannot add bug')

    const { bugID } = req.params
    bugService.remove(bugID, user)
        .then(() => res.send('Bug removed successfully'))
        .catch(err => {
            // loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})


app.post('/api/auth/login', (req, res) => {

    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(404).send('Invalid Credentials')
            }
        })
})

app.get('/api/user', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)

    if (!user) return res.status(401).send('No user logged in')
    if (!user.isAdmin) return res.status(401).send('Not authorized to view users')

    userService.query()
        .then(users => res.send(users))
        .catch(() => res.status(500).send('Cannot get users'))
})

app.get('/api/user/:userID', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)

    if (!user) return res.status(401).send('No user logged in')
    if (!user.isAdmin) return res.status(401).send('Not authorized to view users')

    const { userID } = req.params

    userService.getById(userID)
        .then(user => res.send(user))
        .catch(() => res.status(500).send('Cannot get user'))
})

app.delete('/api/user/:userID', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)

    if (!user) return res.status(401).send('No user logged in')
    if (!user.isAdmin) return res.status(401).send('Not authorized to view users')

    const { userID } = req.params

    bugService.hasBugs(userID)
        .then(() => userService.remove(userID))
        .then(() => res.send('Removed!'))
        .catch((err) => {
            console.log(err)
            if (err === 'Cannot delete user with bugs') {
                res.status(401).send('Cannot delete user with bugs')
            } else {
                res.status(500).send('An unexpected error occurred')
            }
        })

})

app.get('/api/auth/verify', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)

    if (user) return res.send(user)
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

